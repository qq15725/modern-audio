import { createProcessors, getProp, resetProcessors, setupProcessors } from './processor'

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

  protected async setupConnections() {
    this.processors = await createProcessors(this.env)
    setupProcessors(this.processors)
  }

  protected resetConnections() {
    resetProcessors(this.processors)
    setupProcessors(this.processors)
  }

  protected setupListeners() {
    this.addEventListener('play', () => this.env.context.resume())
  }

  public get(name: string) {
    return getProp(name, this.processors)?.getter?.()
  }

  public set(name: string, value: any) {
    return getProp(name, this.processors)?.setter?.(value)
  }
}
