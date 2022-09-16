import { getBindProp, toCameCase } from './utils'
import { fetchAudioBuffer } from './fetch'
import { drawBarChart, drawTimeDomainBarChart } from './drawer'
import { createProcessors, processorsToProps, resetProcessors, setupProcessors } from './processor'

import type { AudioAnyContext, AudioInput, AudioSource, BufferAudio, InternalAudio, MediaElementAudio, Processor, ProcessorPropType, ScheduledAudio } from './types'

function resovleInput<T extends BaseAudioContext = AudioAnyContext>(value: AudioInput, userContext?: T) {
  const context = userContext ?? new AudioContext()

  if (typeof value === 'string') {
    const source = context.createBufferSource()
    return {
      context,
      source,
      src: value,
      load: async () => {
        source.buffer = await fetchAudioBuffer(value, context)
      },
      clone: () => {
        const buffer = source.buffer
        const clone = context.createBufferSource()
        clone.buffer = buffer
        return clone
      },
    }
  } else if (value instanceof AudioBuffer) {
    const source = context.createBufferSource()
    source.buffer = value
    return {
      context,
      source,
      clone: () => {
        const buffer = source.buffer
        const clone = context.createBufferSource()
        clone.buffer = buffer
        return clone
      },
    }
  } else if (context instanceof AudioContext && value instanceof HTMLMediaElement) {
    return {
      context,
      source: context.createMediaElementSource(value),
      src: value.src,
    }
  } else {
    return {
      context,
      source: value as AudioSource,
    }
  }
}

export function createAudio<T extends BaseAudioContext = AudioAnyContext>(value: string, context?: T): BufferAudio<T>
export function createAudio<T extends BaseAudioContext = AudioAnyContext>(value: AudioBuffer, context?: T): BufferAudio<T>
export function createAudio<T extends BaseAudioContext = AudioAnyContext>(value: HTMLMediaElement, context?: T): MediaElementAudio<T>
export function createAudio<T extends BaseAudioContext = AudioAnyContext>(value: AudioSource, context?: T): BufferAudio<T> | MediaElementAudio<T> | ScheduledAudio<T>
export function createAudio(value: AudioInput, context?: AudioAnyContext) {
  const { load, clone, ...attrs } = resovleInput(value, context)

  const internal: {
    src?: string
    load?: () => Promise<void>
    reset?: () => void
  } & InternalAudio = {
    ...attrs,
    processors: [] as Processor[],
    props: new Map<string, ProcessorPropType>(),
    setup() {
      resetProcessors(this.processors)
      this.processors = []
      this.processors = createProcessors({
        source: this.source,
        context: this.context,
        reconnect: () => {
          resetProcessors(this.processors)
          setupProcessors(this.processors)
        },
      })
      this.props.clear()
      processorsToProps(this.processors).forEach((v, k) => this.props.set(k, v))
      setupProcessors(this.processors)
    },
    get(name: string) {
      return this.props.get(toCameCase(name))?.getter?.()
    },
    set(name: string | Record<string, any>, value?: any) {
      if (typeof name === 'string') {
        this.props.get(toCameCase(name))?.setter?.(value)
      } else {
        for (const key in name) {
          this.set(key, name[key])
        }
      }
    },
    renderBarChart(canvas, color) {
      return drawBarChart(
        canvas,
        color,
        this.source instanceof MediaElementAudioSourceNode ? this.source.mediaElement.src : this.source as unknown as string,
        this.context,
      )
    },
    renderTimeDomainBarChart(canvas, color) {
      return drawTimeDomainBarChart(
        canvas,
        color,
        this.processors.find(v => v.name === 'analyser')!.node as any,
      )
    },
  }

  if (load) {
    internal.load = async function () {
      await load()
      this.setup()
    }
  }

  if (clone) {
    internal.reset = function () {
      this.source = clone()
      this.setup()
    }
  }

  if (!(internal.source instanceof AudioBufferSourceNode)) internal.setup()

  return new Proxy(internal, {
    get(target: any, prop: string | symbol): any {
      return getBindProp(target, prop) ?? getBindProp(target.source, prop)
    },
    set(target: any, prop: string | symbol, value: any): boolean {
      if (prop in target) {
        (target as any)[prop] = value
      } else {
        (target.source as any)[prop] = value
      }
      return true
    },
  }) as any
}
