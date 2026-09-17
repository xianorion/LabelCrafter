import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import PreviewControls from './PreviewControls'
import PreviewSheetLabel from './PreviewSheetLabel'
import { getLabelPosition, getLabelScale, getPreviewPages } from '../utils/previewLogic'

function LayoutField({ id, label, value, onChange, disabled, suffix }) {
  return (
    <label className={`layout-field ${disabled ? 'is-locked' : ''}`} htmlFor={id}>
      <span>{label}</span>
      {disabled && <small>Premium Feature</small>}
      <div className="layout-field-input">
        <input id={id} type="number" min="1" step="0.1" value={value} onChange={onChange} disabled={disabled} />
        <span>{suffix}</span>
      </div>
    </label>
  )
}

function Paywall({ onClose }) {
  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className="paywall-card">
        <span className="paywall-badge">Monthly limit reached</span>
        <h2 id="paywall-title">Your free parse is used</h2>
        <p>You have run out of free parses for this month. Upgrade to Premium for unlimited labels!</p>
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
  usageRevision,
  showPaywall,
  onClosePaywall,
  printLayout,
}) {
  const { user } = useAuth()
  const [tier, setTier] = useState('basic')
  const [parseCount, setParseCount] = useState(0)
  const [lastResetDate, setLastResetDate] = useState(null)
  const [usageLoading, setUsageLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchAccountDetails = async () => {
      if (!user) {
        return
      }

      setUsageLoading(true)
      const [{ data: tierData, error: tierError }, { data: usageData, error: usageError }] = await Promise.all([
        supabase.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_usage').select('parse_count, last_reset_date').eq('user_id', user.id).maybeSingle(),
      ])

      if (!mounted) {
        return
      }

      if (!tierError && (tierData?.tier === 'premium' || tierData?.tier === 'basic')) {
        setTier(tierData.tier)
      }
      if (!usageError && usageData) {
        setParseCount(usageData.parse_count ?? 0)
        setLastResetDate(usageData.last_reset_date ?? null)
      }
      setUsageLoading(false)
    }

    fetchAccountDetails()

    return () => {
      mounted = false
    }
  }, [user, usageRevision])

  if (!isOpen) {
    return null
  }

  const isPremium = tier === 'premium'
  const { labelWidth, labelHeight, columns, rows, setLabelWidth, setLabelHeight, setColumns, setRows } = printLayout
  const labelsPerPage = columns * rows
  const pages = getPreviewPages(addresses, labelsPerPage)
  const selectedScale = applyScaleGlobally ? globalScale : selectedLabel ? labelScales[selectedLabel] || globalScale : globalScale

  return (
    <div className="preview-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="preview-title" onClick={onClose}>
      <div className="preview-modal" onClick={(event) => event.stopPropagation()}>
        <div className="preview-modal-header">
          <div>
            <h3 id="preview-title">Label preview</h3>
            <p>Review the sheet layout before exporting to Word.</p>
          </div>
          <div className="preview-modal-actions">
            <button type="button" className="secondary-button" onClick={() => window.print()}>Print</button>
            <button type="button" className="secondary-button" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="preview-settings" aria-label="Preview layout settings">
          <div className="preview-settings-heading">
            <div>
              <strong>{isPremium ? 'Premium layout controls' : 'Basic layout'}</strong>
              <span>{usageLoading ? 'Loading usage...' : `${parseCount} parse${parseCount === 1 ? '' : 's'} used this month`}</span>
            </div>
            <span className={`tier-badge ${isPremium ? 'premium' : ''}`}>{isPremium ? 'Premium' : 'Basic'}</span>
          </div>
          <div className="layout-fields">
            <LayoutField id="label-width" label="Width" value={labelWidth} onChange={(event) => setLabelWidth(Number(event.target.value))} disabled={!isPremium} suffix="in" />
            <LayoutField id="label-height" label="Height" value={labelHeight} onChange={(event) => setLabelHeight(Number(event.target.value))} disabled={!isPremium} suffix="in" />
            <LayoutField id="label-columns" label="Columns" value={columns} onChange={(event) => setColumns(Math.max(1, Number(event.target.value)))} disabled={!isPremium} suffix="" />
            <LayoutField id="label-rows" label="Rows" value={rows} onChange={(event) => setRows(Math.max(1, Number(event.target.value)))} disabled={!isPremium} suffix="" />
          </div>
          <p className="layout-summary">{labelsPerPage} labels per page · {columns} columns × {rows} rows</p>
          {lastResetDate && <p className="layout-reset">Usage reset {new Date(lastResetDate).toLocaleDateString()}</p>}
        </div>

        <div className="preview-controls preview-controls-inline">
          <PreviewControls
            selectedScale={selectedScale}
            applyScaleGlobally={applyScaleGlobally}
            onToggleGlobalScale={onToggleGlobalScale}
            onScaleChange={onScaleChange}
            globalLineSpacing={globalLineSpacing}
            onLineSpacingChange={onLineSpacingChange}
            onGlobalMoveStart={onGlobalMoveStart}
            selectedLabel={selectedLabel}
          />
        </div>

        <div className="preview-modal-body">
          {pages.map((page, pageIndex) => (
            <div className="preview-sheet" key={`preview-${pageIndex}`}>
              <div className="preview-sheet-title">Page {pageIndex + 1}</div>
              <div className="preview-sheet-grid" style={{ gridTemplateColumns: `repeat(${columns}, ${labelWidth}in)`, gridTemplateRows: `repeat(${rows}, ${labelHeight}in)` }}>
                {page.pageItems.map((address, itemIndex) => {
                  const key = `modal-preview-${pageIndex}-${itemIndex}`
                  const position = getLabelPosition(labelPositions, key)
                  const scale = getLabelScale(labelScales, globalScale, key, applyScaleGlobally)

                  return (
                    <PreviewSheetLabel
                      key={key}
                      address={address}
                      keyId={key}
                      style={{ width: `${labelWidth}in`, height: `${labelHeight}in` }}
                      position={{ x: position.x + globalLabelOffset.x, y: position.y + globalLabelOffset.y }}
                      scale={scale}
                      lineSpacing={globalLineSpacing}
                      selected={selectedLabel === key}
                      onSelect={onSelectLabel}
                      onMoveStart={onLabelMoveStart}
                    />
                  )
                })}
                {page.emptySlots.map((_, index) => <div className="preview-sheet-label empty-slot" key={`preview-empty-${pageIndex}-${index}`} style={{ width: `${labelWidth}in`, height: `${labelHeight}in` }} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPaywall && <Paywall onClose={onClosePaywall} />}
    </div>
  )
}
