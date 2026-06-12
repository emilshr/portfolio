import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight">Not found</h1>
      <p className="text-muted-foreground">This journey does not exist or is not published yet.</p>
      <Link href="/" className="text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
        Back home
      </Link>
    </div>
  )
}
