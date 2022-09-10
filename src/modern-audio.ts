import { createProcessors, getProcessorProp, resetProcessors, setupProcessors } from './processor'

import type { AudioEnv, Processor } from './types'

export class ModernAudio extends HTMLAudioElement {
  protected env: AudioEnv
  protected processors: Processor[] = []

  constructor() {
    super()
    const context = new AudioContext()
    this.env = {
      context,
      source: context.createMediaElementSource(this),
      reconnect: this.resetConnections.bind(this),
    }
    this.setup()
  }

  public static install() {
    customElements.define('modern-audio', ModernAudio, { extends: 'audio' })
  }

  protected setup() {
    this.setupListeners()
    this.setupConnections()
  }

  protected setupListeners() {
    this.addEventListener('play', () => this.env.context.resume())
  }

  protected async setupConnections() {
    this.processors = await createProcessors(this.env)
    for (let i = 0; i < this.attributes.length; i++) {
      const attribute = this.attributes.item(i)
      if (attribute) this.set(attribute.name, attribute.value)
    }
    setupProcessors(this.processors)
  }

  protected resetConnections() {
    resetProcessors(this.processors)
    setupProcessors(this.processors)
  }

  public get(name: string) {
    return getProcessorProp(name, this.processors)?.getter?.()
  }

  public set(name: string, value: any) {
    return getProcessorProp(name, this.processors)?.setter?.(value)
  }
}
