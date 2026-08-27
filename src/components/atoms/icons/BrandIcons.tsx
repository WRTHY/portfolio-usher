import type { AriaAttributes, SVGProps } from 'react'
import { Icon, type IconifyIcon } from '@iconify/react/offline'

// mode="mask" renders as a <span>, not an <svg> — @iconify/react's own
// props type reflects that (e.g. its onLoad has a different signature than
// SVGProps' onLoad), so these three wrappers only forward the one prop
// their callers actually pass (aria-hidden) rather than the full SVGProps
// surface.
type MaskIconProps = Pick<AriaAttributes, 'aria-hidden'>

// Simple Icons (react-icons/si) has no mark at all for these three — checked
// against the installed version, same finding as Cypress/Playwright in
// FrameworkSwitcher/frameworkOptions.tsx. Iconify's aggregated collections
// (searched via api.iconify.design) cover all three instead. The icon data
// below was extracted once from each collection's own npm package
// (@iconify-json/devicon-plain, @iconify-json/tabler — installed only long
// enough to copy the `body`/`width`/`height` fields, not a runtime
// dependency) and is rendered through the real @iconify/react component so
// this stays backed by the actual library rather than a one-off copy of its
// output.
//
// mode="mask" renders via a CSS mask-image instead of inline SVG paint, so
// every icon comes out solid currentColor regardless of the source data's
// own fill colors. This keeps the whole set monochrome to match this site's
// near-monochrome design system (see DESIGN.md's One Accent Rule) without
// hand-flattening every path by hand. The '/offline' entry point is a
// deliberate choice over the package's default export: it excludes
// Iconify's API-fetch machinery entirely, so there's no runtime network
// dependency on Iconify's CDN — everything here is embedded data.
//
// Reassure has no mark anywhere and uses the shared PerformanceIcon
// speed-dial glyph from TestingTypeIcons.tsx instead (it's a React Native
// performance-testing tool, so that glyph already fits); see
// toolCategories.tsx. Maestro does have a real mark — see below.

// devicon-plain's own single-color variant of its Playwright mark — cleaner
// than flattening the six-path official logo by hand.
const playwrightIcon: IconifyIcon = {
  body: '<path d="m72.086 86.132l-.594-.144c-13.125-3.844-15.15-14.311-15.15-14.311l18.182 5.082L84.15 39.77l-.116-.031c-11.807-3.162-19.64-8.692-22.744-11.292c-4.4-3.685-6.335-6.246-8.24-2.372c-1.682 3.417-3.836 8.977-5.92 16.762c-4.516 16.857-7.892 52.429 20.027 59.914l.572.129zm-18.807-30.85s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376zm-8.517 23.451L31.787 82.41s1.41-8.029 10.968-11.212l-7.347-27.573l-.635.193c-9.111 2.457-16.476 1.805-19.55 1.273c-4.357-.751-6.636-1.708-6.422 1.606c.186 2.923.882 7.454 2.477 13.44c3.45 12.961 14.854 37.937 36.405 32.132l.635-.199zM19.548 60.315l15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371zm89.824-18.979c-3.981.698-13.532 1.567-25.336-1.596c-11.807-3.162-19.64-8.692-22.744-11.292c-4.4-3.685-6.335-6.246-8.24-2.372c-1.684 3.417-3.837 8.977-5.921 16.762c-4.516 16.857-7.892 52.429 20.027 59.914c27.912 7.479 42.772-25.017 47.289-41.875c2.084-7.783 2.998-13.676 3.25-17.476c.287-4.305-2.67-3.055-8.324-2.064zM53.28 55.282s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376zm18.215 30.706c-13.125-3.845-15.15-14.311-15.15-14.311l35.259 9.858c0-.002-7.117 8.25-20.109 4.453m12.466-21.51s4.394-6.838 11.854-4.711c7.46 2.124 8.048 10.379 8.048 10.379zM51.732 83.935v-7.179l-19.945 5.656s1.474-8.563 11.876-11.514c3.155-.894 5.846-.888 8.069-.459V40.995h9.987c-1.087-3.36-2.139-5.947-3.023-7.744c-1.461-2.975-2.96-1.003-6.361 1.842c-2.396 2.001-8.45 6.271-17.561 8.726c-9.111 2.457-16.476 1.805-19.55 1.273c-4.357-.752-6.636-1.708-6.422 1.605c.186 2.923.882 7.455 2.477 13.44c3.45 12.962 14.854 37.937 36.405 32.132c5.629-1.517 9.603-4.515 12.357-8.336h-8.309Zm-32.185-23.62l15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371z"/>',
  width: 128,
  height: 128,
}

export function PlaywrightIcon(props: MaskIconProps) {
  return <Icon icon={playwrightIcon} mode="mask" {...props} />
}

