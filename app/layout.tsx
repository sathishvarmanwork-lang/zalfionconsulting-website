import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SpotlightCursor } from '@/components/spotlight-cursor'
const satoshi = localFont({
  src: [
    { path: '../public/fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/Satoshi-Black.woff2', weight: '900', style: 'normal' }
  ],
  variable: '--font-satoshi',
  display: 'swap'
})
export const metadata: Metadata = {
  title: 'Zalfion Consulting | AI 2nd Brains for Business',
  description: 'We build and deploy AI 2nd Brains for revenue and operations. Connect your company knowledge, tools, and workflows with Zalfion Consulting.',
  robots: { index: false, follow: false },
  icons: { icon: '/images/logo.jpg' }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={satoshi.variable}><body>{children}<SpotlightCursor /></body></html>
}
