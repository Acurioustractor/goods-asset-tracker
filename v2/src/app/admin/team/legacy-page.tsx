import { getTeamMembers } from './actions';
import TeamManager from './team-manager';
import { advisoryBoard } from '@/lib/data/compendium';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function TeamPage() {
  const members = await getTeamMembers();
  return (
    <div className="space-y-10">
      <TeamManager members={members} />

      {/* Advisory Board from Compendium */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Advisory Board</h2>
          <p className="text-gray-500 text-sm mt-1">
            {advisoryBoard.length} members — sourced from compendium. Monthly check-ins.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advisoryBoard.map((m) => (
            <Card key={m.id}>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
                    {m.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{m.name}</h3>
                    <p className="text-xs text-gray-500">{m.organisation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{m.role}</Badge>
                </div>
                {m.email && (
                  <p className="text-xs text-gray-400 truncate">{m.email}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
