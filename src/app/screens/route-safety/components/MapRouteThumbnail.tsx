import { View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Line,
} from 'react-native-svg';

interface MapRouteThumbnailProps {
  svgPath: string;
  accentColor: string;
  width?: number;
  height?: number;
}

const VIEW_W = 280;
const VIEW_H = 160;

/** Dot-grid columns × rows */
const COLS = 9;
const ROWS = 6;

/** Generates a subtle grid of dots that mimics a map tile background. */
function GridDots() {
  const dots: { cx: number; cy: number }[] = [];
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      dots.push({
        cx: Math.round((col / (COLS - 1)) * VIEW_W),
        cy: Math.round((row / (ROWS - 1)) * VIEW_H),
      });
    }
  }
  return (
    <>
      {dots.map(({ cx, cy }) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.2} fill="rgba(255,255,255,0.09)" />
      ))}
    </>
  );
}

/** Faint "road grid" — a few horizontal and vertical lines. */
function RoadGrid() {
  return (
    <>
      {/* Horizontals */}
      <Line x1={0} y1={53} x2={VIEW_W} y2={53} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      <Line x1={0} y1={106} x2={VIEW_W} y2={106} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      {/* Verticals */}
      <Line x1={93} y1={0} x2={93} y2={VIEW_H} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      <Line x1={186} y1={0} x2={186} y2={VIEW_H} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
    </>
  );
}

export function MapRouteThumbnail({
  svgPath,
  accentColor,
  width = 120,
  height = 74,
}: MapRouteThumbnailProps) {
  const gradId = `rg-${accentColor.replace('#', '')}`;

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#0f1929',
      }}
    >
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <RadialGradient id={gradId} cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor={accentColor} stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#0f1929" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Background */}
        <Rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#0f1929" />
        <Rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={`url(#${gradId})`} />

        {/* Grid decorations */}
        <RoadGrid />
        <GridDots />

        {/* Route path — glow shadow pass */}
        <Path
          d={svgPath}
          stroke={accentColor}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.25}
        />
        {/* Route path — main line */}
        <Path
          d={svgPath}
          stroke={accentColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.95}
        />

        {/* Origin dot (bottom-left approx start) */}
        <Circle cx={25} cy={135} r={5} fill="#fff" opacity={0.9} />
        <Circle cx={25} cy={135} r={9} fill={accentColor} opacity={0.25} />

        {/* Destination dot (top-right approx end) */}
        <Circle cx={255} cy={28} r={6} fill={accentColor} />
        <Circle cx={255} cy={28} r={11} fill={accentColor} opacity={0.22} />
      </Svg>
    </View>
  );
}
