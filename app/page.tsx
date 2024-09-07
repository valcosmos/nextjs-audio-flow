'use client'

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import type {
  Connection,
  Edge,
  Node,
} from '@xyflow/react'
import { connect, createAudioNode, disconnect, removeAudioNode } from '@/components/Audio'
import { OscillatorNode } from '@/components/OscillatorNode'
import { OutputNode } from '@/components/OutputNode'
import { VolumeNode } from '@/components/VolumeNode'
import '@xyflow/react/dist/style.css'

const initialNodes: Node[] = [
  // { id: '1', position: { x: 0, y: 0 }, data: { frequency: 300, type: 'square' }, type: 'osc' },
  // { id: '2', position: { x: 0, y: 300 }, data: { gain: 0.6 }, type: 'volume' },
  // { id: '3', position: { x: 0, y: 500 }, data: {}, type: 'out' }
  {
    id: 'a',
    type: 'osc',
    data: { frequency: 220, type: 'square' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'b',
    type: 'volume',
    data: { gain: 0.5 },
    position: { x: 150, y: 250 },
  },
  {
    id: 'c',
    type: 'out',
    data: {},
    position: { x: 350, y: 400 },
  },
]
// const initialEdges = [
//   { id: 'e1-2', source: '1', target: '2' },
//   { id: 'e2-3', source: '2', target: '3' }
// ]
const initialEdges: Edge[] = []

const nodeTypes = {
  osc: OscillatorNode,
  volume: VolumeNode,
  out: OutputNode,
}

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = (params: Connection) => {
    connect(params.source, params.target)
    setEdges(eds => addEdge(params, eds))
  }

  function addOscNode() {
    const id = Math.random().toString().slice(2, 8)
    const position = { x: 0, y: 0 }
    const type = 'osc'
    const data = { frequency: 400, type: 'sine' }

    setNodes([...nodes, { id, type, data, position }])
    createAudioNode(id, type, data)
  }

  function addVolumeNode() {
    const id = Math.random().toString().slice(2, 8)
    const data = { gain: 0.5 }
    const position = { x: 0, y: 0 }
    const type = 'volume'

    setNodes([...nodes, { id, type, data, position }])
    createAudioNode(id, type, data)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={(nodes) => {
          for (const { id } of nodes) {
            removeAudioNode(id)
          }
        }}
        onEdgesDelete={(edges) => {
          for (const item of edges) {
            const { source, target } = item
            disconnect(source, target)
          }
        }}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Lines} />
        <Panel className="space-x-4" position="top-right">
          <button type="button" className="p-1 rounded bg-white shadow" onClick={addOscNode}>
            添加振荡器节点
          </button>
          <button type="button" className="p-1 rounded bg-white shadow" onClick={addVolumeNode}>
            添加音量节点
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}
