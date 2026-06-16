import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  const showSeed = process.env.NODE_ENV !== 'production'

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      {showSeed ? (
        <>
          Here&apos;s what to do next:
          <ul className={`${baseClass}__instructions`}>
            <li>
              <SeedButton />
              {' with sample content, then '}
              <a href="/" target="_blank" rel="noopener noreferrer">
                visit your website
              </a>
              {' to see the results.'}
            </li>
          </ul>
        </>
      ) : (
        <p>Use the sidebar to manage pages, posts, and media.</p>
      )}
    </div>
  )
}

export default BeforeDashboard
