let context: AudioContext | null = null
const nodes = new Map<string, AudioNode>()

if (typeof window !== 'undefined') {
  // 仅在客户端环境中初始化 AudioContext
  context = new (window.AudioContext || (window as any).webkitAudioContext)()

  const osc = context.createOscillator()
  osc.frequency.value = 220
  osc.type = 'square'
  osc.start()

  const volume = context.createGain()
  volume.gain.value = 0.5

  const out = context.destination

  // 建立默认的音频节点连接
  osc.connect(volume)
  volume.connect(out)

  nodes.set('a', osc)
  nodes.set('b', volume)
  nodes.set('c', out)
}

export function isRunning() {
  return context?.state === 'running'
}

export function toggleAudio() {
  if (!context)
    return
  return isRunning() ? context.suspend() : context.resume()
}

export function updateAudioNode(id: string, data: Record<string, any>) {
  const node = nodes.get(id)
  if (!node)
    return

  for (const [key, val] of Object.entries(data)) {
    if ((node as any)[key] instanceof AudioParam) {
      ;(node as any)[key].value = val
    }
    else {
      ;(node as any)[key] = val
    }
  }
}

export function removeAudioNode(id: string) {
  const node = nodes.get(id)
  if (!node)
    return

  node.disconnect()
  if (node instanceof OscillatorNode)
    node.stop()
  nodes.delete(id)
}

export function connect(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId)
  const target = nodes.get(targetId)
  if (source && target)
    source.connect(target)
}

export function disconnect(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId)
  const target = nodes.get(targetId)
  if (source && target)
    source.disconnect(target)
}

export function createAudioNode(id: string, type: string, data: Record<string, any>) {
  if (!context)
    return

  switch (type) {
    case 'osc': {
      const node = context.createOscillator()
      node.frequency.value = data.frequency
      node.type = data.type
      node.start()

      nodes.set(id, node)
      break
    }

    case 'volume': {
      const node = context.createGain()
      node.gain.value = data.gain

      nodes.set(id, node)
      break
    }
    default:
      break
  }
}
