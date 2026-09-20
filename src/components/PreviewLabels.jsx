import { useAuth } from '../context/AuthContext'
import { TIER_CONFIG } from '../config/tierConfig'
import PreviewControls from './PreviewControls'
import PrintableLabelSheet from './PrintableLabelSheet'

function LayoutField({ id, label, value, onChange, disabled, suffix }) {
  const isIntegerField = id === 'label-columns' || id === 'label-rows'

  return (
    <label className={`layout-field ${disabled ? 'is-locked' : ''}`} htmlFor={id}>
      <span>{label}</span>
      {disabled && <small>Available with Hobby</small>}
      <div className="layout-field-input">
        <input id={id} type="number" min="1" step={isIntegerField ? 1 : 0.1} value={value} onChange={onChange} disabled={disabled} inputMode={isIntegerField ? 'numeric' : 'decimal'} />
        <span>{suffix}</span>
      </div>
    </label>
  )
}

function Paywall({ onClose }) {
  const { tierConfig } = useAuth()
  const isUnlimited = tierConfig.addressLimit === Infinity

  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className="paywall-card">
        <span className="paywall-badge">Monthly limit reached</span>
        <h2 id="paywall-title">{isUnlimited ? 'This import could not be started' : `You've processed all ${tierConfig.addressLimit} addresses included with the ${tierConfig.name} plan.`}</h2>
        <p>{isUnlimited ? 'Please try again in a moment.' : tierConfig.name === TIER_CONFIG.free.name ? `Upgrade to Hobby to process up to ${TIER_CONFIG.hobby.addressLimit} addresses per month.` : 'Upgrade to Unlimited for unlimited address processing.'}</p>
        <div className="paywall-actions">
          <button type="button" className="export-button" onClick={onClose}>Review my labels</button>
          <button type="button" className="secondary-button" onClick={onClose}>Not now</button>
        </div>
      </div>
    </div>
  )
}

export default function PreviewLabels({
  addresses,
  isOpen,
  onClose,
  labelPositions,
  labelScales,
  selectedLabel,
  globalScale,
  applyScaleGlobally,
  globalLineSpacing,
  globalLabelOffset,
  onSelectLabel,
  onLabelMoveStart,
  onGlobalMoveStart,
  onToggleGlobalScale,
  onScaleChange,
  onLineSpacingChange,
  showPaywall,
  onClosePaywall,
  printLayout,
}) {
  const { tierConfig, tierLoading, addressesProcessed, addressesRemaining, lastResetDate, usageLoading, addressLimit } = useAuth()

  if (!isOpen) {
    return null
  }

  const canResizeLabels = !tierLoading && tierConfig.canResizeLabels
  const { labelWidth, labelHeight, columns, rows, setLabelWidth, setLabelHeight, setColumns, setRows, pageWidth, pageHeight, labelsPerPage } = printLayout
  const selectedScale = applyScaleGlobally ? globalScale : selectedLabel ? labelScales[selectedLabel] || globalScale : globalScale

  return (
    <div className="preview-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="preview-title" onClick={onClose}>
      <div className="preview-modal" onClick={(event) => event.stopPropagation()}>
        <div className="preview-modal-header">
          <div>
            <h3 id="preview-title">Label preview</h3>
            <p>Review the sheet layout before printing.</p>
          </div>
          <div className="preview-modal-actions">
            <button type="button" className="secondary-button" onClick={() => window.print()}>Print</button>
            <button type="button" className="secondary-button" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="preview-settings" aria-label="Preview layout settings">
          <div className="preview-settings-heading">
            <div>
              <strong>{tierLoading ? 'Checking your plan...' : `${tierConfig.name} layout controls`}</strong>
              <span>{usageLoading ? 'Loading usage...' : tierConfig.addressLimit === Infinity ? `${addressesProcessed ?? 0} addresses processed · Unlimited` : `${addressesProcessed ?? 0} / ${addressLimit ?? tierConfig.addressLimit} addresses processed · ${addressesRemaining ?? 0} remaining`}</span>
            </div>
            <span className={`tier-badge ${canResizeLabels ? 'paid' : ''}`}>{tierConfig.name}</span>
          </div>
          <div className="layout-fields">
            <LayoutField id="label-width" label="Width" value={labelWidth} onChange={(event) => setLabelWidth(Number(event.target.value))} disabled={!canResizeLabels} suffix="in" />
            <LayoutField id="label-height" label="Height" value={labelHeight} onChange={(event) => setLabelHeight(Number(event.target.value))} disabled={!canResizeLabels} suffix="in" />
            <LayoutField id="label-columns" label="Columns" value={columns} onChange={(event) => setColumns(Number(event.target.value))} disabled={!canResizeLabels} suffix="" />
            <LayoutField id="label-rows" label="Rows" value={rows} onChange={(event) => setRows(Number(event.target.value))} disabled={!canResizeLabels} suffix="" />
          </div>
          <p className="layout-summary">Letter portrait · {pageWidth} × {pageHeight} in · {labelsPerPage} labels per page · {columns} columns × {rows} rows</p>
          {!printLayout.fitsPage && <p className="layout-warning" role="alert">These label dimensions do not fit on an 8.5 × 11 inch page with the current rows, columns, spacing, and margins.</p>}
          {!canResizeLabels && <p className="layout-upgrade-note">Custom label sizing is available with Hobby. Upgrade to unlock it.</p>}
          {lastResetDate && <p className="layout-reset">Usage reset {new Date(lastResetDate).toLocaleDateString()}</p>}
        </div>

        <div className="preview-modal-body">
          <div className="preview-modal-split">
            <div className="preview-sheet-panel">
              <PrintableLabelSheet
                addresses={addresses}
                layout={printLayout}
                labelPositions={labelPositions}
                labelScales={labelScales}
                globalScale={globalScale}
                applyScaleGlobally={applyScaleGlobally}
                globalLineSpacing={globalLineSpacing}
                globalLabelOffset={globalLabelOffset}
                selectedLabel={selectedLabel}
                onSelectLabel={onSelectLabel}
                onLabelMoveStart={onLabelMoveStart}
              />
            </div>

            <div className="preview-controls-panel">
              <PreviewControls
                selectedScale={selectedScale}
                applyScaleGlobally={applyScaleGlobally}
                onToggleGlobalScale={onToggleGlobalScale}
                onScaleChange={onScaleChange}
                globalLineSpacing={globalLineSpacing}
                onLineSpacingChange={onLineSpacingChange}
                onGlobalMoveStart={onGlobalMoveStart}
                selectedLabel={selectedLabel}
                canResizeLabels={canResizeLabels}
              />
            </div>
          </div>
        </div>
      </div>
      {showPaywall && <Paywall onClose={onClosePaywall} />}
    </div>
  )
}
