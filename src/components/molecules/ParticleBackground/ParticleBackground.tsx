import { useMemo } from 'react'
import { Particles, ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import styles from './ParticleBackground.module.css'

// Must be a stable reference across the component's lifetime — ParticlesProvider
// throws if it receives a new `init` function identity after the first mount.
const initEngine = async (engine: Engine) => {
  await loadSlim(engine)
}

// getComputedStyle().getPropertyValue('--accent') would return the raw,
// unresolved token text (e.g. "light-dark(#6d28d9, #a78bfa)") since custom
// properties aren't resolved until substituted into a real CSS property.
// Setting `color` on a throwaway element and reading it back forces that
// resolution, giving the actual currently-active color.
function resolveCssColor(customProperty: string): string {
  const probe = document.createElement('div')
  probe.style.color = `var(${customProperty})`
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  document.body.removeChild(probe)
  return resolved
}

function ParticleBackground() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  const options: ISourceOptions = useMemo(() => {
    const particleColor = resolveCssColor('--particle-color') || '#7c1fd6'

    return {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        number: { value: 40, density: { enable: true, area: 800 } },
        color: { value: particleColor },
        opacity: { value: 0.7 },
        size: { value: { min: 2, max: 4 } },
        move: { enable: true, speed: 0.6, direction: 'none', outModes: { default: 'out' } },
        links: { enable: true, distance: 120, color: particleColor, opacity: 0.35 },
      },
      detectRetina: true,
    }
  }, [])

  if (prefersReducedMotion) return null

  return (
    <ParticlesProvider init={initEngine}>
      <Particles id="hero-particles" className={styles.particles} options={options} />
    </ParticlesProvider>
  )
}

export default ParticleBackground
