'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import Preloader from './Preloader'
import Navbar from './Navbar'
import ScrollProgress from './ScrollProgress'
import CustomCursor from './CustomCursor'

/**
 * Becomes true the moment the preloader fires onComplete.
 * Hero (and any other page section) reads this to start its entrance
 * AFTER the preloader has lifted — otherwise animations play hidden
 * behind the z-9999 preloader overlay and are never seen.
 */
const HeroReadyContext = createContext(false)
export const useHeroReady = () => useContext(HeroReadyContext)

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [heroReady, setHeroReady] = useState(false)
  const handleComplete = useCallback(() => setHeroReady(true), [])

  return (
    <HeroReadyContext.Provider value={heroReady}>
      {!heroReady && <Preloader onComplete={handleComplete} />}
      <ScrollProgress />
      <Navbar animate={heroReady} />
      {children}
      <CustomCursor />
    </HeroReadyContext.Provider>
  )
}
