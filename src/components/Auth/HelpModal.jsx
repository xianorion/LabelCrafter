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
            <h2 id="help-modal-title">How to Use LabelCrafter</h2>
          </div>
          <button type="button" className="help-close-button" aria-label="Close help guide" onClick={closeModal}>×</button>
        </header>
        <h3 className="help-modal-step">Step 1: Get your Packing slips from Etsy or Shopify</h3>
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
        <h3 className="help-modal-step">Step 2: Upload your packing slip PDF to LabelCrafter</h3>
        <p className="help-modal-description">Choose the platform you used to generate the packing slip PDF, then upload the file. LabelCrafter will extract the addresses and create printable labels for you.</p>
        <GuideImage image="/images/help/SelectAndUploadPDF.png"  />

        <h3 className="help-modal-step">Step 3: Print your labels</h3>
        <p className="help-modal-description">After LabelCrafter processes your packing slip, you can download a PDF of the labels and print them on standard label sheets or choose to format them for printing.</p>
        <GuideImage image="/images/help/exportButtonOptions.png"  />

        <p className="help-modal-description">For formatting options, you can adjust the scale, line spacing, and label offset. Once everything is set, you can print your labels.</p>
        <p className="help-modal-description">A1 and A2 in the image below show where you can adjust these settings. B directs you to where you can print your labels.</p>
        <GuideImage image="/images/help/formattingOptions.png" />
        <br />

        <p className="help-modal-outro">That’s it! You’re ready to ship your orders with clean, professional labels.</p>

        <p className="help-modal-footnote">LabelCrafter is a free tool for Etsy and Shopify sellers. We do not store your customer addresses.</p>

        <p className="help-modal-contact">Questions? Contact us at <a href="mailto:labelcrafterstudio@gmail.com">labelcrafterstudio@gmail.com</a></p>

     <br />
      </section>
    </div>
  )
}
