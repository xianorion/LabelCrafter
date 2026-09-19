import { useState } from 'react'
import { calculateLayout, DEFAULT_LAYOUT_CONFIG } from '../utils/layoutConfig'

export const DEFAULT_PRINT_LAYOUT = {
  ...DEFAULT_LAYOUT_CONFIG,
}

export function usePrintLayout(canResizeLabels = false) {
  const [labelWidth, setLabelWidthState] = useState(DEFAULT_PRINT_LAYOUT.labelWidth)
  const [labelHeight, setLabelHeightState] = useState(DEFAULT_PRINT_LAYOUT.labelHeight)
  const [columns, setColumns] = useState(DEFAULT_PRINT_LAYOUT.columns)
  const [rows, setRows] = useState(DEFAULT_PRINT_LAYOUT.rows)

  const updateLayoutValue = (setter, validate) => (value) => {
    if (canResizeLabels) {
      const nextValue = validate(value)
      if (nextValue !== null) {
        setter(nextValue)
      }
    }
  }

  const setLabelWidth = updateLayoutValue(setLabelWidthState, (value) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null)
  const setLabelHeight = updateLayoutValue(setLabelHeightState, (value) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null)
  const setColumnsValue = updateLayoutValue(setColumns, (value) => Number.isInteger(Number(value)) && Number(value) >= 1 ? Number(value) : null)
  const setRowsValue = updateLayoutValue(setRows, (value) => Number.isInteger(Number(value)) && Number(value) >= 1 ? Number(value) : null)
  const layout = calculateLayout({ ...DEFAULT_PRINT_LAYOUT, labelWidth, labelHeight, columns, rows })

  return {
    ...layout,
    labelWidth,
    labelHeight,
    columns,
    rows,
    setLabelWidth,
    setLabelHeight,
    setColumns: setColumnsValue,
    setRows: setRowsValue,
  }
}