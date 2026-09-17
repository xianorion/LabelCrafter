function looksLikeSeparator(text) {
  const trimmed = text.trim()

  return !trimmed
    ? true
    : /^[-_=]{3,}$/.test(trimmed) || /^•+$/.test(trimmed) || /^\s*(ship to|shipping address)\s*$/i.test(trimmed)
}

function isUSCountry(text) {
  const cleaned = text.trim().toLowerCase()
  return ['usa', 'united states', 'united states of america', 'us', 'u.s.', 'u.s.a.'].includes(cleaned)
}

export function extractShippingAddress(textItems, fallbackName) {
  const shipToIndex = textItems.findIndex((text) => /ship\s+to/i.test(text))

  if (shipToIndex === -1) {
    return fallbackName
  }

  const labelLines = []
  for (let index = shipToIndex + 1; index < textItems.length; index += 1) {
    const line = textItems[index]

    if (!line || looksLikeSeparator(line)) {
      continue
    }

    if (/bill\s+to/i.test(line) || isUSCountry(line)) {
      break
    }

    if (/country/i.test(line)) {
      labelLines.push(line)
      break
    }

    labelLines.push(line)
  }

  const addressText = labelLines.join('\n')
  const hasLetter = /[A-Za-z]/.test(addressText)
  const hasDigit = /\d/.test(addressText)

  return hasLetter && hasDigit ? addressText : fallbackName
}