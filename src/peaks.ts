export function getPeaks(buffer: AudioBuffer, length: number, first = 0, last?: number) {
  first = first || 0
  last = last || length - 1

  const sampleSize = buffer.length / length
  const sampleStep = ~~(sampleSize / 10) || 1
  const channels = buffer.numberOfChannels

  const splitPeaks: number[][] = []
  const mergedPeaks: number[] = []

  for (let channel = 0; channel < channels; channel++) {
    splitPeaks[channel] = splitPeaks[channel] || []
    const peaks = splitPeaks[channel]
    const chan = buffer.getChannelData(channel)
    let i

    for (i = first; i <= last; i++) {
      const start = ~~(i * sampleSize)
      const end = ~~(start + sampleSize)

      let min = chan[start]
      let max = min

      for (let i = start; i < end; i += sampleStep) {
        const value = chan[i]
        if (value > max) max = value
        if (value < min) min = value
      }

      peaks[2 * i] = max
      peaks[2 * i + 1] = min

      if (channel === 0 || max > mergedPeaks[2 * i]) {
        mergedPeaks[2 * i] = max
      }

      if (channel === 0 || min < mergedPeaks[2 * i + 1]) {
        mergedPeaks[2 * i + 1] = min
      }
    }
  }

  return {
    splitPeaks,
    mergedPeaks,
  }
}
