'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { animate } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

const FLASH_COLORS = [
  '#D6272E', // red
  '#FFB719', // yellow
  '#72C3D7', // blue
  '#DE5829', // orange
  '#EBB2BB', // pink
  '#0D0D0D', // black — exits seamlessly into the dark hero background
]
const FLASH_HOLD = 200 // ms each color holds

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const logo    = logoRef.current
    const wrap    = wrapRef.current
    if (!overlay || !logo || !wrap) return

    // Respect prefers-reduced-motion — skip straight to done
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete()
      return
    }

    let cancelled = false

    async function run() {
      // ── 1. Color flashes — wordmark visible throughout ──────────────
      for (const color of FLASH_COLORS) {
        if (cancelled) return
        overlay!.style.backgroundColor = color
        // Invert the ink wordmark to white so it stays legible on every
        // saturated flash AND on the final black frame.
        logo!.style.filter = 'invert(1) brightness(2)'
        await new Promise<void>((res) => setTimeout(res, FLASH_HOLD))
      }

      // Final flash is black — keep the wordmark white so it reads.
      logo!.style.filter = 'invert(1) brightness(2)'

      if (cancelled) return

      // ── 2. Brief hold so the wordmark reads on black ────────────────
      await new Promise<void>((res) => setTimeout(res, 300))

      if (cancelled) return

      // ── 3. Clip-path wipe upward ────────────────────────────────────
      await animate(
        wrap!,
        { clipPath: ['inset(0 0 0% 0)', 'inset(0 0 100% 0)'] },
        { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
      ).finished

      if (cancelled) return

      // ── 4. Unmount signal ───────────────────────────────────────────
      onComplete()
    }

    run()

    return () => {
      cancelled = true
    }
  }, [onComplete])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        clipPath: 'inset(0 0 0% 0)',
      }}
    >
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0D0D0D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 60ms linear',
        }}
      >
        {/* Full wordmark, visible throughout the entire preloader */}
        <div ref={logoRef} style={{ transition: 'filter 60ms linear' }}>
          <Image
            src="/assets/logo/remark-wordmark-ink.png"
            alt="REMARK"
            width={409}
            height={116}
            priority
            style={{ width: 220, height: 'auto', display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}
