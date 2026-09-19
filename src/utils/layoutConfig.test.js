import { calculateLayout } from './layoutConfig'

describe('calculateLayout', () => {
  it('fits exact 2 by 2 Letter boundaries with zero margins and spacing', () => {
    const layout = calculateLayout({ rows: 2, columns: 2, labelWidth: 4.25, labelHeight: 5.5 })

    expect(layout.pageWidth).toBe(8.5)
    expect(layout.pageHeight).toBe(11)
    expect(layout.labelsPerPage).toBe(4)
    expect(layout.requiredWidth).toBe(8.5)
    expect(layout.requiredHeight).toBe(11)
    expect(layout.fitsPage).toBe(true)
  })

  it('rejects a label that exceeds the available width', () => {
    expect(calculateLayout({ rows: 2, columns: 2, labelWidth: 4.26, labelHeight: 5.5 }).fitsPage).toBe(false)
  })

  it('rejects a label that exceeds the available height', () => {
    expect(calculateLayout({ rows: 2, columns: 2, labelWidth: 4.25, labelHeight: 5.51 }).fitsPage).toBe(false)
  })

  it('fits smaller labels on a zero-margin, zero-spacing Letter sheet', () => {
    const layout = calculateLayout({ rows: 2, columns: 2, labelWidth: 4, labelHeight: 5 })

    expect(layout.fitsPage).toBe(true)
    expect(layout.marginLeft).toBe(0)
    expect(layout.horizontalSpacing).toBe(0)
  })

  it('rejects fractional rows and columns through safe fallback values', () => {
    const layout = calculateLayout({ rows: 2.5, columns: 1.5 })

    expect(layout.rows).toBe(5)
    expect(layout.columns).toBe(2)
  })

  it('reports a fitting three-column layout without changing the page size', () => {
    const layout = calculateLayout({ rows: 4, columns: 3, labelWidth: 2.5, labelHeight: 2 })

    expect(layout.pageWidth).toBe(8.5)
    expect(layout.pageHeight).toBe(11)
    expect(layout.labelsPerPage).toBe(12)
    expect(layout.fitsPage).toBe(true)
  })
})
