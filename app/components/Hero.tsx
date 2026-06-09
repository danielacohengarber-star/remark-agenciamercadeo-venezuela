'use client'

import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { useHeroReady } from './SiteChrome'

interface HeroProps {
  headline1?: string
}

interface BlobDef {
  color: string
  size: number
  top: string
  left: string
  ampX: number
  ampY: number
  dur: number
  /** Pointer-parallax factor (0–1). Different per blob → layered depth. */
  depth: number
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TYPE_SPEED = 55
const IMG_DUR = 1.0
const UNDERLINE_DUR = 1.15
const SCROLL_DELAY = 2.2

// Soft, trailing spring for the pointer parallax — premium, not snappy.
const PARALLAX_SPRING = { stiffness: 45, damping: 18, mass: 0.6 }

const BLOBS: BlobDef[] = [
  { color: '#D6272E', size: 560, top: '58%', left: '64%', ampX: 80, ampY: 70, dur: 15, depth: 0.11 },
  { color: '#FFB719', size: 520, top: '70%', left: '10%', ampX: 65, ampY: 90, dur: 16, depth: 0.06 },
  { color: '#72C3D7', size: 520, top: '78%', left: '52%', ampX: 75, ampY: 60, dur: 18, depth: 0.13 },
  { color: '#DE5829', size: 500, top: '66%', left: '28%', ampX: 90, ampY: 80, dur: 20, depth: 0.08 },
  { color: '#EBB2BB', size: 540, top: '72%', left: '42%', ampX: 70, ampY: 65, dur: 13, depth: 0.10 },
]

const WORDS = ['Estrategia.', 'Creatividad.', 'Performance.']

export default function Hero({ headline1 = "Let's make something" }: HeroProps) {
  const heroReady = useHeroReady()
  const reduce = useReducedMotion()

  const [typed, setTyped] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [mouseEnabled, setMouseEnabled] = useState(false)
  const [ctaClicked, setCtaClicked] = useState(false)
  const [sliding, setSliding] = useState(false)

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

    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX - window.innerWidth / 2)
      mouseY.set(event.clientY - window.innerHeight / 2)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseEnabled, mouseX, mouseY])

  useEffect(() => {
    if (!heroReady) return

    if (reduce) {
      setTyped(headline1.length)
      setTypingDone(true)
      return
    }

    let index = 0

    const interval = window.setInterval(() => {
      index += 1
      setTyped(index)

      if (index >= headline1.length) {
        window.clearInterval(interval)
        window.setTimeout(() => setTypingDone(true), 220)
      }
    }, TYPE_SPEED)

    return () => window.clearInterval(interval)
  }, [heroReady, headline1, reduce])

  const handleCTA = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (ctaClicked) return

    setCtaClicked(true)

    const totalStagger = WORDS.length * 0.25 + 0.9

    window.setTimeout(() => {
      setSliding(true)

      window.setTimeout(() => {
        const target = document.getElementById('trabajo')
        if (target) target.scrollIntoView({ behavior: 'smooth' })

        window.setTimeout(() => setSliding(false), 600)
      }, 500)
    }, totalStagger * 1000)
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ x: '0%', opacity: 0 }}
        animate={sliding ? { x: '-100%', opacity: 1 } : { x: '0%', opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0D0D0D',
          zIndex: 100,
          pointerEvents: sliding ? 'all' : 'none',
        }}
      />

      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#0D0D0D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {BLOBS.map((blob, index) => (
          <Blob
            key={index}
            blob={blob}
            mouseX={mouseX}
            mouseY={mouseY}
            mouseEnabled={mouseEnabled}
            reduce={!!reduce}
          />
        ))}

        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ width: '100%' }}>
            <span
              style={{
                fontFamily: 'Nimora, sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(36px, 5.5vw, 88px)',
                color: '#F5F0E8',
                display: 'inline-block',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                minHeight: '1em',
              }}
            >
              {headline1.slice(0, typed)}

              {heroReady && !typingDone && (
                <motion.span
                  aria-hidden="true"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{
                    duration: 0.75,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    display: 'inline-block',
                    width: '0.055em',
                    height: '0.82em',
                    backgroundColor: '#F5F0E8',
                    marginLeft: '0.06em',
                    transform: 'translateY(0.08em)',
                  }}
                />
              )}
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              width: '75%',
              marginTop: 'clamp(4px, 0.6vw, 12px)',
            }}
          >
            <motion.img
              src="/assets/logo/remarkable_transparent.png"
              srcSet="/assets/logo/remarkable_transparent.png 1x, /assets/logo/remarkable_transparent@2x.png 2x"
              alt="Remarkable"
              width={2154}
              height={336}
              initial={{ opacity: 0, y: 30 }}
              animate={typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: reduce ? 0 : IMG_DUR,
                ease: EASE_OUT,
              }}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                background: 'transparent',
              }}
            />

            <svg
              viewBox="0 0 1000 40"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '0%',
                top: '95%',
                width: '100%',
                transform: 'translateY(-50%) rotate(-0.6deg)',
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              <motion.path
                d="M10,24 C160,12 300,30 480,20 C660,11 820,31 990,18"
                stroke="#FFB719"
                strokeWidth={14}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  typingDone
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  pathLength: {
                    duration: reduce ? 0 : UNDERLINE_DUR,
                    ease: [0.76, 0, 0.24, 1],
                    delay: reduce ? 0 : 0.95,
                  },
                  opacity: {
                    duration: 0.01,
                    delay: reduce ? 0 : 0.95,
                  },
                }}
              />
            </svg>
          </div>

          <div style={{ height: 'clamp(56px, 8vh, 100px)' }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: reduce ? 0 : 0.8,
              ease: EASE_OUT,
              delay: reduce ? 0 : 1.65,
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '1.8em',
              }}
            >
              {WORDS.map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 12 }}
                  animate={ctaClicked ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    ease: EASE_OUT,
                    delay: reduce ? 0 : index * 0.25,
                  }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    fontSize: 'clamp(16px, 1.4vw, 20px)',
                    lineHeight: 1.5,
                    color: 'rgba(245,240,232,0.75)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <a
              href="#trabajo"
              onClick={handleCTA}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 15,
                color: '#F5F0E8',
                border: '2px solid rgba(245,240,232,0.5)',
                background: 'transparent',
                padding: '12px 28px',
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                transition:
                  'background-color 200ms ease, color 200ms ease, border-color 200ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F0E8'
                e.currentTarget.style.color = '#1A1A1A'
                e.currentTarget.style.borderColor = '#F5F0E8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#F5F0E8'
                e.currentTarget.style.borderColor = 'rgba(245,240,232,0.5)'
              }}
            >
              Ver nuestro trabajo →
            </a>
          </motion.div>
        </div>

        <ScrollIndicator start={typingDone} reduce={!!reduce} />
      </section>
    </>
  )
}

