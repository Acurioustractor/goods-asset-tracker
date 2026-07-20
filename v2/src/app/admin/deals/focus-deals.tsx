import { getChecklistState } from './actions';
import { ChecklistSteps, type Step } from './checklist-steps';

// Migrated from /admin/deal-room on 2026-05-16. Two named workstreams that unlock the
// largest portion of the FY26-27 capital stack. Step definitions intentionally hard-coded
// here — they're a snapshot of the live plan, not user-generated content.

const GROOTE_STEPS: Step[] = [
  { action: 'Connect with Simone Grimmond at WHSAC', owner: 'Nic', when: 'This week', urgent: true },
  { action: 'Build proposal: 500 beds + 300 washers + freight comparison', owner: 'Nic/Ben', when: 'Next week', urgent: true },
  { action: 'Site visit to Groote — logistics, community needs', owner: 'Nic', when: 'April', urgent: false },
  { action: 'Identify funding pathway — self-fund or grant co-fund?', owner: 'Nic', when: 'April', urgent: false },
  { action: 'Connect to Townsville plant via REAL Fund', owner: 'Nic', when: 'May', urgent: false },
  { action: 'Draft MOU / purchase agreement', owner: 'Nic', when: 'June', urgent: false },
];

const REAL_STEPS: Step[] = [
  { action: 'Follow up with DEWR on EOI status', owner: 'Nic', when: 'This week', urgent: true },
  { action: 'Prepare full application (if EOI progresses)', owner: 'Nic/Ben', when: 'April', urgent: true },
  { action: 'Letters of support from Oonchiumpa + PICC', owner: 'Nic', when: 'April', urgent: false },
  { action: 'Include Groote demand data ($1.7M) in application', owner: 'Ben', when: 'April', urgent: false },
  { action: 'Confirm production economics with Defy', owner: 'Sam', when: 'April', urgent: false },
  { action: 'Detailed budget: $1.2M × 4yr per site', owner: 'Ben', when: 'May', urgent: false },
];

export async function FocusDeals() {
  const state = await getChecklistState();

  return (
    <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b bg-gradient-to-br from-primary/10 to-accent/10">
        <p className="font-display text-lg font-bold">Focus workstreams</p>
        <p className="text-xs text-muted-foreground">
          The two named deals that unlock the most of the FY26-27 stack — REAL Fund ($2.4M, plants) and Groote ($1.7M, 800 units).
          Tick boxes update server-side immediately.
        </p>
      </div>
      <div className="p-5 grid gap-4 md:grid-cols-2">
        <ChecklistSteps
          steps={REAL_STEPS}
          prefix="real"
          initialState={state}
          accentColor="blue"
        />
        <ChecklistSteps
          steps={GROOTE_STEPS}
          prefix="groote"
          initialState={state}
          accentColor="orange"
        />
      </div>
    </section>
  );
}
