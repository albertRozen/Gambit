import styled, { useTheme } from 'styled-components'
import type { Resource } from '../../../models/resource.ts'
import { pluralize } from '../../../utils/pluralize.ts'
import { radialLayout, type PlacedNode } from '../graphLayout.ts'

const WIDTH = 640
const HEIGHT = 360
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 }
const ORBIT_RADIUS = 120
const APP_RADIUS = 48
const LINE_HEIGHT = 14
const NODE_RADIUS = 20
const LABEL_GAP = 10

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text

const wrapLabel = (text: string, maxLength: number): string[] => {
  const words = text.split(' ')
  let firstLine = ''
  while (
    words.length > 0 &&
    `${firstLine} ${words[0]}`.trim().length <= maxLength
  ) {
    firstLine = `${firstLine} ${words.shift()}`.trim()
  }
  if (!firstLine) {
    return [truncate(text, maxLength)]
  }
  const rest = words.join(' ')
  return rest ? [firstLine, truncate(rest, maxLength)] : [firstLine]
}

interface ApplicationGraphProps {
  name: string
  resources: Resource[]
}

export const ApplicationGraph = ({
  name,
  resources,
}: ApplicationGraphProps) => {
  const theme = useTheme()
  const nodes = radialLayout(resources.length, CENTER, ORBIT_RADIUS)
  const nameLines = wrapLabel(name, 12)
  const firstLineY = CENTER.y - (nameLines.length * LINE_HEIGHT) / 2

  return (
    <Frame>
      <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
        <title>{`${name} graph`}</title>
        <desc>
          {`${name} is connected to ${pluralize(resources.length, 'resource')}: ${resources.map((resource) => resource.name).join(', ')}.`}
        </desc>

        {nodes.map((node, index) => (
          <line
            key={resources[index].id}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={node.x}
            y2={node.y}
            stroke={theme.colors.borderStrong}
            strokeWidth={1.5}
          />
        ))}

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={APP_RADIUS}
          fill={theme.colors.primary}
        />
        {nameLines.map((line, index) => (
          <text
            key={index}
            x={CENTER.x}
            y={firstLineY + index * LINE_HEIGHT}
            textAnchor="middle"
            dominantBaseline="central"
            fill={theme.colors.onPrimary}
            fontSize={12}
            fontWeight={600}
          >
            {line}
          </text>
        ))}
        <text
          x={CENTER.x}
          y={firstLineY + nameLines.length * LINE_HEIGHT}
          textAnchor="middle"
          dominantBaseline="central"
          fill={theme.colors.onPrimaryMuted}
          fontSize={11}
        >
          {pluralize(resources.length, 'resource')}
        </text>

        {nodes.map((node, index) => (
          <ResourceNode
            key={resources[index].id}
            resource={resources[index]}
            node={node}
          />
        ))}
      </Svg>
    </Frame>
  )
}

const ResourceNode = ({
  resource,
  node,
}: {
  resource: Resource
  node: PlacedNode
}) => {
  const theme = useTheme()
  const tone = theme.criticality[resource.criticality]
  const cos = Math.cos(node.angle)
  const sin = Math.sin(node.angle)

  const labelX = node.x + cos * (NODE_RADIUS + LABEL_GAP)
  const labelY = node.y + sin * (NODE_RADIUS + LABEL_GAP)
  const textAnchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'
  const nameY = sin < -0.3 ? labelY - 14 : sin > 0.3 ? labelY + 10 : labelY - 3

  return (
    <g>
      <title>
        {`${resource.name}: ${resource.provider} ${resource.type}, ${resource.criticality}, ${pluralize(resource.openIssues, 'open issue')}`}
      </title>
      <circle
        cx={node.x}
        cy={node.y}
        r={NODE_RADIUS}
        fill={tone.bg}
        stroke={tone.ring}
        strokeWidth={1.5}
      />
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={tone.fg}
        fontSize={12}
        fontWeight={600}
      >
        {resource.openIssues}
      </text>
      <text
        x={labelX}
        y={nameY}
        textAnchor={textAnchor}
        fill={theme.colors.text}
        fontSize={12}
        fontWeight={500}
      >
        {truncate(resource.name, 24)}
      </text>
      <text
        x={labelX}
        y={nameY + 14}
        textAnchor={textAnchor}
        fill={theme.colors.textMuted}
        fontSize={11}
      >
        {`${resource.provider} · ${resource.type}`}
      </text>
    </g>
  )
}

const Frame = styled.div`
  position: relative;
  flex: 1;
  min-height: 50rem;

  @media ${({ theme }) => theme.media.narrow} {
    min-height: 80rem;
  }
`

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`
