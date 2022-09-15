import { Analyser } from './analyser'
import { Destination } from './destination'
import { Loop } from './loop'
import { NoiseReduction } from './noise-reduction'
import { Panner } from './panner'
import { PlaybackRate } from './playback-rate'
import { Source } from './source'
import { Volume } from './volume'

import type { ProcessorFactory } from '../types'

export function createProcessorFactories(userProcessorFactories?: ProcessorFactory[]) {
  userProcessorFactories = userProcessorFactories || []

  return [
    Source,
    PlaybackRate,
    Loop,
    NoiseReduction,
    Volume,
    Panner,
    ...userProcessorFactories,
    Analyser,
    Destination,
  ]
}
