import { ChiriAlertBanner } from '@/components/chiri/AlertBanner'
import type { AlertBannerBlock as AlertBannerBlockProps } from '@/payload-types'

export const AlertBannerBlockComponent: React.FC<AlertBannerBlockProps> = (props) => {
  return <ChiriAlertBanner text={props.text} link={props.link} />
}
