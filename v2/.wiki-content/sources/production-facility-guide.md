# Production Facility Guide

> Reviewable source page for the Stretch Bed production facility operations guide. It shows process maturity and the practical pathway to On-Country production.

## Source Control

| Field | Value |
|---|---|
| Source type | Local markdown operations guide |
| Canonical edit location | Internal production facility guide; this page is the reviewable source note |
| Web review URL | `/insiders/sources/production-facility-guide` |
| Best Notion home | Goods HQ / On Country Goods Production HQ |
| Drive home | Photos, diagrams, equipment images and PDFs |
| Owner | Production lead review |
| Status | review-needed |
| Sensitivity | internal |
| Last reviewed | 2026-05-02 |

## What It Contains

- Facility overview, site layout, equipment inventory and power constraints.
- Production flow: collection and sorting, shredding, tray preparation, heating, pressing, cooling, CNC cutting, edge finishing and assembly.
- Safety protocols, PPE, emergency contacts and shift procedures.
- Handover note template, troubleshooting and production tracking.
- Options for building the production system in Notion now and app/Supabase later.

## Reviewable Substance

This guide is one of the clearest pieces of operational proof. It shows that On-Country production is being translated into a process, not left as an aspiration.

| Production stage | What the guide covers | Why it matters |
|---|---|---|
| Plastic collection and sorting | Useable plastics, exclusion of unsafe materials and local feedstock thinking. | Circular economy claims depend on real material discipline. |
| Shredding | Granulator setup and preparation for sheet pressing. | Turns local waste into manufacturing input. |
| Tray preparation | Weighing and filling material for pressing. | Supports repeatability and quality control. |
| Heating and pressing | Temperature, pressure and sheet-forming process. | Converts shredded plastic into bed-component stock. |
| Cooling | Cooling press and handling process. | Prevents warping and quality failure. |
| CNC cutting | Cutting sheets into bed parts. | Connects the plant to repeatable product geometry. |
| Edge finishing | Routing and finishing parts. | Makes parts safer and easier to assemble. |
| Assembly | Bed parts combined with poles and canvas. | Shows how the plant produces the actual Stretch Bed system. |
| Shift and handover notes | Logs, issues, quality notes and next-shift context. | Moves knowledge out of founder heads. |

## Current Facts To Use Carefully

- The guide records a two-container production concept.
- It describes a shredding container and a production container.
- It includes safety, PPE and emergency thinking.
- It records HDPE and PP as acceptable material streams and excludes PVC.
- It includes batch/shift-style tracking and handover logic.

## Facts That Need Reconciliation

- Bed-per-sheet assumptions.
- Current beds-per-day or beds-per-week throughput.
- Current equipment status.
- Current CNC status and bottlenecks.
- Current material input per bed.
- Which photos and diagrams are approved for mentor use.

## What To Add Before External Review

- A simple process diagram.
- A photo board with captions.
- A red/yellow/green equipment status table.
- A current throughput table.
- A safety and training checklist.
- A production handover example with sensitive details removed.

## Connected Evidence

| System | Connection |
|---|---|
| Wiki pages | [[../products/plant-design]], [[../enterprise/06-process-and-technology]], [[../enterprise/05-strategic-planning-risk]] |
| Supabase | production_shifts, production_inventory, production_journal if/when production tracking is live |
| HighLevel | not a CRM source except for approved partner/facility follow-up |
| Procurement | proves local production capability, handover readiness and circular-economy supply |

## Human Review

- Add process photos and diagrams from Drive.
- Reconcile bed-per-sheet, equipment and throughput assumptions.
- Check whether current plant state matches the document before mentors rely on it.

## Related

- [[operations-handbook]]
- [[canonical-product-data]]
- [[../products/plant-design]]
