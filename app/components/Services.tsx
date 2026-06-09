'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

interface CopyPart {
  text: string
  glow?: 0 | 1 | 2
}

interface Service {
  num: string
  title: string
  color: string
  copy: CopyPart[]
}

interface BlobDef {
  size: number
  top: string
  left: string
  ampX: number
  ampY: number
  dur: number
  opacity: number
  tone: 0 | 1 | 2
  /** Pointer-parallax factor (0–1). Different per blob → layered depth. */
  depth: number
}

const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Estrategia & Dirección Creativa',
    color: '#D6272E',
    copy: [
      { text: 'Definimos el ' },
      { text: 'enfoque', glow: 0 },
      { text: ', el ' },
      { text: 'concepto', glow: 1 },
      { text: ' y la ' },
      { text: 'dirección', glow: 2 },
      { text: ' general de cada proyecto. Aquí se toman las decisiones que ordenan todo lo demás.' },
    ],
  },
  {
    num: '02',
    title: 'Branding & Web',
    color: '#FFB719',
    copy: [
      { text: 'Desarrollamos identidades de marca coherentes y funcionales. Desde el concepto hasta su aplicación en distintos formatos y canales.' },
    ],
  },
  {
    num: '03',
    title: 'Contenido & Social',
    color: '#72C3D7',
    copy: [
      { text: 'Creamos estrategias y piezas de contenido pensadas para plataformas digitales, con foco en ' },
      { text: 'claridad, consistencia y relevancia', glow: 0 },
      { text: '.' },
    ],
  },
  {
    num: '04',
    title: 'Campañas',
    color: '#DE5829',
    copy: [
      { text: 'Diseñamos campañas creativas alineadas a objetivos específicos, adaptadas a distintos medios y momentos.' },
    ],
  },
  {
    num: '05',
    title: 'Paid Media',
    color: '#EBB2BB',
    copy: [
      { text: 'Planificamos y optimizamos campañas pagas para diferentes redes sociales para ' },
      { text: 'ampliar alcance, mejorar resultados y escalar ideas', glow: 0 },
      { text: '.' },
    ],
  },
  {
    num: '06',
    title: 'Producción',
    color: '#D6272E',
    copy: [
      { text: 'Ejecutamos piezas audiovisuales y gráficas, asegurando que la idea se mantenga clara en cada formato.' },
    ],
  },
]

const BLOBS: BlobDef[] = [
  {
    size: 430,
    top: '8%',
    left: '54%',
    ampX: 82,
    ampY: 68,
    dur: 15,
    opacity: 0.34,
    tone: 0,
    depth: 0.12,
  },
  {
    size: 390,
    top: '54%',
    left: '74%',
    ampX: 70,
    ampY: 86,
    dur: 17,
    opacity: 0.26,
    tone: 1,
    depth: 0.07,
  },
  {
    size: 410,
    top: '30%',
    left: '28%',
    ampX: 78,
    ampY: 62,
    dur: 13,
    opacity: 0.3,
    tone: 2,
    depth: 0.1,
  },
]

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Soft, trailing spring for the pointer parallax — premium, not snappy.
const PARALLAX_SPRING = { stiffness: 45, damping: 18, mass: 0.6 }

function getBlobTone(baseColor: string, tone: 0 | 1 | 2) {
  const tones: Record<string, string[]> = {
    '#D6272E': ['#D6272E', '#DE5829', '#EBB2BB'],
    '#FFB719': ['#FFB719', '#DE5829', '#F6D36B'],
    '#72C3D7': ['#72C3D7', '#3FAFC8', '#B7E4EE'],
    '#DE5829': ['#DE5829', '#D6272E', '#FFB719'],
    '#EBB2BB': ['#EBB2BB', '#D6272E', '#F4C8D0'],
  }

  return tones[baseColor]?.[tone] ?? baseColor
}

export default function Services() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  const [hovered, setHovered] = useState<number | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mouseEnabled, setMouseEnabled] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const activeIndex = openIndex ?? hovered
  const activeColor = activeIndex !== null ? SERVICES[activeIndex].color : '#72C3D7'

  useEffect(() => {
    const check = () => {
      const fine = window.matchMedia('(pointer: fine)').matches
      const wide = window.matchMedia('(min-width: 769px)').matches
      if (fine && wide && !reduce) setMouseEnabled(true)
    }
    check()
    // Re-check on first pointer move in case the check ran too early.
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

  const toggleService = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="services-section"
      style={{
        position: 'relative',
        backgroundColor: '#F5F0E8',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(56px, 8vh, 96px) 0',
        overflow: 'hidden',
      }}
    >
      {!reduce &&
        BLOBS.map((blob, index) => (
          <Blob
            key={index}
            blob={blob}
            color={activeColor}
            mouseX={mouseX}
            mouseY={mouseY}
            mouseEnabled={mouseEnabled}
            reduce={!!reduce}
          />
        ))}

      {/* Vignette seats the blobs into the beige and keeps the list legible. */}
      <div aria-hidden="true" className="bg-vignette-light" />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
        }}
      >
        <SectionHeader reduce={!!reduce} />

        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'clamp(24px, 4vh, 44px)',
            borderTop: '1px solid rgba(26,26,26,0.12)',
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {SERVICES.map((service, index) => (
            <ServiceRow
              key={service.num}
              service={service}
              index={index}
              isHovered={hovered === index}
              isOpen={openIndex === index}
              isDimmed={
                (hovered !== null && hovered !== index) ||
                (openIndex !== null && openIndex !== index)
              }
              onHover={() => setHovered(index)}
              onClick={() => toggleService(index)}
              reduce={!!reduce}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

function Blob({
  blob,
  color,
  mouseX,
  mouseY,
  mouseEnabled,
  reduce,
}: {
  blob: BlobDef
  color: string
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  mouseEnabled: boolean
  reduce: boolean
}) {
  // Outer layer = pointer parallax; inner layer = idle drift + the
  // hover-reactive colour shift. Nesting composes both transforms instead
  // of letting `animate` and `style` fight over x/y (the original bug).
  const springX = useSpring(mouseX, PARALLAX_SPRING)
  const springY = useSpring(mouseY, PARALLAX_SPRING)
  const parallaxX = useTransform(springX, (v) => v * blob.depth)
  const parallaxY = useTransform(springY, (v) => v * blob.depth)
  const toneColor = getBlobTone(color, blob.tone)

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
                backgroundColor: toneColor,
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
                backgroundColor: {
                  duration: 0.45,
                  repeat: 0,
                  ease: 'easeOut',
                },
              }
        }
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: toneColor,
          filter: 'blur(135px)',
          opacity: blob.opacity * 1.4, // multiply is subtler — compensate
          mixBlendMode: 'multiply',
          willChange: 'transform',
        }}
      />
    </motion.div>
  )
}

