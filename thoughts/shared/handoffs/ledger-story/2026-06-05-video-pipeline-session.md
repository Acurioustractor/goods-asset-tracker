# Ledger video pipeline — session save 2026-06-05 (pre /clear)

State save before the next session: "how do we make these videos AT SCALE with Empathy Ledger + Premiere Pro etc."

## What exists right now

`output/ledger-video/` (all LOCAL DRAFTS, nothing published):
- **`karen-mykel-draft-v3.mp4` = THE CUT, 65.785s, Ben-reviewed iterations v1→v3.** Structure below.
- `karen-ledger-draft-v1.mp4` (40s, end card) and `karen-mykel-draft-v2.mp4` (51s) = superseded, keep for reference.
- `src/` = downloaded EL sources + `mykel-interview.mp4` + whisper JSON transcripts + contact sheets. `work/` = encoded segments (seg1..seg9, seg6m, seg7m) + concat lists + video tracks.

## v3 cut structure (exact, rebuildable in Premiere)

Video (all 1920x1080, 24000/1001 fps):
1. 0.0-4.8 Girls making (src ss 6, t 4.8) — Karen VO
2. 4.8-9.7 Boys making (ss 0.5, t 4.9) — Karen VO
3. 9.7-18.2 Karen on camera (Karen clip ss 9.7, t 8.5), lower-third "Karen Liddle / Traditional Owner · Oonchiumpa · Alice Springs"
4. 18.2-27.5 Utopia delivery b-roll (Beds putting together ss 19, t 9.3) — Karen VO "until we get accommodation"
5. 27.5-35.785 Karen on camera joy line (ss 27.5, t 8.285)
6. 35.785-44.785 Mykel interview ss 0 t 9 ("Wow, this is sick"), lower-third "Mykel / On the bed he built · Utopia homelands"
7. 44.785-55.785 Mykel interview ss 18 t 11 (production facility Q + "rocking up every day")
8. 55.785-60.285 Hoodie "From Nothing To Something" (Mykel overlay ss 38.5, t 4.5)
9. 60.285-65.785 Bedroom ending (overlay ss 75, t 5.5, video fade out st 4.3 d 1.2)

Audio: Karen clip audio 0-35.785 → interview audio (0-9, 18-29) → overlay ambient (38.5-43, fade-in 0.4) → ambient (75-80.5) + **blessing "Well done, grandson. Well done, brother." (interview atrim 75-78.5, adelay 0.9s, vol 1.4) mixed over the bedroom** → soft pad under everything (aevalsrc A-major sines 110/220/277.18/329.63 with 0.5Hz swell baked in, lowpass 600, vol 0.32, afade in 4s; amix normalize=0) → global afade out st 64 d 1.9.

**Ben's open edit choices:** blessing-over-bedroom is a constructed moment (keep/kill); pad is a synthesized PLACEHOLDER (swap for licensed or community-made track = value-back aligned); confirm Karen's final line by ear (whisper heard "itching", curated canon = "hits you").

## PUBLISH BLOCKERS

- Karen + Mykel EL media records: `consent_obtained: false`, `elder_review_status: unreviewed` despite Ben's 2026-06-02 voice clearance → consent BACKFILL needed (remap handoff tasks 3/5: `2026-06-05-story-remap-handoff.md`).
- Mykel's storyteller record (`3aa9a02a-c16a-4f50-b3e0-84ae42f99f73`, display_name "Mykel") has NO transcripts rows linked; his interview lives only as local video.

## The pipeline recipe (what scale-up systematises)

1. **Find** — EL `media_assets` by spine tags. Gotchas: column is `filename` NOT `file_name`; tag query MUST quote: `cultural_tags=cs.{"trip:may-2026"}` (unquoted = 22P02); dedupe rows (duplicates exist); 22 videos tagged trip:may-2026, participant:* tags work (karen, mykel, dorrie-jones, charley, clancy).
2. **Fetch** — public storage URL = `$EMPATHY_LEDGER_SUPABASE_URL/storage/v1/object/public/media/<file_path>` (env in `v2/.env.local`).
3. **Hear** — `/opt/homebrew/bin/whisper --model base` per clip → timestamped lines = the edit map. Karen's 36s take and Mykel's 89s interview both mapped this way.
4. **See** — ffmpeg contact sheets (`fps=1/N,scale=320:-1,tile=8x1`) → Read the image, pick windows.
5. **Cut** — uniform intermediates (libx264 crf18, 1080p, 24000/1001, -an), drawtext lower-thirds (Georgia.ttf at /System/Library/Fonts/Supplemental/), concat demuxer (paths in concat.txt are RELATIVE TO THE TXT), audio assembled separately in one filter_complex, mux -c:v copy.
6. **Local sources beyond EL**: `~/Pictures/Alice & Utopia Goods May 25/Exported Video/` (the trip export folder), `~/Downloads/AI Library/Videos/Mykel.mp4`, `~/Code/Oochiumpa/REAL INNOVATION DOCS/Recents/Mykel.mp4`. EL audio assets exist incl. interviews (Nigel.mp3, Laquisha.mp3, Kylie Interview.mp3, Shayne.mp3, Fred.wav, Uncle George.mp3, several null-filename rows needing names).