function Blob({
  blob,
  mouseX,
  mouseY,
  mouseEnabled,
  reduce,
}: {
  blob: BlobDef
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  mouseEnabled: boolean
  reduce: boolean
}) {
  // Pointer parallax lives on the OUTER layer; the idle drift lives on the
  // INNER layer. Nesting composes both transforms instead of letting
  // `animate` and `style` fight over the same x/y (the original bug, where
  // the spring silently overrode the float so the blobs never reacted).
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
        animate={
          reduce
            ? {}
            : {
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
              }
        }
        transition={
          reduce
            ? {}
            : {
                duration: blob.dur,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }
        }
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: blob.color,
          filter: 'blur(120px)',
          opacity: 0.45,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
    </motion.div>
  )
}

function ScrollIndicator({
  start,
  reduce,
}: {
  start: boolean
  reduce: boolean
}) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setHidden(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const visible = start && !hidden

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{
        duration: 0.6,
        delay: visible && !reduce ? SCROLL_DELAY : 0,
      }}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        pointerEvents: visible ? 'auto' : 'none',
        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 28,
          height: 48,
          border: '2px solid #F5F0E8',
          borderRadius: 999,
        }}
      >
        <motion.div
          animate={{ y: reduce ? 11 : [6, 22, 6] }}
          transition={{
            duration: 1.8,
            repeat: reduce ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            marginLeft: -3,
            width: 6,
            height: 6,
            borderRadius: 999,
            backgroundColor: '#DE5829',
          }}
        />
      </div>

      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.6)',
        }}
      >
        scroll
      </span>
    </motion.div>
  )
}