function SectionHeader({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      <h2
        style={{
          fontFamily: 'Nimora, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(34px, 4.8vw, 72px)',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          color: '#FFB719',
          margin: 0,
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(14px)',
          transition: reduce
            ? 'none'
            : 'opacity 500ms ease, transform 500ms ease',
        }}
      >
        Servicios
      </h2>
    </div>
  )
}

function ServiceRow({
  service,
  index,
  isHovered,
  isOpen,
  isDimmed,
  onHover,
  onClick,
  reduce,
}: {
  service: Service
  index: number
  isHovered: boolean
  isOpen: boolean
  isDimmed: boolean
  onHover: () => void
  onClick: () => void
  reduce: boolean
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduce ? 0 : 0.55,
        ease: EASE_OUT,
        delay: reduce ? 0 : index * 0.045,
      }}
      onMouseEnter={onHover}
      style={{
        position: 'relative',
        borderBottom: '1px solid rgba(26,26,26,0.12)',
        cursor: 'pointer',
      }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(14px, 2vw, 34px)',
          padding: 'clamp(12px, 1.75vh, 22px) 0',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          opacity: isDimmed ? 0.42 : 1,
          transition: 'opacity 300ms ease',
        }}
      >
        <motion.span
          animate={{
            scale: isHovered || isOpen ? 1.08 : 1,
            color:
              isHovered || isOpen
                ? service.color
                : 'rgba(26,26,26,0.45)',
          }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 'clamp(12px, 1vw, 16px)',
            letterSpacing: '0.1em',
            minWidth: '2.6ch',
            transformOrigin: 'left center',
          }}
        >
          {service.num}
        </motion.span>

        <span style={{ position: 'relative', display: 'inline-block' }}>
          <motion.span
            animate={{
              color: isHovered || isOpen ? service.color : '#1A1A1A',
            }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 'clamp(22px, 3.25vw, 46px)',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              display: 'block',
              whiteSpace: 'normal',
            }}
          >
            {service.title}
          </motion.span>

          <svg
            viewBox="0 0 300 16"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              bottom: '-0.12em',
              width: '100%',
              height: '0.25em',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            <motion.path
              d="M4,9 C60,4 120,13 180,7 C225,3 265,11 296,6"
              stroke={service.color}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isHovered || isOpen ? 1 : 0 }}
              transition={{
                duration: reduce ? 0 : 0.38,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </svg>
        </span>

        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            color: isHovered || isOpen ? service.color : 'rgba(26,26,26,0.45)',
          }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          style={{
            marginLeft: 'auto',
            fontSize: 'clamp(24px, 2.3vw, 34px)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1,
          }}
        >
          +
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={
          isOpen
            ? { height: 'auto', opacity: 1, y: 0 }
            : { height: 0, opacity: 0, y: -8 }
        }
        transition={{
          height: {
            duration: reduce ? 0 : 0.48,
            ease: [0.76, 0, 0.24, 1],
          },
          opacity: {
            duration: reduce ? 0 : 0.28,
            ease: EASE_OUT,
          },
          y: {
            duration: reduce ? 0 : 0.35,
            ease: EASE_OUT,
          },
        }}
        style={{ overflow: 'hidden' }}
      >
        <div
          style={{
            padding: '0 0 clamp(20px, 3vh, 34px) clamp(44px, 5vw, 80px)',
            maxWidth: '880px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(16px, 1.55vw, 23px)',
              lineHeight: 1.45,
              letterSpacing: '-0.01em',
              color: 'rgba(26,26,26,0.72)',
              margin: 0,
            }}
          >
            {service.copy.map((part, i) => (
              <CopySpan
                key={`${part.text}-${i}`}
                part={part}
                color={service.color}
              />
            ))}
          </p>
        </div>
      </motion.div>
    </motion.li>
  )
}

function CopySpan({
  part,
  color,
}: {
  part: CopyPart
  color: string
}) {
  if (part.glow === undefined) return <span>{part.text}</span>

  // Accent words use the service colour (no glow) on the beige background.
  return (
    <span
      style={{
        color: color,
        fontWeight: 600,
      }}
    >
      {part.text}
    </span>
  )
}
