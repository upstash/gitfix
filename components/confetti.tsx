import * as React from 'react'
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks'
import twColors from 'tailwindcss/colors'

export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <Fireworks
        autorun={{ speed: 2, duration: 800 }}
        decorateOptions={(defaultOptions) => ({
          ...defaultOptions,
          colors: [
            twColors.emerald['300'],
            twColors.yellow['400'],
            twColors.emerald['500'],
            twColors.yellow['600'],
            twColors.emerald['700'],
          ],
        })}
      />
    </div>
  )
}
