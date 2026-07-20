# Cost-model skins archive (2026-07-20)

The four aesthetic cost-model skins (mission-control, tesla, terminal, investment)
plus the skin-switcher workspace shell. Retired per Ben 2026-07-20: "they were
tests" — replaced by the single narrative cost-story page at /admin/cost-model.

The locked engine was NOT archived — it stays at `v2/src/lib/cost-model/`
(engine.ts + use-cost-model.ts + tests).

To restore: `git mv` the files back into `v2/src/app/admin/cost-model/` and
re-wire page.tsx to render `<CostModelWorkspace />` (see git history of
v2/src/app/admin/cost-model/page.tsx before this date).
