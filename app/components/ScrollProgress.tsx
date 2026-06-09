'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Fixed brand-gradient progress bar that scales with page scroll.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 60,
        transformOrigin: 'left',
        scaleX,
        background: 'linear-gradient(90deg, #D6272E, #DE5829, #FFB719)',
      }}
    />
  )
}
