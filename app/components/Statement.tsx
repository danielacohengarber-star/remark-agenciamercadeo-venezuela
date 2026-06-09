'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

type Segment = {
  text: string
  underline?: string
  color?: string
  bold?: boolean
}

type BlobDef = {
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

const LINE_1: Segment[] = [
  { text: 'Tomamos ' },
  { text: 'marcas', underline: '#72C3D7', bold: true },
  { text: ', ' },
  { text: 'mensajes', underline: '#EBB2BB', bold: true },
  { text: ' y' },
]

const LINE_2: Segment[] = [
  { text: 'proyectos', underline: '#FFB719', bold: true },
  { text: ' y ' },
]

// "destacamos" lives in the final phrase so it gets the erase + rewrite-in-red
// treatment. Full sentence: "Tomamos marcas, mensajes y proyectos y destacamos
// lo que merece ser subrayado."
const FINAL_TEXT = 'destacamos lo que merece ser subrayado'

const BASE_SEGMENTS = [...LINE_1, ...LINE_2]
const BASE_TEXT = BASE_SEGMENTS.map((segment) => segment.text).join('')

const TYPE_SPEED = 42

// Soft, trailing spring for the pointer parallax — premium, not snappy.
const PARALLAX_SPRING = { stiffness: 45, damping: 18, mass: 0.6 }

const BLOBS: BlobDef[] = [
  { color: '#D6272E', size: 500, top: '8%',  left: '60%', ampX: 80, ampY: 70, dur: 15, depth: 0.10 },
  { color: '#FFB719', size: 460, top: '58%', left: '5%',  ampX: 65, ampY: 90, dur: 16, depth: 0.06 },
  { color: '#72C3D7', size: 480, top: '72%', left: '70%', ampX: 75, ampY: 60, dur: 18, depth: 0.12 },
  { color: '#DE5829', size: 440, top: '20%', left: '20%', ampX: 90, ampY: 80, dur: 20, depth: 0.08 },
  { color: '#EBB2BB', size: 490, top: '42%', left: '45%', ampX: 70, ampY: 65, dur: 13, depth: 0.10 },
]

export default function Statement() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const [baseTyped, setBaseTyped] = useState(0)
  const [finalTyped, setFinalTyped] = useState(0)
  const [active, setActive] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const [mouseEnabled, setMouseEnabled] = useState(false)

  // The closing phrase types in white, erases itself, then rewrites in red and
  // finally draws the red "subrayado" beneath it.
  const [finalMode, setFinalMode] = useState<
    'hidden' | 'typing' | 'erasing' | 'retyping' | 'done'
  >('hidden')
  const [finalColor, setFinalColor] = useState<'white' | 'red'>('white')

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
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          setBaseTyped(0)
          setFinalTyped(0)
          setFinalMode('hidden')
          setRunKey((current) => current + 1)
        } else {
          setActive(false)
        }
      },
      { threshold: 0.24 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return

    if (reduce) {
      setBaseTyped(BASE_TEXT.length)
      setFinalTyped(FINAL_TEXT.length)
      setFinalColor('red')
      setFinalMode('done')
      return
    }

    let baseIndex = 0
    let finalIndex = 0
    const timers: number[] = []

    const baseInterval = window.setInterval(() => {
      baseIndex += 1
      setBaseTyped(baseIndex)

      if (baseIndex >= BASE_TEXT.length) {
        window.clearInterval(baseInterval)

        timers.push(
          window.setTimeout(() => {
            setFinalMode('typing')

            const finalInterval = window.setInterval(() => {
              finalIndex += 1
              setFinalTyped(finalIndex)

              if (finalIndex >= FINAL_TEXT.length) {
                window.clearInterval(finalInterval)

                // Phase 1 done: pause, then ERASE the phrase backwards.
                timers.push(
                  window.setTimeout(() => {
                    setFinalMode('erasing')
                    let eraseIndex = FINAL_TEXT.length

                    const eraseInterval = window.setInterval(() => {
                      eraseIndex -= 1
                      setFinalTyped(eraseIndex)

                      if (eraseIndex <= 0) {
                        window.clearInterval(eraseInterval)

                        // Phase 2 done: pause, then RETYPE in red.
                        timers.push(
                          window.setTimeout(() => {
                            setFinalColor('red')
                            setFinalMode('retyping')
                            let retypeIndex = 0

                            const retypeInterval = window.setInterval(() => {
                              retypeIndex += 1
                              setFinalTyped(retypeIndex)

                              if (retypeIndex >= FINAL_TEXT.length) {
                                window.clearInterval(retypeInterval)
                                timers.push(
                                  window.setTimeout(
                                    () => setFinalMode('done'),
                                    260
                                  )
                                )
                              }
                            }, TYPE_SPEED)

                            timers.push(retypeInterval)
                          }, 180)
                        )
                      }
                    }, TYPE_SPEED * 0.7) // erase slightly faster than typing

                    timers.push(eraseInterval)
                  }, 400)
                )
              }
            }, TYPE_SPEED)

            timers.push(finalInterval)
          }, 220)
        )
      }
    }, TYPE_SPEED)

    return () => {
      window.clearInterval(baseInterval)
      // ids are shared between setTimeout/setInterval, so clear both ways.
      timers.forEach((id) => {
        window.clearTimeout(id)
        window.clearInterval(id)
      })
    }
  }, [active, runKey, reduce])

  const showFinalUnderline = finalMode === 'done'

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: '#0D0D0D',
        marginTop: '-1px',
      }}
    >
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#0D0D0D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(82px, 11vh, 132px) 0 clamp(104px, 14vh, 160px)',
          overflow: 'hidden',
        }}
      >
        {/* Radial vignette: seats the colour blobs and keeps the copy crisp. */}
        <div aria-hidden="true" className="bg-vignette" />

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
            zIndex: 3,
            width: '100%',
            textAlign: 'center',
            transform: 'translateY(-3.5vh)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 'clamp(26px, 3.65vw, 52px)',
              lineHeight: 1.15,
              letterSpacing: '-0.027em',
              color: '#F5F0E8',
              margin: '0 auto',
              maxWidth: '1060px',
            }}
          >
            <div>
              <TypedSegments
                segments={LINE_1}
                typed={baseTyped}
                offset={0}
                reduce={!!reduce}
              />
            </div>

            <div>
              <TypedSegments
                segments={LINE_2}
                typed={baseTyped}
                offset={LINE_1.map((segment) => segment.text).join('').length}
                reduce={!!reduce}
              />

              {finalMode !== 'hidden' && (
                <FinalText
                  typed={finalTyped}
                  showUnderline={showFinalUnderline}
                  color={finalColor === 'red' ? '#D6272E' : '#F5F0E8'}
                  reduce={!!reduce}
                />
              )}

              {active && finalMode !== 'done' && (
                <TypingCursor
                  color={finalColor === 'red' ? '#D6272E' : '#F5F0E8'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TypedSegments({
  segments,
  typed,
  offset,
  reduce,
}: {
  segments: Segment[]
  typed: number
  offset: number
  reduce: boolean
}) {
  let charCount = offset

  return (
    <>
      {segments.map((segment, index) => {
        const start = charCount
        const end = charCount + segment.text.length
        charCount = end

        const visibleChars = Math.max(
          0,
          Math.min(segment.text.length, typed - start)
        )

        const visibleText = segment.text.slice(0, visibleChars)
        const fullyTyped = typed >= end

        if (!visibleText) return null

        return (
          <span
            key={`${segment.text}-${index}`}
            style={{
              position: 'relative',
              color: segment.color ?? '#F5F0E8',
              fontWeight: segment.bold ? 700 : 400,
              whiteSpace: 'pre',
              display: 'inline-block',
              transform: segment.bold
                ? 'translateY(0)'
                : 'translateY(0.08em)',
            }}
          >
            {visibleText}

            {segment.underline && (
              <svg
                viewBox="0 0 200 16"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-0.16em',
                  width: '100%',
                  height: '0.34em',
                  overflow: 'visible',
                  pointerEvents: 'none',
                }}
              >
                <motion.path
                  d="M4,9 C40,4 80,13 120,7 C150,3 175,11 196,6"
                  stroke={segment.underline}
                  strokeWidth={5.5}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: fullyTyped ? 1 : 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.48,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                />
              </svg>
            )}
          </span>
        )
      })}
    </>
  )
}

function FinalText({
  typed,
  showUnderline,
  color,
  reduce,
}: {
  typed: number
  showUnderline: boolean
  color: string
  reduce: boolean
}) {
  return (
    <span
      style={{
        position: 'relative',
        color: color,
        transition: 'color 0.2s ease',
        fontWeight: 700,
        whiteSpace: 'pre',
        display: 'inline-block',
      }}
    >
      {FINAL_TEXT.slice(0, typed)}

      {showUnderline && (
        <svg
          viewBox="0 0 300 16"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            bottom: '-0.16em',
            width: '100%',
            height: '0.34em',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <motion.path
            d="M4,9 C65,4 125,13 185,7 C225,3 260,11 296,6"
            stroke="#D6272E"
            strokeWidth={5.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: reduce ? 0 : 0.62,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        </svg>
      )}
    </span>
  )
}

function TypingCursor({ color }: { color: string }) {
  return (
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
        width: '0.052em',
        height: '0.86em',
        backgroundColor: color,
        marginLeft: '0.05em',
        verticalAlign: 'baseline',
        transform: 'translateY(0.08em)',
      }}
    />
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
  // Outer layer = pointer parallax, inner layer = idle drift (composed via
  // nesting so the two transforms don't overwrite each other).
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
          filter: 'blur(110px)',
          opacity: 0.32,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
    </motion.div>
  )
}
