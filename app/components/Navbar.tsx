'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  /** Slide the navbar in once true (fired after preloader onComplete). */
  animate?: boolean
}

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Trabajo',   href: '#trabajo'   },
  { label: 'Proceso',   href: '#proceso'   },
  { label: 'Contacto',  href: '#contacto'  },
]

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Navbar({ animate: heroReady = false }: NavbarProps) {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Frosted glass after 60px of scroll — starts fully transparent on mount
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    // Do NOT call onScroll() immediately; scrollY is 0 on mount so this
    // would always start transparent anyway, but keeping explicit intent clear.
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const entranceTarget = { y: 0, opacity: 1 }
  const entranceStart  = reduce ? entranceTarget : { y: -80, opacity: 0 }

  // Stagger config for the mobile overlay links
  const listVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  }
  const itemVariants = {
    hidden:  { opacity: 0, y: reduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.4, ease: EASE_OUT } },
  }

  return (
    <>
      <motion.nav
        initial={entranceStart}
        animate={heroReady ? entranceTarget : entranceStart}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE_OUT, delay: reduce ? 0 : 0.3 }}
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          translateX: '-50%',
          width: 'calc(100% - 48px)',
          maxWidth: 1100,
          height: 60,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px 10px 24px',
          borderRadius: 999,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.70)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(26, 26, 26, 0.08)',
          boxShadow: scrolled
            ? '0 12px 40px rgba(26, 26, 26, 0.14)'
            : '0 8px 30px rgba(26, 26, 26, 0.08)',
          transition:
            'background-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)',
        }}
      >
        {/* LEFT — logo */}
        <a href="/" aria-label="Remark — inicio" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Image
            src="/assets/logo/remark-wordmark-ink.png"
            alt="Remark"
            width={120}
            height={28}
            priority
            style={{ height: 28, width: 'auto', display: 'block' }}
          />
        </a>

        {/* CENTER — nav links (hidden < 768px) */}
        <ul className="rmk-nav-center">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="rmk-link">{label}</a>
            </li>
          ))}
        </ul>

        {/* RIGHT — CTA (desktop) / hamburger (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="#contacto" className="rmk-nav-cta">Hablemos →</a>
          <button
            type="button"
            className="rmk-nav-burger"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE — full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 60,
              backgroundColor: '#0D0D0D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 'clamp(24px, 5vw, 80px)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#F5F0E8',
                padding: 4,
                display: 'inline-flex',
              }}
            >
              <X size={28} strokeWidth={2} />
            </button>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <motion.li key={href} variants={itemVariants}>
                  <a
                    href={href}
                    className="rmk-overlay-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Component-scoped responsive + hover rules */}
      <style>{`
        .rmk-nav-center {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .rmk-link {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 15px;
          color: #1A1A1A;
          text-decoration: none;
          transition: color 140ms var(--ease-out);
        }
        .rmk-link:hover { color: #D6272E; }
        .rmk-nav-cta {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 13px;
          color: #FFFFFF;
          background: #1A1A1A;
          padding: 8px 18px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          transition: background-color 140ms var(--ease-out), transform 140ms var(--ease-out);
        }
        .rmk-nav-cta:hover { background: #333333; transform: translateY(-1px); }
        .rmk-nav-burger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #1A1A1A;
          padding: 4px;
          align-items: center;
        }
        .rmk-overlay-link {
          font-family: var(--font-display);
          font-weight: var(--fw-display);
          font-size: 48px;
          color: #F5F0E8;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: color 140ms var(--ease-out);
        }
        .rmk-overlay-link:hover { color: #D6272E; }
        @media (max-width: 768px) {
          .rmk-nav-center { display: none; }
          .rmk-nav-cta { display: none; }
          .rmk-nav-burger { display: inline-flex; }
        }
      `}</style>
    </>
  )
}
