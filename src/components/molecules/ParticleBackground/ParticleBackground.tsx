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

// Each section gets its own small tuning of the same effect — close enough
// to read as one consistent visual language, different enough that moving
// between sections registers subconsciously without calling attention to
// itself. Only density/speed/spacing/size vary; color still comes from the
// shared --particle-color token so the palette never shifts per section.
const variants = {
  hero: { number: 40, speed: 0.6, linkDistance: 120, size: { min: 2, max: 4 } },
  about: { number: 40, speed: 0.6, linkDistance: 120, size: { min: 2, max: 4 } },
  experience: { number: 34, speed: 0.5, linkDistance: 104, size: { min: 2, max: 3.6 } },
  'case-studies': { number: 46, speed: 0.7, linkDistance: 132, size: { min: 2, max: 4.4 } },
  'code-samples': { number: 37, speed: 0.55, linkDistance: 112, size: { min: 1.8, max: 3.8 } },
} as const satisfies Record<string, { number: number; speed: number; linkDistance: number; size: { min: number; max: number } }>

export type ParticleVariant = keyof typeof variants

type ParticleBackgroundProps = {
  variant: ParticleVariant
}

function ParticleBackground({ variant }: ParticleBackgroundProps) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  const options: ISourceOptions = useMemo(() => {
    const particleColor = resolveCssColor('--particle-color') || '#7c1fd6'
    const { number, speed, linkDistance, size } = variants[variant]

    return {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        number: { value: number, density: { enable: true, area: 800 } },
        color: { value: particleColor },
        opacity: { value: 0.7 },
        size: { value: size },
        move: { enable: true, speed, direction: 'none', outModes: { default: 'out' } },
        links: { enable: true, distance: linkDistance, color: particleColor, opacity: 0.35 },
      },
      detectRetina: true,
    }
  }, [variant])

  if (prefersReducedMotion) return null

  return (
    <ParticlesProvider init={initEngine}>
      <Particles id={`${variant}-particles`} className={styles.particles} options={options} />
    </ParticlesProvider>
  )
}

export default ParticleBackground
