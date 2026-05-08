# Pakkimjalki Kari Washing Machine

> Name given in Warumungu language by Elder Dianne Stokes. Community-tough industrial washing machines built on Speed Queen commercial chassis. Prototype stage; 5-11 deployed across communities. Register-interest only, not for direct sale.

## Why it matters

- The supply-side problem on washing machines is as bad as on beds. One Alice Springs provider sells $3M p.a. of machines that end up in dumps.
- Our machines are IoT-instrumented: telemetry feeds ACT's R&D program.
- Telemetry data enables fleet management, remote asset monitoring, anomaly detection.

## Fleet state

- 11 machines registered, all Tennant Creek.
- 1 with Particle coreid for live telemetry.
- 69 usage logs captured across 12 machine_ids.
- Real cycle data: Norm's House. 4 cycles, 0.98 kWh.
- Rollup cron every 6 hours.

## Related

- [[stretch-bed]]
- [[../communities/tennant-creek]]
- [[../impact/metrics-tracked]]

## Sources

- Canonical specs: `v2/src/lib/data/products.ts`
- Fleet tables: `assets`, `usage_logs`, `daily_machine_rollups` in v2 Supabase.
