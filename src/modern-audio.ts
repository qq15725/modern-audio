import { createAudio } from './audio'

import type { InternalAudio } from './types'

export class ModernAudio extends HTMLAudioElement {
  public source: { context: AudioContext } & InternalAudio & MediaElementAudioSourceNode

  constructor() {
    super()
    this.source = createAudio(this)
    this.setup()
  }

  public static install() {
    customElements.define('modern-audio', ModernAudio, { extends: 'audio' })
  }

  protected async setup() {
    this.setupListeners()
    for (let i = 0; i < this.attributes.length; i++) {
      const attribute = this.attributes.item(i)
      if (attribute) this.source.set(attribute.name, attribute.value)
    }
  }

  protected setupListeners() {
    this.addEventListener('play', () => this.source.context.resume())
  }
}
