'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import BubbleField from './BubbleField'

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

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Services() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  const [hovered, setHovered] = useState<number | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleService = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section
      id="servicios"
      ref={sectionRef}
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
      <BubbleField lightMode={true} />

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
            borderTop: '1px solid rgba(26,26,26,0.10)',
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
        borderBottom: '1px solid rgba(26,26,26,0.10)',
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
