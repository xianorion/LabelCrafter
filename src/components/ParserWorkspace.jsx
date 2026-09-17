import PreviewLabel from './PreviewLabel'
import { getLabelPosition, getLabelScale, getPreviewPages } from '../utils/previewLogic'

export default function ParserWorkspace({ addresses, labelPositions, labelScales, selectedLabel, globalScale, applyScaleGlobally, globalLineSpacing, globalLabelOffset, onSelectLabel, onLabelMoveStart, columns = 2, rows = 5, labelWidth = 3.6, labelHeight = 1.8 }) {
  const pages = getPreviewPages(addresses, columns * rows)

  return (
    <section className="workspace">
      <div className="panel">
        <div className="panel-header">
          <h2>Imported addresses</h2>
          <span>{addresses.length} item{addresses.length === 1 ? '' : 's'}</span>
        </div>

        {addresses.length === 0 ? (
          <div className="empty-state">No addresses imported yet.</div>
        ) : (
          <ul className="address-list">
            {addresses.map((address, index) => (
              <li key={`${address}-${index}`} className="address-item">
                <span className="address-index">{index + 1}</span>
                <div>
                  <strong>{address}</strong>
                  <p>PDF label {index + 1}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel preview-panel">
        <div className="panel-header">
          <h2>Preview</h2>
          <span>{columns * rows} per page</span>
        </div>

        <div className="preview-stack">
          {pages.map((page, pageIndex) => (
            <div className="preview-page" key={`page-${pageIndex}`}>
              <div className="page-label">Page {pageIndex + 1}</div>
              <div className="page-grid" style={{ '--preview-columns': columns, '--preview-rows': rows }}>
                {page.pageItems.map((address, itemIndex) => {
                  const key = `preview-${pageIndex}-${itemIndex}`
                  const position = getLabelPosition(labelPositions, key)
                  const scale = getLabelScale(labelScales, globalScale, key, applyScaleGlobally)

                  return (
                    <PreviewLabel
                      key={key}
                      address={address}
                      keyId={key}
                      position={{ x: position.x + globalLabelOffset.x, y: position.y + globalLabelOffset.y }}
                      scale={scale}
                      lineSpacing={globalLineSpacing}
                        style={{ width: '100%', height: '100%' }}
                      selected={selectedLabel === key}
                      onSelect={onSelectLabel}
                      onMoveStart={onLabelMoveStart}
                    />
                  )
                })}
                  {page.emptySlots.map((_, index) => (
                    <div className="preview-card empty-slot" key={`empty-${pageIndex}-${index}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}