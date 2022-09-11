import { fetchAudioBuffer } from './fetch'
import { getPeaks } from './peaks'

export async function drawBarChart(canvas: HTMLCanvasElement, color = '#364356', source: AudioBufferSourceNode | string, context: AudioContext | OfflineAudioContext) {
  const { width, height } = canvas

  const ctx = canvas.getContext('2d')!

  const audioBuffer = typeof source === 'string'
    ? await fetchAudioBuffer(source, context)
    : source.buffer!

  const { mergedPeaks: peaks } = getPeaks(audioBuffer, width)

  const pixelRatio = window.devicePixelRatio || 1

  const peakIndexScale = peaks.some((val) => val < 0) ? 2 : 1
  const length = peaks.length / peakIndexScale
  const scale = length / width
  const halfH = height / 2
  const halfPixel = 0.5 / pixelRatio

  const barWidth = 2
  const barMinHeight = 1
  const barHeight = 1
  const absmax = 1 / barHeight

  const bar = barWidth * pixelRatio
  const gap = Math.max(pixelRatio, ~~(bar / 2))
  const step = bar + gap

  ctx.clearRect(0, 0, width, height)

  for (let peakIndex = 0; peakIndex < peaks.length; peakIndex += step) {
    let peak = 0
    let peakIndexRange = Math.floor(peakIndex * scale) * peakIndexScale
    const peakIndexEnd = Math.floor((peakIndex + step) * scale) * peakIndexScale
    do {
      const newPeak = Math.abs(peaks[peakIndexRange])
      if (newPeak > peak) {
        peak = newPeak
      }
      peakIndexRange += peakIndexScale
    } while (peakIndexRange < peakIndexEnd)

    const h = Math.max(Math.round((peak / absmax) * halfH), barMinHeight)

    ctx.fillStyle = color
    ctx.fillRect(peakIndex + halfPixel, halfH - h, bar + halfPixel, h * 2)
  }
}

export function drawTimeDomainBarChart(canvas: HTMLCanvasElement, color = '#364356', analyser: AnalyserNode) {
  const { width, height } = canvas

  const ctx = canvas.getContext('2d')!

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  ctx.clearRect(0, 0, width, height);

  (function draw() {
    requestAnimationFrame(draw)

    analyser.getByteTimeDomainData(dataArray)

    const barWidth = (width / bufferLength) * 1.5

    ctx.clearRect(0, 0, width, height)

    for (let i = 0, x = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i]

      ctx.fillStyle = color
      ctx.fillRect(x, height - barHeight, barWidth, barHeight)

      x += barWidth + 1
    }
  })()
}
