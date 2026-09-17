function PreviewSheetLabel({
  address,
  keyId,
  position,
  scale,
  lineSpacing,
  selected,
  onSelect,
  onMoveStart,
  style,
}) {
  const lines = typeof address === 'string' ? address.split(/\r?\n|\\n/) : []

  return (
    <div className={`preview-sheet-label ${selected ? 'selected' : ''}`} style={style} onClick={() => onSelect(keyId)}>
      <button
        type="button"
        className="preview-drag-handle"
        aria-label="Move label"
        onPointerDown={(event) => onMoveStart(event, keyId)}
      >
        ⤢
      </button>
      <div
        className="preview-sheet-label-text"
        style={{
          fontSize: `${14 * scale}px`,
          lineHeight: `${lineSpacing * scale}`,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {lines.map((line, lineIndex) => (
          <div key={`${keyId}-${lineIndex}`}>{line}</div>
        ))}
      </div>
    </div>
  )
}

export default PreviewSheetLabel
