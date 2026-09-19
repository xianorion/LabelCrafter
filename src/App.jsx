import { useState } from 'react'
import { createPortal } from 'react-dom'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useAuth } from './context/AuthContext'
import PreviewLabels from './components/PreviewLabels'
import ParserHeader from './components/ParserHeader'
import ParserUpload from './components/ParserUpload'
import ParserWorkspace from './components/ParserWorkspace'
import PrintableLabelSheet from './components/PrintableLabelSheet'
import { useLabelLayout } from './hooks/useLabelLayout'
import { usePdfParsing } from './hooks/usePdfParsing'
import { usePrintLayout } from './hooks/usePrintLayout'
import './styles/App.css'

GlobalWorkerOptions.workerSrc = pdfWorker

function App() {
  const { user, tierConfig, tierLoading } = useAuth()
  const [showPreview, setShowPreview] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const canResizeLabels = !tierLoading && tierConfig.canResizeLabels
  const labelLayout = useLabelLayout(canResizeLabels)
  const printLayout = usePrintLayout(canResizeLabels)
  const parsing = usePdfParsing(user, () => setShowPaywall(true))

  const handleRemoveAddress = (addressId) => {
    parsing.removeAddress(addressId)
    if (labelLayout.selectedLabel === addressId) {
      labelLayout.setSelectedLabel(null)
    }
  }

  const handleClearAllAddresses = () => {
    parsing.clearAllAddresses()
    labelLayout.setSelectedLabel(null)
  }

  return (
    <>
      <div className="app-shell">
      <ParserHeader />
      <ParserUpload
        sourcePlatform={parsing.sourcePlatform}
        onPlatformChange={parsing.handlePlatformChange}
        dragActive={parsing.dragActive}
        onDragOver={(event) => {
          event.preventDefault()
          parsing.setDragActive(true)
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          parsing.setDragActive(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          parsing.setDragActive(false)
        }}
        onDrop={parsing.handleDrop}
        onInputChange={parsing.handleInputChange}
      />

      <div className="export-bar">
        <div className="label-count-pill">
          {parsing.extractedAddresses.length} generated label{parsing.extractedAddresses.length === 1 ? '' : 's'}
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setShowPreview(true)}
          disabled={parsing.extractedAddresses.length === 0}
        >
          Preview labels
        </button>
      </div>

      {parsing.parseError && <div className="parse-error" role="alert">{parsing.parseError}</div>}
      {parsing.parseToast && <div className="usage-toast" role="alert">{parsing.parseToast}</div>}

      <ParserWorkspace
        addresses={parsing.extractedAddresses}
        labelPositions={labelLayout.labelPositions}
        labelScales={labelLayout.labelScales}
        selectedLabel={labelLayout.selectedLabel}
        globalScale={labelLayout.globalScale}
        applyScaleGlobally={labelLayout.applyScaleGlobally}
        globalLineSpacing={labelLayout.globalLineSpacing}
        globalLabelOffset={labelLayout.globalLabelOffset}
        onSelectLabel={labelLayout.setSelectedLabel}
        onLabelMoveStart={labelLayout.handleLabelDragStart}
        onRemoveAddress={handleRemoveAddress}
        onClearAll={handleClearAllAddresses}
        columns={printLayout.columns}
        rows={printLayout.rows}
        labelWidth={printLayout.labelWidth}
        labelHeight={printLayout.labelHeight}
      />

      <PreviewLabels
        addresses={parsing.extractedAddresses}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        labelPositions={labelLayout.labelPositions}
        labelScales={labelLayout.labelScales}
        selectedLabel={labelLayout.selectedLabel}
        globalScale={labelLayout.globalScale}
        applyScaleGlobally={labelLayout.applyScaleGlobally}
        globalLineSpacing={labelLayout.globalLineSpacing}
        globalLabelOffset={labelLayout.globalLabelOffset}
        onSelectLabel={labelLayout.setSelectedLabel}
        onLabelMoveStart={labelLayout.handleLabelDragStart}
        onGlobalMoveStart={labelLayout.handleGlobalDragStart}
        onToggleGlobalScale={() => labelLayout.setApplyScaleGlobally((current) => !current)}
        onScaleChange={labelLayout.handleSelectedScaleChange}
        onLineSpacingChange={(event) => labelLayout.setGlobalLineSpacing(Number(event.target.value))}
        printLayout={printLayout}
        usageRevision={parsing.usageRevision}
        showPaywall={showPaywall}
        onClosePaywall={() => setShowPaywall(false)}
      />
      </div>
      {createPortal(
        <div className="print-only" aria-hidden="true">
          <PrintableLabelSheet
            addresses={parsing.extractedAddresses}
            layout={printLayout}
            labelPositions={labelLayout.labelPositions}
            labelScales={labelLayout.labelScales}
            globalScale={labelLayout.globalScale}
            applyScaleGlobally={labelLayout.applyScaleGlobally}
            globalLineSpacing={labelLayout.globalLineSpacing}
            globalLabelOffset={labelLayout.globalLabelOffset}
            interactive={false}
          />
        </div>,
        document.body,
      )}
    </>
  )
}

export default App
