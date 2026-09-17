import { extractShippingAddress } from './addressParser'

describe('shippingParser', () => {
  it('extracts an Etsy address from the Ship to section', () => {
    const textItems = [
      'Example Store',
      'example-store.etsy.com',
      'Ship to',
      'Doe, Jane',
      'PO Box 123',
      'WOODSIDE, CA 11111',
      'United States',
      'Scheduled to ship by',
      'May 5, 2026',
      'From',
      'Example Seller',
    ]

    expect(extractShippingAddress(textItems, 'etsyMultiPackagingSlips')).toBe(
      'Doe, Jane\nPO Box 123\nWOODSIDE, CA 11111',
    )
  })

  it('extracts a Shopify-style address from the Ship to section', () => {
    const textItems = [
      'Ship to',
      'Jane Doe',
      '123 Main St',
      'Austin, TX 78701',
      'United States',
      'Order',
    ]

    expect(extractShippingAddress(textItems, 'shopify-slip')).toBe(
      'Jane Doe\n123 Main St\nAustin, TX 78701',
    )
  })
})