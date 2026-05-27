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
import type { Experience } from '@repo/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { cn } from '@/utilities/ui'

import {
  listDivider,
  listDottedDivider,
  postListUl,
  sectionHeading,
} from './classNames'

type Props = {
  experiences: Experience[]
  settings: SiteSettingsData
  heading?: string
}

export function WorkExperience({ experiences, settings, heading = 'Work' }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Experience | null>(null)
  const dotted = settings.general.postListDottedDivider
  const dividerClass = dotted ? listDottedDivider : listDivider

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
    <section className="work-experience">
      <h2 className={sectionHeading}>{heading}</h2>
      <HoverFocusProvider>
        <ul className={cn(postListUl, 'flex flex-col gap-3.5')}>
          {experiences.map((exp) => {
            const id = String(exp.id)
            return (
              <HoverFocusItem key={exp.id} id={id}>
                <div
                  role="button"
                  tabIndex={0}
                  className="w-full cursor-pointer"
                  onClick={() => openExperience(exp)}
                  onKeyDown={(e) => handleRowKeyDown(e, exp)}
                >
                  <div className="flex min-h-11 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <HoverFocusText
                        itemId={id}
                        variant="primary"
                        className="m-0 text-(length:--font-size-m) font-(length:--font-weight-bold) leading-snug"
                      >
                        {exp.title}
                      </HoverFocusText>
                      <HoverFocusText
                        itemId={id}
                        as="span"
                        variant="secondary"
                        className="m-0 block text-(length:--font-size-s) leading-snug"
                      >
                        {exp.company}
                      </HoverFocusText>
                    </div>
                    <div className={dividerClass} aria-hidden />
                    <HoverFocusText
                      itemId={id}
                      variant="secondary"
                      className="date shrink-0 self-center text-(length:--font-size-s) font-features"
                    >
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
        <DialogContent
          className={cn(
            'gap-4 overflow-hidden border-(--border) bg-(--bg) p-6 text-(--text-primary) sm:max-w-lg',
            'max-h-[min(85vh,100%)]',
            'max-md:w-[calc(100vw-2.7rem)] max-md:max-w-[calc(100vw-2.7rem)]',
            '[&>button]:text-(--text-secondary) [&>button:hover]:text-(--text-primary)',
          )}
        >
          {selected && (
            <>
              <DialogHeader className="max-md:text-center">
                <DialogTitle className="max-md:text-center">{selected.title}</DialogTitle>
                <DialogDescription asChild>
                  <p className="m-0 text-left text-(length:--font-size-s) text-(--text-secondary) max-md:text-center">
                    <a
                      href={selected.url}
                      className="inline-flex items-center gap-1 text-(--text-primary) underline underline-offset-2 hover:opacity-85"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selected.company}
                      <ExternalLink className="size-[0.875em] shrink-0 opacity-75" aria-hidden="true" />
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <span className="text-(--text-secondary)">
                      {' '}
                      · {selected.from} – {selected.to}
                    </span>
                  </p>
                </DialogDescription>
              </DialogHeader>
              {selected.description && (
                <div className="-mx-4 max-h-[min(50vh,28rem)] overflow-y-auto px-4 [scrollbar-width:thin] [&_.prose]:mb-0">
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
