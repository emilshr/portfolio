import { ErrorPage } from '@/components/chiri/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      message="The page you're looking for doesn't exist or was moved."
    />
  )
}
