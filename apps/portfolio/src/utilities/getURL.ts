import canUseDOM from './canUseDOM'
import { getPrimaryProductionURL } from './railwayURLs'

export const getServerSideURL = () => {
  const primaryProductionURL = getPrimaryProductionURL()

  return process.env.NEXT_PUBLIC_SERVER_URL || primaryProductionURL || 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  const primaryProductionURL = getPrimaryProductionURL()

  if (primaryProductionURL) {
    return primaryProductionURL
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
