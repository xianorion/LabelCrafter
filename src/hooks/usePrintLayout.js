import { useState } from 'react'

export const DEFAULT_PRINT_LAYOUT = {
  labelWidth: 3.6,
  labelHeight: 1.8,
  columns: 2,
  rows: 5,
}

export function usePrintLayout() {
  const [labelWidth, setLabelWidth] = useState(DEFAULT_PRINT_LAYOUT.labelWidth)
  const [labelHeight, setLabelHeight] = useState(DEFAULT_PRINT_LAYOUT.labelHeight)
  const [columns, setColumns] = useState(DEFAULT_PRINT_LAYOUT.columns)
  const [rows, setRows] = useState(DEFAULT_PRINT_LAYOUT.rows)

  return {
    labelWidth,
    labelHeight,
    columns,
    rows,
    setLabelWidth,
    setLabelHeight,
    setColumns,
    setRows,
  }
}