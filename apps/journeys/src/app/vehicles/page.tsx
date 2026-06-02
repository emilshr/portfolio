import type { Metadata } from 'next'

import { VehicleSection } from '@/components/vehicles/VehicleSection'
import { getLatestVehicleForMetadata, getPublishedVehicles } from '@/lib/payload'
import { vehiclesPageMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const vehicle = await getLatestVehicleForMetadata()
  return vehiclesPageMetadata(vehicle)
}

export default async function VehiclesPage() {
  const vehicles = await getPublishedVehicles()

  return (
    <div className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)] py-[var(--space-12)] md:py-[var(--space-16)]">
      <header className="mb-[var(--space-10)]">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Vehicles</h1>
        <p className="mt-[var(--space-3)] max-w-2xl text-muted-foreground">
          Motorcycles, details, and all the modifications tracked from the CMS.
        </p>
      </header>

      {vehicles.length === 0 ? (
        <p className="text-muted-foreground">No vehicles published yet.</p>
      ) : (
        <div className="space-y-[var(--space-14)]">
          {vehicles.map((vehicle, index) => (
            <section key={vehicle.id} className="space-y-[var(--space-8)]">
              {index > 0 ? <hr className="border-border/60" aria-hidden /> : null}
              <VehicleSection vehicle={vehicle} />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
