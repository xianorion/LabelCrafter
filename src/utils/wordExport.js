import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, TextRun, TableLayoutType, HeightRule } from 'docx'
import { saveAs } from 'file-saver'

function inchesToDxa(inches) {
  return Math.round(inches * 1440)
}

function createLabelCell(address, labelWidth, labelHeight, scale, lineSpacing, position) {
  const lines = (address || '').split('\n').filter(Boolean).map((line) => line.trimStart())
  const fontSize = 14

  return new TableCell({
    width: { size: inchesToDxa(labelWidth), type: WidthType.DXA },
    height: { size: inchesToDxa(labelHeight), type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 18, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 18, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 18, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 18, color: '000000' },
    },
    children: [
      new Paragraph({
        alignment: 'left',
        indent: { left: inchesToDxa(position.x / 96) },
        spacing: {
          before: Math.max(0, 40 + inchesToDxa(position.y / 96)),
          after: 40,
          line: Math.round(lineSpacing * 240),
        },
        children: lines.flatMap((line, index) => [
          new TextRun({ text: line, size: fontSize * scale, font: 'Calibri' }),
          ...(index < lines.length - 1 ? [new TextRun({ text: '\n', break: 1 })] : []),
        ]),
      }),
    ],
  })
}

export async function generateWordDoc(addresses, printLayout, labelLayout) {
  const safeAddresses = (addresses || []).filter(Boolean)

  if (!safeAddresses.length) {
    return
  }

  const { labelWidth, labelHeight, columns, rows } = printLayout
  const labelsPerPage = columns * rows
  const pageChunks = []
  for (let index = 0; index < safeAddresses.length; index += labelsPerPage) {
    pageChunks.push(safeAddresses.slice(index, index + labelsPerPage))
  }

  const children = []

  pageChunks.forEach((pageAddresses, pageIndex) => {
    if (pageIndex > 0) {
      children.push(new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }))
    }

    const tableRows = []
    for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
      const rowCells = []

      for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
        const addressIndex = rowIndex * columns + columnIndex
        const address = pageAddresses[addressIndex] || ''
        const key = `modal-preview-${pageIndex}-${addressIndex}`
        const position = {
          x: (labelLayout.labelPositions[key]?.x || 0) + labelLayout.globalLabelOffset.x,
          y: (labelLayout.labelPositions[key]?.y || 0) + labelLayout.globalLabelOffset.y,
        }
        const scale = labelLayout.applyScaleGlobally
          ? labelLayout.globalScale
          : labelLayout.labelScales[key] || labelLayout.globalScale

        rowCells.push(createLabelCell(address, labelWidth, labelHeight, scale, labelLayout.globalLineSpacing, position))
      }

      tableRows.push(
        new TableRow({
          height: { value: inchesToDxa(labelHeight), rule: HeightRule.EXACT },
          children: rowCells,
        }),
      )
    }

    children.push(
      new Table({
        width: { size: inchesToDxa(labelWidth * columns), type: WidthType.DXA },
        columnWidths: Array.from({ length: columns }, () => inchesToDxa(labelWidth)),
        layout: TableLayoutType.FIXED,
        rows: tableRows,
      }),
    )
  })

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: 'portrait',
            width: inchesToDxa(8.5),
            height: inchesToDxa(11),
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
      },
      children,
    }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, 'parselab_labels.docx')
}