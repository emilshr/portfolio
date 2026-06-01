import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col items-center justify-center gap-4 px-[clamp(1.5rem,5vw,4rem)] text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight">Not found</h1>
      <p className="text-muted-foreground">This journey does not exist or is not published yet.</p>
      <Link href="/" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
        Back home
      </Link>
    </div>
  )
}