## NEXT SESSION: videos at scale (EL + Premiere Pro etc.)

Questions to work:
1. **EL as the edit backbone**: every clip whisper-transcribed at ingest, transcript + tags stored on the media_asset → "find me every cleared person saying X about Y" becomes a query. (Transcribe-at-ingest is the single highest-leverage piece.)
2. **Generate timelines, not videos**: from a spine query, emit FCPXML/EDL (timestamps like §v3 above) that opens IN Premiere/Resolve with clips + markers + lower-thirds pre-placed; human does the craft pass. The ffmpeg path stays for fast drafts; Premiere path for finals.
3. **Consent gates in the video pipeline**: same quarantine as ledger-story — only consent-cleared participants' clips enter a timeline; blocker list auto-generated.
4. **Template grammar**: v3's shape (voice spine → b-roll where the words point → on-camera heart → homecoming/proof → blessing) is a reusable TEMPLATE. One per unit type (weekly 45-70s, field-note hero, funder cut).
5. **The skill**: extend `.claude/skills/ledger-story/` with a video unit (or sibling `ledger-video` skill) encoding the recipe above.
6. Capture standards feed it: the pitch's per-person trip checklist (portrait, hands, country, 60-90s voice, on-camera consent, everyone-in-frame named).

## Resume prompt

> Read thoughts/shared/handoffs/ledger-story/2026-06-05-video-pipeline-session.md and design the at-scale video pipeline (EL + Premiere). Start from "NEXT SESSION" questions; v3 cut + pitch + skill already exist.

---

## DONE 2026-06-05 (later session): pipeline DESIGNED + tracer bullet built

All 6 questions answered in `wiki/outputs/2026-06-05-ledger-video-pipeline-design.md`. Built and validated:

- `output/ledger-video/karen-mykel-v3.cutspec.json`: the v3 cut as a declarative `ledger-cutspec/v1` (the new pivot format; per-source consent fields included).
- `.claude/skills/ledger-story/scripts/cutspec-to-xmeml.mjs`: cutspec → FCP7 XML emitter (xmeml is what Premiere actually imports; FCPXML is FCPX-only). Zero deps. Titles/fades/gains become markers (they do not survive interchange); auto PUBLISH BLOCKERS list + frame-0 marker from consent fields.
- `output/ledger-video/karen-mykel-draft-v3.xml`: generated, xmllint well-formed, 1577 frames = 65.785s exactly matches the rendered mp4. 9V + 6A clips on 3 tracks, 18 markers.
- `.claude/skills/ledger-story/VIDEO.md`: skill extension (video consent rules incl. everyone-in-frame, beat template grammar from the v3 shape, two render paths). SKILL.md links it.

