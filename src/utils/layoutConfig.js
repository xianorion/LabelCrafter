export const PAGE_SIZES = {
  letter: { name: 'Letter', width: 8.5, height: 11 },
}

export const DEFAULT_LAYOUT_CONFIG = {
  pageSize: 'letter',
  orientation: 'portrait',
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  rows: 5,
  columns: 2,
  labelWidth: 3.75,
  labelHeight: 2,
  horizontalSpacing: 0,
  verticalSpacing: 0,
}

function positiveNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function nonNegativeNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : fallback
}

function positiveInteger(value, fallback) {
  const number = Number(value)
  return Number.isInteger(number) && number >= 1 ? number : fallback
}

export function calculateLayout(config = {}) {
  const page = PAGE_SIZES[config.pageSize] || PAGE_SIZES.letter
  const rows = positiveInteger(config.rows, DEFAULT_LAYOUT_CONFIG.rows)
  const columns = positiveInteger(config.columns, DEFAULT_LAYOUT_CONFIG.columns)
  const marginTop = nonNegativeNumber(config.marginTop, DEFAULT_LAYOUT_CONFIG.marginTop)
  const marginRight = nonNegativeNumber(config.marginRight, DEFAULT_LAYOUT_CONFIG.marginRight)
  const marginBottom = nonNegativeNumber(config.marginBottom, DEFAULT_LAYOUT_CONFIG.marginBottom)
  const marginLeft = nonNegativeNumber(config.marginLeft, DEFAULT_LAYOUT_CONFIG.marginLeft)
  const horizontalSpacing = nonNegativeNumber(config.horizontalSpacing, DEFAULT_LAYOUT_CONFIG.horizontalSpacing)
  const verticalSpacing = nonNegativeNumber(config.verticalSpacing, DEFAULT_LAYOUT_CONFIG.verticalSpacing)
  const contentWidth = page.width - marginLeft - marginRight
  const contentHeight = page.height - marginTop - marginBottom
  const labelWidth = positiveNumber(config.labelWidth, contentWidth / columns)
  const labelHeight = positiveNumber(config.labelHeight, (contentHeight - verticalSpacing * (rows - 1)) / rows)
  const requiredWidth = columns * labelWidth + horizontalSpacing * (columns - 1) + marginLeft + marginRight
  const requiredHeight = rows * labelHeight + verticalSpacing * (rows - 1) + marginTop + marginBottom
  const tolerance = 1e-9

  return {
    page,
    pageWidth: page.width,
    pageHeight: page.height,
    orientation: config.orientation || DEFAULT_LAYOUT_CONFIG.orientation,
    rows,
    columns,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    horizontalSpacing,
    verticalSpacing,
    contentWidth,
    contentHeight,
    labelWidth,
    labelHeight,
    requiredWidth,
    requiredHeight,
    availableWidth: page.width - marginLeft - marginRight - horizontalSpacing * (columns - 1),
    availableHeight: page.height - marginTop - marginBottom - verticalSpacing * (rows - 1),
    fitsPage: requiredWidth <= page.width + tolerance && requiredHeight <= page.height + tolerance,
    labelsPerPage: rows * columns,
  }
}
