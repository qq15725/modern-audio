export function audioBufferToWavBlob(buffer: AudioBuffer) {
  return new Blob([
    writeWavHeaders(
      toFloat32Array(buffer),
      buffer.sampleRate,
    ),
  ], { type: 'audio/wav' })
}

function toFloat32Array(input: AudioBuffer): Float32Array {
  const buffer = input.getChannelData(0)
  const length = buffer.length * 2
  const result = new Float32Array(length)

  let index = 0
  let inputIndex = 0

  while (index < length) {
    result[index++] = buffer[inputIndex]
    result[index++] = buffer[inputIndex]
    inputIndex++
  }
  return result
}

function writeWavHeaders(buffer: Float32Array, sampleRate: number): DataView {
  const arrayBuffer = new ArrayBuffer(44 + buffer.length * 2)
  const view = new DataView(arrayBuffer)
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 32 + buffer.length * 2, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 2, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 4, true)
  view.setUint16(32, 4, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, buffer.length * 2, true)
  return floatTo16BitPCM(view, buffer, 44)
}

function floatTo16BitPCM(dataview: DataView, buffer: Float32Array, offset: number): DataView {
  for (let i = 0; i < buffer.length; i++, offset += 2) {
    const tmp = Math.max(-1, Math.min(1, buffer[i]))
    dataview.setInt16(offset, tmp < 0 ? tmp * 0x8000 : tmp * 0x7FFF, true)
  }
  return dataview
}

function writeString(dataview: DataView, offset: number, header: string): void {
  for (let i = 0; i < header.length; i++) {
    dataview.setUint8(offset + i, header.charCodeAt(i))
  }
}
