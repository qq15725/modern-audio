import { audioBufferToWavBlob } from './wav'

export function createOfflineAudioContext(duration: number, numberOfChannels = 2, sampleRate = 44100) {
  return new OfflineAudioContext({
    length: (sampleRate * duration),
    numberOfChannels,
    sampleRate,
  })
}

export async function exportOfflineAudio(context: OfflineAudioContext): Promise<Blob> {
  return audioBufferToWavBlob(
    await context.startRendering(),
  )
}

export async function downloadOfflineAudio(context: OfflineAudioContext, filename = 'audio'): Promise<void> {
  const blob = await exportOfflineAudio(context)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = URL.createObjectURL(blob)
  a.download = `${ filename }.${ blob.type.split('/')[1] }`
  a.click()
}
