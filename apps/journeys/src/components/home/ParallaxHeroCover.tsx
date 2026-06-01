'use client'

import type { Media } from '@repo/payload-types'
import { useEffect, useRef } from 'react'

import { PayloadImage } from '@/components/media/PayloadImage'

const PARALLAX_FACTOR = 0.35

type ParallaxHeroCoverProps = {
  media: Media | null
}

export function ParallaxHeroCover({ media }: ParallaxHeroCoverProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let raf = 0

    const update = () => {
      const section = sectionRef.current
      const image = imageRef.current
      if (!section || !image) return

      const { top } = section.getBoundingClientRect()
      image.style.transform = `translate3d(0, ${-top * PARALLAX_FACTOR}px, 0)`
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative h-[min(75dvh,700px)] w-full overflow-hidden sm:h-[min(80vh,760px)] md:h-[min(85vh,820px)] min-[1920px]:h-[min(88vh,1000px)] min-[2560px]:h-[min(92vh,1200px)]"
    >
      {media ? (
        <div
          ref={imageRef}
          className="absolute inset-x-0 -top-[7.5%] h-[115%] will-change-transform"
        >
          <PayloadImage
            media={media}
            size="hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-muted" aria-hidden />
      )}
    </div>
  )
}
