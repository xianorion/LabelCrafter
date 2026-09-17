import { useEffect, useState } from 'react'

export function useLabelLayout() {
  const [labelPositions, setLabelPositions] = useState({})
  const [labelScales, setLabelScales] = useState({})
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [globalScale, setGlobalScale] = useState(1)
  const [applyScaleGlobally, setApplyScaleGlobally] = useState(false)
  const [globalLineSpacing, setGlobalLineSpacing] = useState(1.4)
  const [globalLabelOffset, setGlobalLabelOffset] = useState({ x: 0, y: 0 })
  const [activeDrag, setActiveDrag] = useState(null)
  const [activeGlobalDrag, setActiveGlobalDrag] = useState(null)

  useEffect(() => {
    if (!activeDrag && !activeGlobalDrag) {
      return undefined
    }

    const handlePointerMove = (event) => {
      if (activeDrag) {
        const deltaX = event.clientX - activeDrag.startX
        const deltaY = event.clientY - activeDrag.startY

        setLabelPositions((current) => ({
          ...current,
          [activeDrag.key]: {
            x: activeDrag.originX + deltaX,
            y: activeDrag.originY + deltaY,
          },
        }))
      }

      if (activeGlobalDrag) {
        const deltaX = event.clientX - activeGlobalDrag.startX
        const deltaY = event.clientY - activeGlobalDrag.startY

        setGlobalLabelOffset({
          x: activeGlobalDrag.originX + deltaX,
          y: activeGlobalDrag.originY + deltaY,
        })
      }
    }

    const handlePointerUp = () => {
      setActiveDrag(null)
      setActiveGlobalDrag(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [activeDrag, activeGlobalDrag])

  const handleLabelDragStart = (event, key) => {
    event.preventDefault()
    event.stopPropagation()

    const currentPosition = labelPositions[key] || { x: 0, y: 0 }

    setSelectedLabel(key)
    setActiveDrag({
      key,
      startX: event.clientX,
      startY: event.clientY,
      originX: currentPosition.x,
      originY: currentPosition.y,
    })
  }

  const handleGlobalDragStart = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setActiveGlobalDrag({
      startX: event.clientX,
      startY: event.clientY,
      originX: globalLabelOffset.x,
      originY: globalLabelOffset.y,
    })
  }

  const handleSelectedScaleChange = (event) => {
    const nextValue = Number(event.target.value)

    if (applyScaleGlobally) {
      setGlobalScale(nextValue)
      return
    }

    if (selectedLabel) {
      setLabelScales((current) => ({ ...current, [selectedLabel]: nextValue }))
    }
  }

  return {
    labelPositions,
    labelScales,
    selectedLabel,
    globalScale,
    applyScaleGlobally,
    globalLineSpacing,
    globalLabelOffset,
    setSelectedLabel,
    setGlobalLineSpacing,
    setApplyScaleGlobally,
    handleLabelDragStart,
    handleGlobalDragStart,
    handleSelectedScaleChange,
  }
}