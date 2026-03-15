import { getTeamMembers } from './actions';
import TeamManager from './team-manager';

export default async function TeamPage() {
  const members = await getTeamMembers();
  return <TeamManager members={members} />;
}
