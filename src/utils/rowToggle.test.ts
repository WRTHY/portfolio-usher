import { afterEach, describe, expect, it, vi } from 'vitest'
import { isRowToggleClick } from './rowToggle'

function row() {
  const li = document.createElement('li')
  li.innerHTML = `
    <p data-part="text">Impact</p>
    <a href="#" data-part="link">Company</a>
    <button data-part="button"><svg data-part="icon"></svg></button>
    <div data-part="region"><p data-part="inside">Detail</p></div>`
  document.body.append(li)
  const part = (name: string) => li.querySelector<HTMLElement>(`[data-part="${name}"]`)!
  return { li, part }
}

describe('isRowToggleClick', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('toggles on a click on the row itself', () => {
    const { part } = row()
    expect(isRowToggleClick(part('text'), [part('region')])).toBe(true)
  })

  it('leaves links and buttons (and what is inside them) to do their own thing', () => {
    const { part } = row()
    expect(isRowToggleClick(part('link'), [])).toBe(false)
    expect(isRowToggleClick(part('icon'), [])).toBe(false)
  })

  it('leaves clicks inside an opened region alone', () => {
    const { part } = row()
    expect(isRowToggleClick(part('inside'), [null, part('region')])).toBe(false)
  })

  it("doesn't toggle at the end of selecting text", () => {
    const { part } = row()
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'Impact' } as Selection)
    expect(isRowToggleClick(part('text'), [])).toBe(false)
  })
})
