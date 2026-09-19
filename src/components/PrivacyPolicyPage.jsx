import { useEffect } from 'react'
import '../styles/PrivacyPolicy.css'

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy | LabelCrafter'

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }

    metaDescription.setAttribute('content', 'Privacy Policy for LabelCrafter.')
  }, [])

  return (
    <main className="privacy-page">
      <header className="privacy-header">
        <a className="privacy-brand" href="/" aria-label="LabelCrafter home">
          <img src="/ParseLabLogo.svg" alt="" />
          <span>LabelCrafter</span>
        </a>
        <nav className="privacy-nav" aria-label="Primary navigation">
          <a href="/">Home</a>
        </nav>
      </header>

      <article className="privacy-card">
        <p className="privacy-kicker">Privacy Policy</p>
        <h1>Privacy Policy</h1>
        <p className="privacy-effective">Effective Date: 2026-09-19</p>

        <section>
          <h2>Overview</h2>
          <p>
            LabelCrafter helps you turn packing-slip PDFs into clean, printable shipping labels. We are committed to being
            transparent about the information we need to create your account, manage your plan, and deliver the service.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>We collect only the information needed to provide LabelCrafter to you.</p>
          <ul>
            <li>
              <strong>Account information:</strong> when you sign up or sign in, we may collect your name, email address,
              profile image, and account details needed to create and maintain your LabelCrafter account.
            </li>
            <li>
              <strong>Google sign-in information:</strong> if you choose to sign in with Google, we may receive the information
              needed to confirm your Google account and create or access your LabelCrafter account, such as your name, email
              address, and profile information. We do not receive your Google password.
            </li>
            <li>
              <strong>Subscription and plan information:</strong> we may collect the plan you choose and subscription details
              needed to manage your LabelCrafter account and billing.
            </li>
            <li>
              <strong>Usage information:</strong> we track how many addresses you successfully process so we can apply your
              plan limits and keep your usage accurate.
            </li>
            <li>
              <strong>Shipping addresses:</strong> when you upload packing slips, LabelCrafter uses the addresses extracted from
              those files to create the labels you need.
            </li>
          </ul>
        </section>

        <section>
          <h2>How We Use Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>create and maintain your LabelCrafter account</li>
            <li>sign you in and keep your account secure</li>
            <li>manage your subscription and plan access</li>
            <li>track usage against your plan limits</li>
            <li>process your packing slips and generate the labels you need</li>
            <li>communicate with you when needed about your service or account</li>
          </ul>
          <p>We do not sell your personal information.</p>
        </section>

        <section>
          <h2>Google Sign-In</h2>
          <p>
            If you sign in with Google, Google confirms your account and LabelCrafter uses the information needed to create or
            access your LabelCrafter account. This may include your name, email address, and profile information. We do not see
            your Google password.
          </p>
          <p>
            For more information about Google’s privacy practices, please review the{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2>Payments and Subscriptions</h2>
          <p>
            LabelCrafter uses Stripe to process subscription payments. Stripe handles the payment information required for billing,
            and we use the subscription details we need to provide the plan you selected.
          </p>
          <p>
            Please review the{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">Stripe Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2>PDFs and Shipping Addresses</h2>
          <p>
            When you upload a packing slip, LabelCrafter uses the information on that document to find the shipping address needed
            to create your labels. This address may include personal information such as a customer’s name and street address.
          </p>
          <p>
            Please only upload the information you need for your shipping-label workflow. We use your uploaded addresses to create
            the labels you requested and to keep your plan usage accurate.
          </p>
        </section>

        <section>
          <h2>Usage Tracking</h2>
          <p>
            LabelCrafter tracks the number of addresses processed so we can apply each plan’s monthly limit. Free plans include
            25 addresses per cycle, Hobby plans include 250 addresses per cycle, and Unlimited plans include unlimited addresses.
            This usage is tied to your LabelCrafter account.
          </p>
        </section>

        <section>
          <h2>Cookies and Tracking</h2>
          <p>
            LabelCrafter does not currently use advertising cookies or tracking tools for marketing or analytics.
          </p>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>
            We keep the account, subscription, and usage information needed to provide LabelCrafter and maintain your service.
            We may retain records as long as they are needed for account access, billing, and plan management.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We use reasonable safeguards to help protect your information from unauthorized access, misuse, or disclosure. No
            method of storage or transmission is completely risk-free, but we take care to protect the information we need to
            provide the service.
          </p>
        </section>

        <section>
          <h2>Your Choices</h2>
          <p>
            You can sign out at any time, review your account details in LabelCrafter, and contact us if you have questions about
            your account, plan, or privacy-related concerns. Depending on where you live, you may also have additional rights
            related to your personal information.
          </p>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make changes, we will update the Effective Date at the
            top of this page.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy or how LabelCrafter handles your information, please contact us at{' '}
            <strong>labelcrafterstudio@gmail.com
</strong>.
          </p>
        </section>
      </article>
    </main>
  )
}
