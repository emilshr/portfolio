import type { ContactCTABlock as ContactCTABlockProps } from '@/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

import { sectionHeading } from '@/components/chiri/classNames'

const icons = {
  calendar: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.5 6.5v5M4.5 4v.01M8 11.5v-3a2 2 0 1 1 4 0v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 13.5c-2.7.9-2.7-1.3-4-1.5m8 3v-2.2c.1-.5-.1-1-.4-1.4 2.1-.2 4.4-1 4.4-4.8 0-1-.4-2-1.1-2.7.2-.7.2-1.4-.1-2-.2-.7-1.3-.8-2.8.4a9.4 9.4 0 0 0-5 0C3.5 1.9 2.4 2 2.2 2.6c-.3.7-.3 1.4-.1 2-.7.8-1.1 1.7-1.1 2.7 0 3.8 2.3 4.6 4.4 4.8-.3.3-.4.8-.4 1.4V15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
}

export const ContactCTABlockComponent: React.FC<ContactCTABlockProps> = async ({
  heading = 'Connect',
  useGlobalLinks = true,
  links,
}) => {
  const settings = await getSiteSettings()

  const contactLinks = useGlobalLinks
    ? [
        { label: 'Schedule a call', url: settings.contactLinks.calCom, icon: 'calendar' as const },
        { label: 'LinkedIn', url: settings.contactLinks.linkedin, icon: 'linkedin' as const },
        { label: 'GitHub', url: settings.contactLinks.github, icon: 'github' as const },
      ].filter((l) => l.url)
    : (links ?? [])
        .map((l) => ({
          label: l.label,
          url: l.link?.url || '#',
          icon: 'calendar' as const,
        }))
        .filter((l) => l.url)

  return (
    <section className="contact-cta">
      <h2 className={sectionHeading}>{heading}</h2>
      <ul className="m-0 flex list-none gap-4 p-0">
        {contactLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-(length:--font-size-s) text-(--text-secondary) no-underline"
            >
              {icons[link.icon as keyof typeof icons]}
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