**NEXT GATE: Ben imports `karen-mykel-draft-v3.xml` into Premiere (10 min)** and reports quirks; emitter gets fixed, not worked around. Then: EL transcribe-at-ingest (delta tasks in design §3.1, extends the remap handoff) → `el-find-clips.mjs` → `cutspec-to-ffmpeg.mjs` → first at-scale weekly video for a second cleared voice. Open Ben decisions in design §10 (blessing keep/kill, music sourcing, Karen's final line, whisper model size, skill-extension confirm).

---

## DONE 2026-06-05 (second later session): roadmap items 3 + 4 built

⚠️ Two sessions worked this handoff in overlapping minutes (16:08-16:13); no collisions, work converged. This session built the two scripts the first session's design doc listed as roadmap:

- `.claude/skills/ledger-story/scripts/el-find-clips.mjs` (roadmap §9.3): EL spine-tag query → `ledger-clipmanifest/v1` with per-source consent quarantine, in-frame people from `media_storytellers`, `--fetch` (download + ffprobe) and `--transcribe` (whisper) flags. Validated live: 22 trip:may-2026 videos, all flagged pending consent backfill (the blocker list is auto-generated, as designed); `participant:karen` returns exactly 1. Found during build: `depicted_people_text` is an array, not text.
- `.claude/skills/ledger-story/scripts/cutspec-to-ffmpeg.mjs` (roadmap §9.4): draft renderer reading the SAME cutspec as the xmeml emitter (v3 recipe automated). Validated by re-rendering the v3 cutspec: 65.86s vs 65.785s reference, lower-thirds verified on frames at 10s/40s. `--no-music` skips the placeholder pad; `--keep-work` keeps intermediates.
- VIDEO.md workflow + render-paths table updated to point at both scripts; design doc §7/§9 marked built.

Also this session (separate thread): the in-flight Utopia `content-moments` work (trip-story.tsx + trip-stories.ts + the 06-05 ledger update) committed as `6a75c5f` on `feat/utopia-content-moments` (worktree at /tmp/gw-content-moments, local only, awaiting Ben's push/PR verb).

**NEXT (unchanged): Ben's Premiere import gate (§9.1), EL transcribe-at-ingest deltas (§9.2, other repo), then the first at-scale weekly for a second cleared voice (§9.5).**

---

## DONE 2026-06-05 (third pass): HITL v2 plan, research-verified

Ben asked for the workflow/ultra-plan pass on Premiere integrations + the human-in-the-loop shape. Ran a 9-agent research workflow (4 lenses + adversarial verification). Synthesis: **`wiki/outputs/2026-06-05-el-premiere-hitl-plan.md`** (the v2 plan; supersedes nothing, layers on the v1 design).

Settled findings (sourced + verified, see plan §2):
- **No MCP shortcut into the Premiere timeline exists.** Official Adobe MCP = cloud/Express only; community Premiere MCPs are limited (adb-mcp, UXP+localhost proxy) or ExtendScript/CEP-backed and dying (CEP removed ~1yr after Nov 2025; ExtendScript EOL Sept 2026). **xmeml stays the backbone.** Future hooks worth knowing: UXP Transcript class (push/pull transcript JSON per clip), ExtendScript `Sequence.importMGT()` (MOGRT insertion; UXP equivalent unconfirmed).
- **Session MCPs contribute finishing aids only:** `media_enhance_speech` (3-stem voice cleanup), `video_resize` (social reframes of masters), Illustrator/Pencil (lower-third graphics). `video_create_quick_cut` is banned (visual-only black box, bypasses consent + transcript selection). All Adobe tools interactive-auth, never headless.
- **Draft==final look/loudness via shared FILES, not XML** (xmeml drops all color/audio, confirmed): `goods-look.cube` (ffmpeg lut3d + Premiere Creative LUTs folder, ONE adjustment layer) + `goods-look.prfpset` + 2 loudness-baked `.epr` exports (-14 LUFS YT/web, ~-11 social). Drafts approximate audio with loudnorm + sidechaincompress; Essential Sound/ducking is GUI-only (verified: zero audio endpoints in the UXP API).

Build order in plan §4. **Gate 0 unchanged: Ben imports `karen-mykel-draft-v3.xml` into Premiere.** Then: Ben grades the Karen clip once → exports the .cube (the look is made by a human ONCE, applied by machines forever); Claude builds emitter v2 `--selects` (bins + SELECTS stringout + first cut in one project import, one `<file id>` per source) + SRT + MOGRT CSV; LUT/loudnorm wired into cutspec-to-ffmpeg drafts.

---

## DONE 2026-06-05 (fourth pass): live-Premiere tiers + REVERSE CHANNEL built

Ben asked "can Claude work inside Premiere?" and approved the tiered recommendation. **Plan §6 added** (`2026-06-05-el-premiere-hitl-plan.md`): Tier A file round-trip (default; re-emitted v2 sequences import side by side for A/B), Tier B adb-mcp live co-editing pilot (UXP plugin + ws://localhost:3001 proxy; mechanical moves only, keep only if it beats XML import), Tier C Goods-owned UXP panel (only if B earns it). Adoption order: Gate 0 → 2-3 real videos on Tier A + reverse channel → pilot B.

**Packaging BUILT (fifth pass):** `make-video-package.mjs` = one command from finished cutspec → draft mp4 + Premiere XML + `<title>.package.md` (Ben's import steps, lower-third manifest, constructed-moments list, PUBLISH BLOCKERS, reverse-channel command). Validated on v3: draft 65.86s, XML 1577 frames, 6 blockers in the note. VIDEO.md step 6 now points at it. So Ben's loop per video = brief → watch draft → import one XML → craft pass → export XML back.

**Reverse channel BUILT + validated:** `.claude/skills/ledger-story/scripts/xmeml-to-cutspec.mjs` parses an FCP7 XML back to a `ledger-cutspec/v1` and `--diff`s against the emitted cutspec (the TASTE LOG). Validated two ways: (1) round trip of our own v3 XML = 9V+6A events, zero drift at 1-frame tolerance; (2) simulated craft pass (trim 2s off the interview bite, cut the hoodie shot, move the bedroom 2s earlier, add girls b-roll) = all four edits reported exactly. Consent in derived cutspecs is copied or flagged, never invented. Parser lanes clipitems by `sourcetrack` mediatype (xmeml nests `<video>`/`<audio>` inside file defs; section regexes truncate, learned the hard way). VIDEO.md workflow step 8 documents it. UNVERIFIED: a real Premiere export (extra structure: masterclips, labels, nested sequences as clipitems); confirm at the first craft pass, fix the parser from observed quirks.

---

## STATE AT /clear (2026-06-06) — READ THIS FIRST ON RESUME

**The pipeline is COMPLETE locally and waiting on Ben's Premiere gates.** Five sessions converged on 2026-06-05/06; everything below is built, validated, uncommitted in the working tree (output/ + .claude/skills/ + wiki/outputs/ are untracked or modified; nothing pushed).

### What exists (all validated)

**Skill scripts** (`.claude/skills/ledger-story/scripts/`):
- `el-find-clips.mjs` — EL spine-tag query → `ledger-clipmanifest/v1` (consent quarantine, in-frame people, `--fetch` + `--transcribe`)
- `cutspec-to-ffmpeg.mjs` — cutspec → review draft mp4
- `cutspec-to-xmeml.mjs` — cutspec → Premiere XML (FCP7 xmeml; lower-thirds/fades/gains = markers; auto blocker list)
- `xmeml-to-cutspec.mjs` — REVERSE channel: Ben's exported Final Cut XML → derived cutspec + `--diff` taste log (zero-drift round trip + 4-edit sim verified)
- `make-video-package.mjs` — ONE command: cutspec → draft + XML + `<title>.package.md` (Ben steps, lower-thirds, constructed moments, blockers). `--open` hands the XML to "Adobe Premiere Pro 2026" via macOS open event (untested against the app, that IS Gate 0).

**Contracts:** `ledger-cutspec/v1` (worked example `output/ledger-video/karen-mykel-v3.cutspec.json`) and `ledger-clipmanifest/v1`.
**Docs:** v1 design `wiki/outputs/2026-06-05-ledger-video-pipeline-design.md` · **HITL v2 plan `wiki/outputs/2026-06-05-el-premiere-hitl-plan.md`** (§1 the loop, §2 research verdicts, §4 build order, §6 live-Premiere tiers + reverse channel) · skill `VIDEO.md`.
**v3 package on disk:** `output/ledger-video/karen-mykel-draft-v3.{xml,package.md}` + `karen-mykel-draft-v3-draft.mp4` (fresh 65.86s render) + the original Ben-reviewed `karen-mykel-draft-v3.mp4`.

### Ben's gates (everything else queues behind these)

1. **GATE 0 — Premiere import test.** With Premiere open:
   `node .claude/skills/ledger-story/scripts/make-video-package.mjs output/ledger-video/karen-mykel-v3.cutspec.json --skip-draft --open`
   Report: (a) what Premiere did with the open event (imported / prompted / ignored), (b) do timeline, audio tracks, markers, linked media look right.
2. **The look:** grade the Karen clip in Premiere once → export `goods-look.cube` from Lumetri.
3. **Consent backfill in EL** (Karen+Mykel records; remap handoff tasks 3/5) — clears the v3 publish blockers.
4. **Open edit decisions:** blessing keep/kill · music sourcing (community-made preferred) · Karen's final line ("itching" vs "hits you") · whisper model size.

### Claude's queue (after Gate 0)

Emitter v2 `--selects` (bins per storyteller + SELECTS stringout + first cut, ONE `<file id>` per source) + SRT + MOGRT CSV → wire `goods-look.cube` + loudnorm/sidechaincompress into ffmpeg drafts → .prfpset/.epr kit docs → EL transcribe-at-ingest handoff deltas (HITL plan §3.1... see v1 design §3.1) → first at-scale weekly for a 2nd cleared voice → Tier B adb-mcp pilot only when the file loop is smooth.

### Resume prompt (paste into a fresh session)

> Read thoughts/shared/handoffs/ledger-story/2026-06-05-video-pipeline-session.md (the "STATE AT /clear 2026-06-06" section) and wiki/outputs/2026-06-05-el-premiere-hitl-plan.md. Continue the ledger video pipeline. My Gate 0 result: [what Premiere did with the XML].
