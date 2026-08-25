import { useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'
import styles from './ThemeToggle.module.css'

type Mode = 'light' | 'dark'

function getSystemMode(): Mode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialMode(): Mode {
  const stored = localStorage.getItem('mode')
  if (stored === 'light' || stored === 'dark') return stored
  return getSystemMode()
}

function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(getInitialMode)

  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    document.documentElement.dataset.mode = next
    localStorage.setItem('mode', next)
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleMode}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      data-testid="theme-toggle"
    >
      {mode === 'dark' ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
    </button>
  )
}

export default ThemeToggle
