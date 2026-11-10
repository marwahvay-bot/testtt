import { scenes } from '../data/presentation-data';
import { sceneComponents } from './scenes';

export function SceneView({ index, stage, always = false, delay = 0.05 }: { index: number; stage: number; always?: boolean; delay?: number }) {
  const meta = scenes[index];
  const C = sceneComponents[meta.kind];
  return <C meta={meta} stage={stage} always={always} jump={false} delay={delay} />;
}
