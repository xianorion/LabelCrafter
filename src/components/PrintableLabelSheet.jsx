import PreviewSheetLabel from './PreviewSheetLabel'
import { getLabelPosition, getLabelScale, getPreviewPages } from '../utils/previewLogic'

export default function PrintableLabelSheet({
  addresses,
  layout,
  labelPositions,
  labelScales,
  globalScale,
  applyScaleGlobally,
  globalLineSpacing,
  globalLabelOffset,
  selectedLabel,
  onSelectLabel,
  onLabelMoveStart,
  interactive = true,
}) {
  const pages = getPreviewPages(addresses, layout.labelsPerPage)

  return (
    <div className="printable-label-sheet">
      {pages.map((page, pageIndex) => (
        <div className="preview-sheet" key={`preview-${pageIndex}`} style={{ width: `${layout.pageWidth}in`, height: `${layout.pageHeight}in` }}>
          <div
            className="preview-sheet-grid"
            style={{
              width: `${layout.contentWidth}in`,
              height: `${layout.contentHeight}in`,
              margin: `${layout.marginTop}in ${layout.marginRight}in ${layout.marginBottom}in ${layout.marginLeft}in`,
              gridTemplateColumns: `repeat(${layout.columns}, ${layout.labelWidth}in)`,
              gridTemplateRows: `repeat(${layout.rows}, ${layout.labelHeight}in)`,
              columnGap: `${layout.horizontalSpacing}in`,
              rowGap: `${layout.verticalSpacing}in`,
            }}
          >
            {page.pageItems.map((address, itemIndex) => {
              const key = address.id || `modal-preview-${pageIndex}-${itemIndex}`
              const position = getLabelPosition(labelPositions, key)
              const scale = getLabelScale(labelScales, globalScale, key, applyScaleGlobally)

              return (
                <PreviewSheetLabel
                  key={key}
                  address={address}
                  keyId={key}
                  style={{ width: `${layout.labelWidth}in`, height: `${layout.labelHeight}in` }}
                  position={{ x: position.x + globalLabelOffset.x, y: position.y + globalLabelOffset.y }}
                  scale={scale}
                  lineSpacing={globalLineSpacing}
                  selected={selectedLabel === key}
                  onSelect={onSelectLabel}
                  onMoveStart={onLabelMoveStart}
                  interactive={interactive}
                />
              )
            })}
            {page.emptySlots.map((_, index) => (
              <div className="preview-sheet-label empty-slot" key={`preview-empty-${pageIndex}-${index}`} style={{ width: `${layout.labelWidth}in`, height: `${layout.labelHeight}in` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