// devicon-plain's own single-color variant of Slack's real four-block
// pinwheel mark — closer to the actual brand shape than a generic
// redraw (checked against mdi:slack as an alternative; this one matches
// the true logo's proportions).
const slackIcon: IconifyIcon = {
  body: '<path d="M27.15 80.766c0 7.351-5.994 13.355-13.345 13.355C6.454 94.12.45 88.117.45 80.766s6.004-13.355 13.355-13.355H27.15zm6.73 0c0-7.351 6.003-13.355 13.354-13.355s13.355 6.004 13.355 13.355v33.43c0 7.35-6.004 13.354-13.355 13.354s-13.355-6.004-13.355-13.355v-33.43zM47.234 27.15c-7.351 0-13.355-5.994-13.355-13.345C33.88 6.454 39.883.45 47.234.45s13.355 6.004 13.355 13.355V27.15zm0 6.73c7.351 0 13.355 6.003 13.355 13.354s-6.004 13.355-13.355 13.355h-33.43C6.455 60.589.45 54.585.45 47.234s6.004-13.355 13.355-13.355zm53.616 13.354c0-7.351 5.994-13.355 13.345-13.355s13.355 6.004 13.355 13.355s-6.004 13.355-13.355 13.355H100.85zm-6.73 0c0 7.351-6.003 13.355-13.354 13.355s-13.355-6.004-13.355-13.355v-33.43C67.411 6.455 73.415.45 80.766.45s13.355 6.004 13.355 13.355zM80.766 100.85c7.351 0 13.355 5.994 13.355 13.345s-6.004 13.355-13.355 13.355s-13.355-6.004-13.355-13.355V100.85zm0-6.73c-7.351 0-13.355-6.003-13.355-13.354s6.004-13.355 13.355-13.355h33.43c7.35 0 13.354 6.004 13.354 13.355s-6.004 13.355-13.355 13.355zm0 0"/>',
  width: 128,
  height: 128,
}

export function SlackIcon(props: MaskIconProps) {
  return <Icon icon={slackIcon} mode="mask" {...props} />
}

// Tabler's purpose-built monochrome brand icon — no plain/monochrome React
// Native mark exists in devicon or Simple Icons, but Tabler draws its brand
// icons as single-color from the start rather than as a flattened multi-
// color logo, so this reads more cleanly at chip size than a squashed atom
// logo would.
const reactNativeIcon: IconifyIcon = {
  body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M6.357 9C3.72 9.68 2 10.845 2 12.175C2 14.282 6.405 16 11.85 16c.74 0 1.26-.039 1.95-.097"/><path d="M9.837 15.9c-.413-.596-.806-1.133-1.18-1.8c-2.751-4.9-3.488-9.77-1.63-10.873c1.15-.697 3.047.253 4.974 2.254"/><path d="M6.429 15.387c-.702 2.688-.56 4.716.56 5.395c1.783 1.08 5.387-1.958 8.043-6.804q.54-1.005.968-1.978"/><path d="M12 18.52c1.928 2 3.817 2.95 4.978 2.253c1.85-1.102 1.121-5.972-1.633-10.873c-.384-.677-.777-1.204-1.18-1.8"/><path d="M17.66 15c2.612-.687 4.34-1.85 4.34-3.176C22 9.714 17.592 8 12.155 8c-.747 0-1.266.029-1.955.087"/><path d="M8 12c.285-.66.607-1.308.968-1.978c2.647-4.844 6.253-7.89 8.046-6.801c1.11.679 1.262 2.706.56 5.393m-5.314 3.401h-.01c-.01.13-.12.24-.26.24a.263.263 0 0 1-.25-.26c0-.14.11-.25.24-.25h-.01c.13-.01.25.11.25.24"/></g>',
  width: 24,
  height: 24,
}

export function ReactNativeIcon(props: MaskIconProps) {
  return <Icon icon={reactNativeIcon} mode="mask" {...props} />
}

// Iconify's only Maestro mark (logos:maestro) turned out to be a stale/
// unrelated rebrand-era logo, unrecognizable once flattened — fetched
// straight from maestro.dev's own favicon.svg instead (the current,
// authoritative mark) and dropped its black rounded-square backing plate,
// since the chip already supplies its own tinted background; only the
// white glyph path is kept, recolored to currentColor.
export function MaestroIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 110.283 110.283" fill="currentColor" {...props}>
      <path d="M88.2372 20H20V90.2831H49.7006C46.6232 89.1682 43.9636 87.133 42.0832 84.4541C40.2026 81.7751 39.1924 78.5822 39.1896 75.3091C39.1881 73.2133 39.5996 71.1379 40.4007 69.2011C41.2016 67.2645 42.3764 65.5046 43.8578 64.0221C45.3392 62.5396 47.0983 61.3637 49.0344 60.5613C50.9706 59.7589 53.0457 59.346 55.1416 59.346C59.3723 59.346 63.4297 61.0266 66.4213 64.0182C69.4129 67.0097 71.0936 71.0672 71.0936 75.298C71.0907 78.571 70.0805 81.7639 68.2 84.4428C66.3195 87.1219 63.6599 89.157 60.5826 90.2719H90.2831V20H88.2372Z" />
    </svg>
  )
}
