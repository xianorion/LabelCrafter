import * as pdfjsLib from 'pdfjs-dist'
import { extractShippingAddress } from './addressParser'

export async function parseShippingAddresses(file) {
  if (!file) {
    return []
  }

  const data = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data }).promise
  const pageCount = pdf.numPages || 1
  const fallbackName = file.name.replace(/\.pdf$/i, '')
  const parsedAddresses = []

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const items = content?.items || []
    const textItems = items.map((item) => (item?.str || '').replace(/\s+/g, ' ').trim()).filter(Boolean)

    parsedAddresses.push(extractShippingAddress(textItems, fallbackName))
  }

  return parsedAddresses
}

export { extractShippingAddress }