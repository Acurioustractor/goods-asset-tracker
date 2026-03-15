# Community Essential Goods Tracking Model

## Purpose

Build the simplest reliable model for tracking how essential goods move through community:

1. what is in community now
2. who bought or supplied it
3. how long it lasts
4. what fails and why
5. what gets repaired, replaced, or dumped
6. how much money leaks out through repeat procurement of low-life-cycle products

This model is designed for low-connectivity contexts and should work even when the only dependable interaction is a short support form on a phone.

## First Principles

- Track the product, not just the order.
- Capture lifecycle events once, at the moment of support or check-in.
- Use structured pick-lists before long text.
- Treat replacement and dumping as procurement signals, not just support incidents.
- Separate what we know from what we estimate.
- Keep the field model small enough that community members and support workers will actually use it.

## Core Product Lanes

Start with:

- beds
- mattresses
- washing machines
- refrigerators / freezers

These are the first four lanes because they combine:

- high spend
- high freight burden
- high failure / replacement risk
- direct health and household impact

## Core Entities

### 1. Asset

One physical product instance in community.

Current table:

- `assets`

Minimum useful fields:

- unique id
- product family
- community
- supply date
- last check-in date
- owner / household / site

### 2. Lifecycle Event

Any meaningful change in product condition or service state.

Use existing tables first:

- `tickets`
- `checkins`
- `alerts`

Do not wait for a new perfect schema before collecting real evidence.

### 3. Buyer / Supplier

Who procured, distributed, installed, or replaced the item.

This lives mainly in CivicGraph / Goods Workspace and should link back to:

- councils
- health services
- housing providers
- remote stores
- distributors
- procurement intermediaries

### 4. Community Need Context

The community-level baseline that lets us estimate installed base and replacement pressure.

Examples:

- population
- dwellings
- crowding
- remoteness
- service coverage
- local production capability

## Minimum Structured Lifecycle Fields

These are now the first structured fields to collect through support:

- `assetConditionStatus`
  - Good
  - Needs Repair
  - Damaged
  - Missing
  - Replaced

- `serviceability`
  - fully_usable
  - limited_use
  - unsafe
  - not_usable

- `failureCause`
  - wear
  - rust
  - mould
  - frame_damage
  - fabric_damage
  - electrical_fault
  - water_fault
  - freight_damage
  - unknown

- `outcomeWanted`
  - assessment
  - repair
  - replace
  - pickup
  - dispose

- `oldItemDisposition`
  - still_in_use
  - stored
  - awaiting_pickup
  - dumped
  - returned
  - unknown

- `safetyRisk`
  - yes / no

- `issueObservedAt`
  - optional date

## Why this model is reliable in hard internet conditions

- It does not require photos.
- It does not require a long narrative.
- It uses short selects that can be synced later.
- The free-text description stays available for context.
- The structured fields are enough to power lifecycle reporting even when the internet is weak.

## What we can estimate from this model

### Installed base estimate

Per community and product lane:

- current tracked assets
- inferred assets from procurement inflow
- inferred assets from households / facilities

### Failure pressure

- incident count
- affected asset count
- repair request rate
- replacement request rate
- safety-critical rate
- top failure causes

### Waste pressure

- dump / pickup signals
- disposal requests
- replacement without repair
- stale assets with no fresh check-in

### Procurement leakage

- repeat spend on low-life-cycle products
- freight-out + replacement burden
- proportion of spend leaving community

## What still needs external data

To move from “strong estimate” to “hard proof,” add:

- council waste audit data
- transfer station / landfill bulky waste counts
- remote housing replacement logs
- store/distributor replacement orders
- service contractor repair logs
- freight and reverse-logistics costs

## Product Strategy Use

This model should let Goods answer:

- where are beds and washers failing fastest?
- where is outside spend highest?
- where is dump pressure building?
- where would community-made products displace the most waste and repeat procurement?
- where should we build local production first?

## Reporting Outputs

The same model should power:

- community lifecycle scorecards
- replacement pressure dashboards
- procurement leakage estimates
- dump-risk maps
- buyer / capital / partner outreach briefs

## Principle for future changes

If a new field does not improve one of these outcomes, do not add it.

- better service response
- better lifecycle measurement
- better replacement / dump estimation
- better procurement strategy
- better community manufacturing case
