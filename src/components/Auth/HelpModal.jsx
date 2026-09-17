import { useCallback, useEffect, useState } from 'react'
import { helpPlatforms, helpStepsByPlatform } from './helpContent'
import '../../styles/HelpModal.css'

function GuideImage({ image, label }) {
  if (!image) {
    return null
  }

  return (
    <figure className="help-visual">
      <img src={encodeURI(image)} alt={label} />
      <figcaption>{label}</figcaption>
    </figure>
  )
}

export function HelpGuideSteps({ compact = false }) {
  const [platform, setPlatform] = useState('etsy')
  const steps = helpStepsByPlatform[platform]

  return (
    <div>
      <div className="help-platform-tabs" role="tablist" aria-label="Packing slip platform">
        {helpPlatforms.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={platform === item.id}
            className={platform === item.id ? 'active' : ''}
            key={item.id}
            onClick={() => setPlatform(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={`help-steps ${compact ? 'help-steps-compact' : ''}`}>
      {steps.map((step) => (
        <article className="help-step" key={step.number}>
          <div className="help-step-heading">
            <span className="help-step-number">{step.number}</span>
            <h3>{step.title}</h3>
          </div>
          <p>{step.text}</p>
          <GuideImage image={step.image} label={`${platform} guide: ${step.title}`} />
        </article>
      ))}
      </div>
    </div>
  )
}

export default function HelpModal({ isOpen, onClose }) {
  const [platform, setPlatform] = useState('etsy')
  const [activeStep, setActiveStep] = useState(0)
  const steps = helpStepsByPlatform[platform]

  const closeModal = useCallback(() => {
    setActiveStep(0)
    onClose()
  }, [onClose])

  const selectPlatform = (nextPlatform) => {
    setPlatform(nextPlatform)
    setActiveStep(0)
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeModal, isOpen])

  if (!isOpen) {
    return null
  }

  const step = steps[activeStep]

  return (
    <div className="help-modal-overlay" role="presentation" onClick={closeModal}>
      <section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-modal-title" onClick={(event) => event.stopPropagation()}>
        <header className="help-modal-header">
          <div>
            <p className="help-modal-kicker">Merchant guide</p>
            <h2 id="help-modal-title">How to Use ParseLab</h2>
          </div>
          <button type="button" className="help-close-button" aria-label="Close help guide" onClick={closeModal}>×</button>
        </header>

        <div className="help-platform-tabs help-modal-platform-tabs" role="tablist" aria-label="Packing slip platform">
          {helpPlatforms.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={platform === item.id}
              className={platform === item.id ? 'active' : ''}
              key={item.id}
              onClick={() => selectPlatform(item.id)}
            >
              {item.label} packing slips
            </button>
          ))}
        </div>

        <div className="help-progress" aria-label={`Step ${activeStep + 1} of ${steps.length}`}>
          {steps.map((item, index) => (
            <button
              type="button"
              className={`help-progress-step ${index === activeStep ? 'active' : ''}`}
              key={item.number}
              onClick={() => setActiveStep(index)}
              aria-label={`Go to step ${index + 1}: ${item.title}`}
              aria-current={index === activeStep ? 'step' : undefined}
            >
              <span>{item.number}</span>
              <b>{item.title}</b>
            </button>
          ))}
        </div>

        <div className="help-modal-step" key={step.number}>
          <span className="help-step-number">{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          <GuideImage image={step.image} label={`${platform} guide: ${step.title}`} />
        </div>

        <footer className="help-modal-footer">
          <span>Step {activeStep + 1} of {steps.length}</span>
          <div>
            <button type="button" className="secondary-button" onClick={() => setActiveStep((current) => Math.max(0, current - 1))} disabled={activeStep === 0}>Back</button>
            {activeStep < steps.length - 1 ? (
              <button type="button" className="export-button" onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))}>Next step</button>
            ) : (
              <button type="button" className="export-button" onClick={closeModal}>Start parsing</button>
            )}
          </div>
        </footer>
      </section>
    </div>
  )
}
