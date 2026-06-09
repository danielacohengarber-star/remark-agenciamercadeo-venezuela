'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import BubbleField from './BubbleField'

type Segment = {
  text: string
  underline?: string
  color?: string
  bold?: boolean
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
// treatment. The \n breaks it across two lines ("…merece" / "ser subrayado.").
// Full sentence: "Tomamos marcas, mensajes y proyectos y destacamos lo que
// merece ser subrayado."
const FINAL_TEXT = 'destacamos lo que merece\nser subrayado.'

const BASE_SEGMENTS = [...LINE_1, ...LINE_2]
const BASE_TEXT = BASE_SEGMENTS.map((segment) => segment.text).join('')

const TYPE_SPEED = 42

export default function Statement() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const [baseTyped, setBaseTyped] = useState(0)
  const [finalTyped, setFinalTyped] = useState(0)
  const [active, setActive] = useState(false)
  const [runKey, setRunKey] = useState(0)

  // The closing phrase types in white, erases itself, then rewrites in red and
  // finally draws the red "subrayado" beneath it.
  const [finalMode, setFinalMode] = useState<
    'hidden' | 'typing' | 'erasing' | 'retyping' | 'done'
  >('hidden')
  const [finalColor, setFinalColor] = useState<'white' | 'red'>('white')

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
            setFinalColor('white')

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
                          }, 200)
                        )
                      }
                    }, TYPE_SPEED * 0.65) // erase slightly faster than typing

                    timers.push(eraseInterval)
                  }, 420)
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
        <BubbleField lightMode={false} />

        {/* Radial vignette: seats the colour blobs and keeps the copy crisp. */}
        <div aria-hidden="true" className="bg-vignette" />

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
              fontWeight: segment.bold ? 600 : 400,
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
  // Render the \n inside FINAL_TEXT as a real <br />
  const visibleText = FINAL_TEXT.slice(0, typed)
  const lines = visibleText.split('\n')

  return (
    <span
      style={{
        position: 'relative',
        color: color,
        fontWeight: 600,
        fontStyle: color === '#D6272E' ? 'italic' : 'normal',
        transition: 'color 0.15s ease, font-style 0.15s ease',
        whiteSpace: 'pre-wrap',
        display: 'inline',
      }}
    >
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}

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

