import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const fontDir = new URL('../public/fonts/', import.meta.url)
const families = {
  Satoshi: ['Regular', 'Medium', 'Bold', 'Black'],
  Switzer: ['Regular', 'Medium', 'Bold']
}

async function exists(url) {
  try {
    await readFile(url)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

for (const [family, weights] of Object.entries(families)) {
  const missing = []
  for (const weight of weights) {
    const name = family === 'Switzer' ? { Regular: '400', Medium: '500', Bold: '700' }[weight] : weight
    const filename = `${family}-${name}.woff2`
    if (!(await exists(new URL(filename, fontDir)))) missing.push({ weight, filename })
  }
  if (missing.length === 0) continue

  const response = await fetch(`https://api.fontshare.com/v2/fonts/download/${family.toLowerCase()}`)
  if (!response.ok) throw new Error(`Could not download ${family} from Fontshare: HTTP ${response.status}`)
  const temporaryDir = await mkdtemp(join(tmpdir(), 'zalfion-fonts-'))
  const archive = join(temporaryDir, `${family}.zip`)
  try {
    await writeFile(archive, Buffer.from(await response.arrayBuffer()))
    for (const { weight, filename } of missing) {
      const entry = `${family}_Complete/Fonts/WEB/fonts/${family}-${weight}.woff2`
      const data = execFileSync('unzip', ['-p', archive, entry])
      await writeFile(new URL(filename, fontDir), data)
      process.stdout.write(`Downloaded ${filename} from Fontshare\n`)
    }
  } finally {
    await rm(temporaryDir, { recursive: true, force: true })
  }
}
