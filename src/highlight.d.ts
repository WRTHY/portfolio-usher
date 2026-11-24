// A repo file imported with ?highlight: its text, plus that text already
// highlighted (see scripts/highlight-plugin.ts).
declare module '*?highlight' {
  const file: { code: string; html: string }
  export default file
}
