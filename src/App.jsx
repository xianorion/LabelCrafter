import { useState } from 'react'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useAuth } from './context/AuthContext'
import PreviewLabels from './components/PreviewLabels'
import ParserHeader from './components/ParserHeader'
import ParserUpload from './components/ParserUpload'
import ParserWorkspace from './components/ParserWorkspace'
import { useLabelLayout } from './hooks/useLabelLayout'
import { usePdfParsing } from './hooks/usePdfParsing'
import { usePrintLayout } from './hooks/usePrintLayout'
import { generateWordDoc } from './utils/wordExport'
import './styles/App.css'

GlobalWorkerOptions.workerSrc = pdfWorker

function App() {
  const { user } = useAuth()
  const [showPreview, setShowPreview] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const labelLayout = useLabelLayout()
  const printLayout = usePrintLayout()
  const parsing = usePdfParsing(user, () => setShowPaywall(true))

  return (
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
        <button
          type="button"
          className="export-button"
          onClick={() => generateWordDoc(parsing.extractedAddresses, printLayout, labelLayout)}
          disabled={parsing.extractedAddresses.length === 0}
        >
          Export Word Doc
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
  )
}

export default App
