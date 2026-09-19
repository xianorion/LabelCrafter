import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { parseShippingAddresses } from '../utils/shippingParser'

let addressSequence = 0

function createAddressRecord(text) {
  addressSequence += 1
  const generatedId = globalThis.crypto?.randomUUID?.() || `address-${Date.now()}-${addressSequence}`
  return { id: generatedId, text }
}

export function usePdfParsing(user, onLimitReached) {
  const { tierConfig, tierLoading, usageLoading, addressesRemaining } = useAuth()
  const [extractedAddresses, setExtractedAddresses] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [parseError, setParseError] = useState('')
  const [parseToast, setParseToast] = useState('')
  const [usageRevision, setUsageRevision] = useState(0)
  const [sourcePlatform, setSourcePlatform] = useState('')

  const showAddressLimitNotice = (addressCount) => {
    const remaining = addressesRemaining ?? 0
    const message = tierConfig.addressLimit === Infinity
      ? 'These addresses could not be imported. Please try again.'
      : `This import contains ${addressCount} addresses, but you have ${remaining} addresses remaining on your ${tierConfig.name} plan.`
    setParseToast(message)
    onLimitReached(message)
  }

  const handleFiles = async (files) => {
    if (!sourcePlatform) {
      setParseError('Choose Etsy or Shopify before uploading a PDF.')
      return
    }

    const pdfFiles = Array.from(files).filter((file) => {
      return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    })

    if (!pdfFiles.length) {
      return
    }

    setParseError('')

    if (!user || tierLoading || usageLoading) {
      setParseError('We are checking your plan and address usage. Please try again in a moment.')
      return
    }

    let nextAddresses
    try {
      nextAddresses = (await Promise.all(pdfFiles.map((file) => parseShippingAddresses(file)))).flat().filter(Boolean).map(createAddressRecord)
    } catch {
      setParseError('We could not extract addresses from this PDF. No address usage was consumed.')
      return
    }

    if (!nextAddresses.length) {
      setParseError('No valid shipping addresses were found. No address usage was consumed.')
      return
    }

    const { data: usageAllowed, error: usageError } = await supabase.rpc('increment_user_usage', { p_address_count: nextAddresses.length })

    if (usageError) {
      setParseError('We could not verify your monthly address allowance. Please try again.')
      window.dispatchEvent(new Event('usage-updated'))
      return
    }

    if (usageAllowed !== true) {
      showAddressLimitNotice(nextAddresses.length)
      window.dispatchEvent(new Event('usage-updated'))
      return
    }

    setExtractedAddresses((current) => [...current, ...nextAddresses])
    setParseToast(`${nextAddresses.length} address${nextAddresses.length === 1 ? '' : 'es'} successfully imported.`)
    setUsageRevision((current) => current + 1)
    window.dispatchEvent(new Event('usage-updated'))
  }

  const removeAddress = (addressId) => {
    setExtractedAddresses((current) => current.filter((address) => address.id !== addressId))
  }

  const clearAllAddresses = () => {
    setExtractedAddresses([])
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    setDragActive(false)
    await handleFiles(event.dataTransfer.files)
  }

  const handleInputChange = async (event) => {
    await handleFiles(event.target.files)
    event.target.value = ''
  }

  const handlePlatformChange = (event) => {
    setSourcePlatform(event.target.value)
    setParseError('')
  }

  useEffect(() => {
    if (!parseToast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setParseToast(''), 5000)

    return () => window.clearTimeout(timeoutId)
  }, [parseToast])

  return {
    extractedAddresses,
    dragActive,
    parseError,
    parseToast,
    usageRevision,
    sourcePlatform,
    setDragActive,
    handleDrop,
    handleInputChange,
    handlePlatformChange,
    removeAddress,
    clearAllAddresses,
  }
}