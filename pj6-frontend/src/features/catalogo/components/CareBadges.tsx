import { Cloud, CloudSun, Droplet, Sun } from 'lucide-react'
import type { LightLevel, WaterLevel } from '@/types/api'
import { LIGHT_LABELS, WATER_LABELS } from '../constants'

export const LIGHT_ICONS: Record<LightLevel, typeof Sun> = {
  sol: Sun,
  'media-sombra': CloudSun,
  sombra: Cloud,
}

const WATER_DROPS: Record<WaterLevel, number> = { bajo: 1, medio: 2, alto: 3 }

interface CareBadgesProps {
  light?: LightLevel
  water?: WaterLevel
}

/** Glifos de cuidado de la planta (luz y riego), legibles de un vistazo. */
export default function CareBadges({ light, water }: CareBadgesProps) {
  if (!light && !water) return null
  const LightIcon = light ? LIGHT_ICONS[light] : null

  return (
    <div className="flex shrink-0 items-center gap-2 text-muted">
      {light && LightIcon && (
        <span role="img" aria-label={`Luz: ${LIGHT_LABELS[light]}`} className="flex items-center">
          <LightIcon size={16} aria-hidden="true" />
        </span>
      )}
      {water && (
        <span role="img" aria-label={WATER_LABELS[water]} className="flex items-center">
          {Array.from({ length: WATER_DROPS[water] }, (_, i) => (
            <Droplet key={i} size={16} aria-hidden="true" />
          ))}
        </span>
      )}
    </div>
  )
}