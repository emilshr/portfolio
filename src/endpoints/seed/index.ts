import type { Payload, PayloadRequest } from 'payload'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const seed = async ({
  payload,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Running portfolio seed script...')
  const scriptPath = path.resolve(dirname, '../../../scripts/seed.ts')
  execSync(`pnpm exec tsx ${scriptPath} --fresh`, {
    cwd: path.resolve(dirname, '../../..'),
    stdio: 'inherit',
    env: process.env,
  })
}
