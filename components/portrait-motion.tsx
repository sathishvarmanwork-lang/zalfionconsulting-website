'use client'
import { useEffect } from 'react'

export function PortraitMotion() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('portrait-arrived'); observer.unobserve(entry.target) }
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('.partner,.leadership article,.team-group').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return null
}
