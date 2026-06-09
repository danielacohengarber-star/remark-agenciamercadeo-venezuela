'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export default function CustomCursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (reduce) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const wide = window.matchMedia('(min-width: 769px)').matches
    if (fine && wide) setEnabled(true)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    document.body.style.cursor = 'none'
    function onMove(e: MouseEvent) { x.set(e.clientX); y.set(e.clientY) }
    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      setHovering(Boolean(target?.closest('a, button, [role="button"]')))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 24, height: 24, borderRadius: '999px',
        border: '1.5px solid #FFFFFF',   /* blanco: con blend difference se ve sobre el negro y sobre el pill claro */
        mixBlendMode: 'difference',        /* se ve en cualquier fondo */
        pointerEvents: 'none', zIndex: 9998,
        x: springX, y: springY,
        marginLeft: -12, marginTop: -12,
      }}
      animate={{ scale: hovering ? 2.5 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  )
}
