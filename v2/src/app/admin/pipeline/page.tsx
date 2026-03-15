import { getPipelineData } from './actions';
import PipelineBoard from './pipeline-board';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const assets = await getPipelineData();
  return <PipelineBoard assets={assets} />;
}
