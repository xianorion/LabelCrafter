import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { parseShippingAddresses } from '../utils/shippingParser'

export function usePdfParsing(user, onLimitReached) {
  const [extractedAddresses, setExtractedAddresses] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [parseError, setParseError] = useState('')
  const [parseToast, setParseToast] = useState('')
  const [usageRevision, setUsageRevision] = useState(0)
  const [sourcePlatform, setSourcePlatform] = useState('')

  const showNoParsesNotice = () => {
    setParseToast('You have run out of free parses for this month. Upgrade to Premium for unlimited labels!')
    onLimitReached()
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

    const [{ data: usageData, error: usageReadError }, { data: tierData, error: tierReadError }] = await Promise.all([
      supabase.from('user_usage').select('parse_count').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle(),
    ])

    if (usageReadError || tierReadError) {
      setParseError('We could not verify your monthly parse allowance. Please try again.')
      return
    }

    if (tierData?.tier !== 'premium' && (usageData?.parse_count ?? 0) >= 1) {
      showNoParsesNotice()
      return
    }

    const { data: usageAllowed, error: usageError } = await supabase.rpc('increment_user_usage')

    if (usageError) {
      setParseError('We could not verify your monthly parse allowance. Please try again.')
      window.dispatchEvent(new Event('usage-updated'))
      return
    }

    if (usageAllowed !== true) {
      showNoParsesNotice()
      window.dispatchEvent(new Event('usage-updated'))
      return
    }

    const nextAddresses = (await Promise.all(pdfFiles.map((file) => parseShippingAddresses(file)))).flat()

    setExtractedAddresses((current) => [...current, ...nextAddresses])
    setUsageRevision((current) => current + 1)
    window.dispatchEvent(new Event('usage-updated'))
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
  }
}