'use client'

import { useEffect } from 'react'

import RichText from '@/components/RichText'
import type { Experience } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'

type Props = {
  experiences: Experience[]
  settings: SiteSettingsData
  heading?: string
}

export function WorkExperience({ experiences, settings, heading = 'Work' }: Props) {
  useEffect(() => {
    const dialog = document.getElementById('experience-dialog') as HTMLDialogElement | null
    if (!dialog || dialog.dataset.expDialogInitialized) return
    dialog.dataset.expDialogInitialized = 'true'

    const titleEl = document.getElementById('exp-dialog-title')
    const companyEl = document.getElementById('exp-dialog-company') as HTMLAnchorElement | null
    const companyNameEl = document.getElementById('exp-dialog-company-name')
    const datesEl = document.getElementById('exp-dialog-dates')
    const bodyEl = document.getElementById('exp-dialog-body')
    const closeButton = dialog.querySelector('.close-button') as HTMLButtonElement | null
    const panel = dialog.querySelector('.dialog-panel') as HTMLDivElement | null
    if (!titleEl || !companyEl || !companyNameEl || !datesEl || !bodyEl || !closeButton || !panel) return

    let trigger: HTMLElement | null = null
    let closing = false

    const openExperience = (row: HTMLElement) => {
      const id = row.dataset.expId
      const panelSource = id
        ? document.querySelector<HTMLElement>(`.exp-panel[data-exp-id="${id}"]`)
        : null
      if (!panelSource) return
      trigger = row
      titleEl.textContent = row.dataset.expTitle ?? ''
      companyNameEl.textContent = row.dataset.expCompany ?? ''
      companyEl.href = row.dataset.expUrl ?? '#'
      datesEl.textContent = ` · ${row.dataset.expFrom ?? ''} – ${row.dataset.expTo ?? ''}`
      bodyEl.innerHTML = panelSource.innerHTML
      document.body.classList.add('experience-dialog-open')
      document.body.style.overflow = 'hidden'
      dialog.showModal()
      requestAnimationFrame(() => {
        dialog.classList.add('is-open')
        panel.classList.add('is-open')
      })
      closeButton.focus()
    }

    const closeExperience = () => {
      if (closing || !dialog.open) return
      closing = true
      dialog.classList.remove('is-open')
      panel.classList.remove('is-open')
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400
      setTimeout(() => {
        dialog.close()
        document.body.classList.remove('experience-dialog-open')
        document.body.style.overflow = ''
        bodyEl.innerHTML = ''
        closing = false
        trigger?.focus()
        trigger = null
      }, duration)
    }

    document.querySelectorAll('.experience-row').forEach((row) => {
      row.addEventListener('click', () => openExperience(row as HTMLElement))
      row.addEventListener('keydown', (e) => {
        const ke = e as KeyboardEvent
        if (ke.key === 'Enter' || ke.key === ' ') {
          ke.preventDefault()
          openExperience(row as HTMLElement)
        }
      })
    })

    closeButton.addEventListener('click', closeExperience)
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeExperience()
    })
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault()
      closeExperience()
    })
  }, [experiences])

  return (
    <section className="work-experience chiri-work">
      <h2 className="section-heading">{heading}</h2>
      <ul>
        {experiences.map((exp) => (
          <li key={exp.id}>
            <div
              role="button"
              tabIndex={0}
              className="experience-row"
              data-exp-id={String(exp.id)}
              data-exp-title={exp.title}
              data-exp-company={exp.company}
              data-exp-url={exp.url}
              data-exp-from={exp.from}
              data-exp-to={exp.to}
            >
              <div className="experience-item">
                <div className="role-group">
                  <p className="role">{exp.title}</p>
                  <span className="company">{exp.company}</span>
                </div>
                <div
                  className={
                    settings.general.postListDottedDivider ? 'dotted-divider' : 'divider'
                  }
                />
                <p className="date font-features">
                  {exp.from} – {exp.to}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="exp-panels" hidden aria-hidden="true">
        {experiences.map((exp) => (
          <div key={exp.id} className="exp-panel" data-exp-id={String(exp.id)}>
            {exp.description && (
              <RichText data={exp.description} enableGutter={false} enableProse />
            )}
          </div>
        ))}
      </div>
      <ExperienceDialogMarkup />
      <div className="placeholder" />
    </section>
  )
}

function ExperienceDialogMarkup() {
  return (
    <dialog id="experience-dialog" className="experience-dialog" aria-labelledby="exp-dialog-title">
      <div className="dialog-panel">
        <button type="button" className="close-button" aria-label="Close">
          ×
        </button>
        <header className="dialog-header">
          <h2 id="exp-dialog-title" className="dialog-title" />
          <p className="dialog-subtitle">
            <a id="exp-dialog-company" className="dialog-company" href="#" target="_blank" rel="noopener noreferrer">
              <span id="exp-dialog-company-name" />
            </a>
            <span id="exp-dialog-dates" className="dialog-dates" />
          </p>
        </header>
        <div id="exp-dialog-body" className="dialog-body prose" />
      </div>
    </dialog>
  )
}
