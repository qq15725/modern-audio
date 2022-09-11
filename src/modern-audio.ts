import { getBindProp, toCameCase } from './utils'
import { fetchAudioBuffer } from './fetch'
import { createProcessors, processorsToProps, resetProcessors, setupProcessors } from './processor'

import type { AudioSource, InternalAudio, Processor, ProcessorPropType } from './types'

export class ModernAudio extends HTMLAudioElement {
  public source: { context: AudioContext } & InternalAudio & MediaElementAudioSourceNode

  constructor() {
    super()
    this.source = createModernAudio(this)
    this.setup()
  }

  public static install() {
    customElements.define('modern-audio', ModernAudio, { extends: 'audio' })
  }

  protected async setup() {
    this.setupListeners()
    await this.source.setupProcessors()
    for (let i = 0; i < this.attributes.length; i++) {
      const attribute = this.attributes.item(i)
      if (attribute) this.source.set(attribute.name, attribute.value)
    }
    this.source.connectProcessors()
  }

  protected setupListeners() {
    this.addEventListener('play', () => this.source.context.resume())
  }
}

export function createModernAudio<T extends BaseAudioContext = AudioContext>(userSource: string, userContext?: T): { context: T } & InternalAudio & AudioBufferSourceNode
export function createModernAudio<T extends BaseAudioContext = AudioContext>(userSource: HTMLMediaElement, userContext?: T): { context: T } & InternalAudio & MediaElementAudioSourceNode
export function createModernAudio<T extends BaseAudioContext = AudioContext>(userSource: AudioSource, userContext?: T): { context: T } & InternalAudio & AudioSource
export function createModernAudio(userSource: string | HTMLMediaElement | AudioSource, userContext?: AudioContext | OfflineAudioContext) {
  const context = userContext ?? new AudioContext()

  let source: AudioSource
  if (typeof userSource === 'string') {
    source = context.createBufferSource()
  } else if (context instanceof AudioContext && userSource instanceof HTMLMediaElement) {
    source = context.createMediaElementSource(userSource)
  } else {
    source = userSource as AudioSource
  }

  const processors: Processor[] = []
  let props = new Map<string, ProcessorPropType>()

  async function setup() {
    processors.push(
      ...(await createProcessors({
        source,
        context,
        reconnect,
      })),
    )
    props = processorsToProps(processors)
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
    if (source instanceof AudioBufferSourceNode && typeof userSource === 'string') {
      source.buffer = await fetchAudioBuffer(userSource, context)
      await setup()
      connect()
    }
  }

  load()

  const internal: InternalAudio = {
    processors,
    setupProcessors: setup,
    connectProcessors: connect,
    reconnectProcessors: reconnect,
    get,
    set,
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
