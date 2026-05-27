import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journeys',
  description: 'Travel blog by Emil',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
