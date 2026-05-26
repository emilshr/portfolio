'use client'

import { ExternalLink } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'

import RichText from '@/components/RichText'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { HoverFocusItem, HoverFocusProvider, HoverFocusText } from '@/components/chiri/hoverFocusList'
import type { Experience } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'

type Props = {
  experiences: Experience[]
  settings: SiteSettingsData
  heading?: string
}

export function WorkExperience({ experiences, settings, heading = 'Work' }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Experience | null>(null)
  const dotted = settings.general.postListDottedDivider

  const openExperience = (exp: Experience) => {
    setSelected(exp)
    setOpen(true)
  }

  const handleRowKeyDown = (e: KeyboardEvent<HTMLDivElement>, exp: Experience) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openExperience(exp)
    }
  }

  return (
    <section className="work-experience chiri-work">
      <h2 className="section-heading">{heading}</h2>
      <HoverFocusProvider>
        <ul>
          {experiences.map((exp) => {
            const id = String(exp.id)
            return (
              <HoverFocusItem key={exp.id} id={id}>
                <div
                  role="button"
                  tabIndex={0}
                  className="experience-row"
                  onClick={() => openExperience(exp)}
                  onKeyDown={(e) => handleRowKeyDown(e, exp)}
                >
                  <div className="experience-item">
                    <div className="role-group">
                      <HoverFocusText itemId={id} variant="primary" className="role">
                        {exp.title}
                      </HoverFocusText>
                      <HoverFocusText itemId={id} as="span" variant="secondary" className="company">
                        {exp.company}
                      </HoverFocusText>
                    </div>
                    <div className={dotted ? 'dotted-divider' : 'divider'} />
                    <HoverFocusText itemId={id} variant="secondary" className="date font-features">
                      {exp.from} – {exp.to}
                    </HoverFocusText>
                  </div>
                </div>
              </HoverFocusItem>
            )
          })}
        </ul>
      </HoverFocusProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="experience-dialog sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader className="experience-dialog-header">
                <DialogTitle className="experience-dialog-title">{selected.title}</DialogTitle>
                <DialogDescription asChild>
                  <p className="experience-dialog-subtitle">
                    <a
                      href={selected.url}
                      className="experience-dialog-company"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selected.company}
                      <ExternalLink
                        className="experience-dialog-company-icon"
                        aria-hidden="true"
                      />
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <span className="experience-dialog-dates">
                      {' '}
                      · {selected.from} – {selected.to}
                    </span>
                  </p>
                </DialogDescription>
              </DialogHeader>
              {selected.description && (
                <div className="experience-dialog-body prose">
                  <RichText data={selected.description} enableGutter={false} enableProse />
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

    </section>
  )
}
