'use client'

import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

interface BlobDef {
  size: number
  top: string
  left: string
  ampX: number
  ampY: number
  dur: number
  depth: number
}

// Dark sections (Hero + Statement) — screen-blended on the black base.
const DARK_COLORS = ['#D6272E', '#FFB719', '#72C3D7', '#DE5829', '#EBB2BB']

// Light section (Services) — multiply-blended on the beige base.
const LIGHT_COLORS = ['#D6272E', '#FFB719', '#72C3D7', '#DE5829', '#EBB2BB']

// Shared layout: identical positions/sizes across every section so the field
// reads as one continuous living background rather than per-section blobs.
const BLOBS: BlobDef[] = [
  { size: 560, top: '18%', left: '64%', ampX: 80, ampY: 70, dur: 15, depth: 0.11 },
  { size: 520, top: '42%', left: '10%', ampX: 65, ampY: 90, dur: 16, depth: 0.06 },
  { size: 520, top: '62%', left: '52%', ampX: 75, ampY: 60, dur: 18, depth: 0.13 },
  { size: 500, top: '30%', left: '28%', ampX: 90, ampY: 80, dur: 20, depth: 0.08 },
  { size: 540, top: '76%', left: '42%', ampX: 70, ampY: 65, dur: 13, depth: 0.10 },
]

const PARALLAX_SPRING = { stiffness: 45, damping: 18, mass: 0.6 }

export default function BubbleField({
  lightMode = false,
}: {
  lightMode?: boolean
}) {
  const reduce = useReducedMotion()
  const [mouseEnabled, setMouseEnabled] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const check = () => {
      const fine = window.matchMedia('(pointer: fine)').matches
      const wide = window.matchMedia('(min-width: 769px)').matches
      if (fine && wide && !reduce) setMouseEnabled(true)
    }
    check()
    // Re-check on first pointer move in case the check ran too early
    // (e.g. while the preloader was still blocking input).
    window.addEventListener('pointermove', check, { once: true })
    return () => window.removeEventListener('pointermove', check)
  }, [reduce])

  useEffect(() => {
    if (!mouseEnabled) return
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseEnabled, mouseX, mouseY])

  if (reduce) return null

  const colors = lightMode ? LIGHT_COLORS : DARK_COLORS

  return (
    <>
      {BLOBS.map((blob, i) => (
        <GlobalBlob
          key={i}
          blob={blob}
          color={colors[i]}
          mouseX={mouseX}
          mouseY={mouseY}
          mouseEnabled={mouseEnabled}
          lightMode={lightMode}
        />
      ))}
    </>
  )
}

function GlobalBlob({
  blob,
  color,
  mouseX,
  mouseY,
  mouseEnabled,
  lightMode,
}: {
  blob: BlobDef
  color: string
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  mouseEnabled: boolean
  lightMode: boolean
}) {
  // Outer layer = pointer parallax; inner layer = idle drift. Nesting composes
  // both transforms instead of letting them overwrite each other.
  const springX = useSpring(mouseX, PARALLAX_SPRING)
  const springY = useSpring(mouseY, PARALLAX_SPRING)
  const parallaxX = useTransform(springX, (v) => v * blob.depth)
  const parallaxY = useTransform(springY, (v) => v * blob.depth)

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: blob.top,
        left: blob.left,
        width: blob.size,
        height: blob.size,
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
        x: mouseEnabled ? parallaxX : 0,
        y: mouseEnabled ? parallaxY : 0,
      }}
    >
      <motion.div
        animate={{
          x: [
            -blob.ampX,
            blob.ampX,
            -blob.ampX * 0.6,
            blob.ampX * 0.8,
            -blob.ampX,
          ],
          y: [
            blob.ampY * 0.5,
            -blob.ampY,
            blob.ampY * 0.8,
            -blob.ampY * 0.4,
            blob.ampY * 0.5,
          ],
        }}
        transition={{
          duration: blob.dur,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: color,
          filter: 'blur(120px)',
          opacity: lightMode ? 0.55 : 0.42,
          mixBlendMode: lightMode ? 'multiply' : 'screen',
          willChange: 'transform',
        }}
      />
    </motion.div>
  )
}
