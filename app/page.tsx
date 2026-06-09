import Hero from './components/Hero'
import Statement from './components/Statement'
import Services from './components/Services'

export default function Page() {
  return (
    <>
      <Hero />
      <Statement />

      {/* Gradient bridge: black → beige, imperceptible. Warm intermediate
          stops keep the transition organic rather than a digital fade. */}
      <div
        aria-hidden="true"
        style={{
          height: 600,
          background:
            'linear-gradient(to bottom, #0D0D0D 0%, #0D0D0D 15%, #1a1410 30%, #2e2218 45%, #6b4e2e 62%, #a8845a 75%, #c9a87a 85%, #e8d5b5 93%, #F5F0E8 100%)',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 0,
          marginTop: '-2px',
          marginBottom: '-2px',
        }}
      />

      <Services />
    </>
  )
}
