import { getBindProp, toCameCase } from './utils'
import { fetchAudioBuffer } from './fetch'
import { drawBarChart, drawTimeDomainBarChart } from './drawer'
import { createProcessors, processorsToProps, resetProcessors, setupProcessors } from './processor'

import type { AudioSource, BufferAudio, InternalAudio, MediaElementAudio, Processor, ProcessorPropType, ScheduledAudio } from './types'

export function createAudio<T extends BaseAudioContext = AudioContext>(userSource: string, userContext?: T): BufferAudio<T>
export function createAudio<T extends BaseAudioContext = AudioContext>(userSource: HTMLMediaElement, userContext?: T): MediaElementAudio<T>
export function createAudio<T extends BaseAudioContext = AudioContext>(userSource: AudioSource, userContext?: T): BufferAudio<T> | MediaElementAudio<T> | ScheduledAudio<T>
export function createAudio(userSource: string | HTMLMediaElement | AudioSource, userContext?: AudioContext | OfflineAudioContext) {
  const context = userContext ?? new AudioContext()

  let source: AudioSource
  let src: string | undefined
  if (typeof userSource === 'string') {
    source = context.createBufferSource()
    src = userSource
  } else if (context instanceof AudioContext && userSource instanceof HTMLMediaElement) {
    source = context.createMediaElementSource(userSource)
    src = userSource.src
  } else {
    source = userSource as AudioSource
  }

  const processors: Processor[] = []
  const props = new Map<string, ProcessorPropType>()

  const internal: InternalAudio = {
    src,
    processors,
    props,
    setupProcessors: setup,
    connectProcessors: connect,
    reconnectProcessors: reconnect,
    get,
    set,
    load,
    renderBarChart: (canvas, color) => drawBarChart(
      canvas,
      color,
      source instanceof MediaElementAudioSourceNode ? source.mediaElement.src : source as unknown as string,
      context,
    ),
    renderTimeDomainBarChart: (canvas, color) => drawTimeDomainBarChart(
      canvas,
      color,
      processors.find(v => v.name === 'analyser')!.node as any,
    ),
  }

  async function setup() {
    processors.push(
      ...(
        await createProcessors({
          source,
          context,
          reconnect,
        })
      ),
    )
    props.clear()
    processorsToProps(processors)
      .forEach((v, k) => props.set(k, v))
  }

  function connect() {
    setupProcessors(processors)
  }

  function reconnect() {
    resetProcessors(processors)
    setupProcessors(processors)
  }

  function get(name: string) {
    return props.get(toCameCase(name))?.getter?.()
  }

  function set(name: string, value: any) {
    return props.get(toCameCase(name))?.setter?.(value)
  }

  async function load() {
    if (source instanceof AudioBufferSourceNode && src) {
      source.buffer = await fetchAudioBuffer(src, context)
      await setup()
      connect()
    }
  }

  return new Proxy(source, {
    get(target: AudioSource, prop: string | symbol): any {
      return getBindProp(internal, prop) || getBindProp(target, prop)
    },
    set(target: AudioSource, prop: string | symbol, value: any): boolean {
      if (prop in internal) {
        (internal as any)[prop] = value
      } else {
        (target as any)[prop] = value
      }
      return true
    },
  }) as any
}
