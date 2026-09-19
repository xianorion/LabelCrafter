export default function ParserUpload({ sourcePlatform, onPlatformChange, dragActive, onDragOver, onDragEnter, onDragLeave, onDrop, onInputChange }) {
  return (
    <>
      <fieldset className="platform-selector">
        <legend>What kind of packing slip are you uploading?</legend>
        <div className="platform-options">
          {['etsy', 'shopify'].map((platform) => (
            <label className={`platform-option ${sourcePlatform === platform ? 'selected' : ''}`} key={platform}>
              <input
                type="radio"
                name="source-platform"
                value={platform}
                checked={sourcePlatform === platform}
                onChange={onPlatformChange}
              />
              <span>{platform[0].toUpperCase() + platform.slice(1)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label
        className={`upload-zone ${dragActive ? 'active' : ''} ${!sourcePlatform ? 'disabled' : ''}`}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input type="file" accept="application/pdf" multiple disabled={!sourcePlatform} onChange={onInputChange} />
        <span className="upload-icon">⬆</span>
        <strong>{sourcePlatform ? 'Drop PDF files here' : 'Choose Etsy or Shopify first'}</strong>
        <span>{sourcePlatform ? 'or click to browse' : 'A source selection is required to parse your PDF'}</span>
      </label>
    </>
  )
}