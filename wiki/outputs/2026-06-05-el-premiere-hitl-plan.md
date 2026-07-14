# EL → Claude → Premiere: the human-in-the-loop pipeline plan (v2)

Date: 2026-06-05. Builds on `2026-06-05-ledger-video-pipeline-design.md` (v1, the cutspec/xmeml backbone). Source: 9-agent research workflow (4 lenses + adversarial verification of web claims), full result in the session transcript. Confidence labels per the verification pass; every capability claim below carried a source.

## 1. The loop, formalized (who does what)

```
BEN                          CLAUDE                              BEN
capture to standards    →    FIND: el-find-clips.mjs        →    review draft mp4,
upload to EL,                (spine tags, consent                give notes
tag spine + people           quarantine, manifest)               ↓ (iterate, cheap)
in frame, consent       →    FIRST CUT: contact sheets +    →    CRAFT PASS in Premiere:
records                      whisper → cutspec →                 look preset, Essential
↓                            ffmpeg draft mp4                    Sound, lower-thirds,
direct the brief        →    PREMIERE PACKAGE: xmeml             music, export preset
("weekly post from X")       (bins + selects + first cut)        ↓
                             + SRT + MOGRT CSV +                 PUBLISH (Ben's verb,
                             blocker list                        blockers must be empty)
```

Iteration happens at the cutspec level (cheap, declarative, diffable). Premiere is entered once, near the end, with everything pre-placed. Consent is computed at FIND, carried as data, surfaced at emit; the only thing that flips a flag is Ben backfilling EL or clearing someone by name in conversation.

## 2. What the research settled (the three big answers)

### 2.1 There is no MCP shortcut into the Premiere timeline. The xmeml backbone stands.

- **The official Adobe MCP (Adobe for Creativity in Claude) cannot touch the desktop Premiere timeline.** It is cloud/Express-layer only: no timeline editing, no cuts, no grading. Verified, and confirmed locally: zero Premiere-specific tools in this session's tool list.
- **Community Premiere MCPs exist but are the wrong foundation.** adb-mcp (Mike Chambers, ~620 stars) drives a RUNNING Premiere via a UXP plugin + localhost WebSocket proxy, works on Apple Silicon, but is admittedly limited and single-sequence. The bigger ones (269 and 1,027 tools) are ExtendScript/CEP-backed, and Adobe has published the EOL clock: CEP removed about a year after Premiere 25.6 (Nov 2025), ExtendScript supported only through Sept 2026. Anything built on them rots within a year.
- **FCP7 XML (xmeml) import is the durable, deterministic path**: Premiere natively creates bins, multiple sequences, and plain markers from one file import. Confirmed losses: effects, transitions, marker colors, audio levels, and any LUT/Lumetri/filter reference do NOT survive. Our v1 emitter already scopes to exactly what survives.
- Corrections from the adversarial pass worth keeping: a documented CLI script-execution path into Premiere DOES exist (ExtendScript, officially "not recommended", fragile, and dying Sept 2026), and the new UXP API has a documented **Transcript class** (import/export transcript JSON per clip) and ExtendScript has **Sequence.importMGT()** (programmatic MOGRT insertion). So a future UXP layer could push EL transcripts INTO Premiere clips and auto-insert lower-third templates. That is a later enhancement, not the backbone.

**Decision: cutspec → xmeml stays the timeline-delivery contract. Any live-Premiere automation, if ever, is a thin UXP trigger (open project, import XML) on the adb-mcp pattern, never the timeline builder. Nothing ExtendScript/CEP-based gets built.**

### 2.2 What this session's MCPs actually contribute (small but real)

| Tool | What it does | Pipeline use |
|---|---|---|
| `media_enhance_speech` | 3-stem separation (clean speech / background / reverb) | voice cleanup before edit; prototype on one clip, verify stems pull to local disk |
| `media_summarize` | prose summary of spoken content | clip triage aid only (not timecoded; cannot drive a cutspec) |
| `video_resize` | reframe a finished master | social aspect variants AFTER the final edit |
| `video_create_quick_cut` | black-box visual highlight reel | DO NOT USE: visual-only selection contradicts the consent-gated, transcript-driven design |
| Illustrator / Pencil (local) | SVG/PNG export | lower-third and title-card brand graphics |

All Adobe tools need interactive auth + init (unusable headless), and asset upload is a UI picker. They are Ben-present finishing aids, not pipeline stages.

### 2.3 Draft and final can share one look and one loudness, via files not XML

Confirmed: xmeml carries no color or audio treatment, so parity comes from shared preset FILES applied on both sides.

**The finishing kit (4 files + 1 install), the minimal one-click pass:**

1. `goods-look.cube`: ONE LUT used by ffmpeg drafts (`-vf lut3d`) AND Premiere (installed at `~/Library/Application Support/Adobe/Common/LUTs/Creative/`, applied as Lumetri Creative > Look on ONE adjustment layer over the whole sequence, never per-clip). Per-clip white balance sits underneath (Auto Color now; the new Color Mode, in beta with GA later in 2026, as the per-source normalizer when it lands. Note: Color Mode is a manual grading workspace, not an AI feature).
2. `goods-look.prfpset`: the full Lumetri stack as a shareable preset (carries the LUT reference plus the adjustments around it).
3. `Goods-YouTube-14LUFS.epr`: export preset, loudness normalization baked in (ITU BS.1770-3, -14 LUFS / -1 dBTP for YouTube/web).
4. `Goods-Social-11LUFS.epr`: same at about -11 LUFS for Reels/TikTok.

ffmpeg drafts approximate the audio finish with `loudnorm` (I=-14:TP=-1, or -11 variant) + `sidechaincompress` for ducking, so the draft sounds close to the final. Essential Sound and auto-ducking are GUI-only (verified against the full UXP API surface: no audio endpoints exist), so the real ducking pass stays Ben's.

**How the LUT gets made (the right HITL division): Ben grades the v3 Karen clip in Premiere once, to taste, and exports the .cube from Lumetri. Machines then apply that look everywhere, forever, in both renderers.**

## 3. What the emitter grows into (v2)

From the EL-ingest design lens, the v2 emitter adds a `--selects` mode emitting a full PROJECT import, one file, three views of the same media:

```
<xmeml version="4"><project><name>…</name><children>
  <bin>SELECTS · Karen … candidate clips …</bin>
  <bin>SELECTS · Mykel …</bin>
  <sequence>SELECTS stringout (all candidates back to back, marker per clip)</sequence>
  <sequence>first cut (the cutspec timeline, v1 behaviour)</sequence>
</children></project></xmeml>
```

Rules that matter: one `<file id>` per source defined once and referenced everywhere (duplicated file blocks make Premiere spawn N offline copies of one clip: the relink nightmare); cutspec paths stay RELATIVE (git-diffable), resolved to %20-encoded absolute `file://` pathurls only at emit, with a `--media-root` override. Plus: emit an SRT caption track from the cutspec timings (SRT import is documented) and a CSV per MOGRT for data-driven lower-thirds (MOGRTs eat CSV/TSV, not JSON; insertion itself stays manual until a UXP route is proven).

Bin/multi-sequence import fidelity is the lowest-confidence piece (sourced from fcp.cafe + DTD knowledge, Adobe's own import doc would not fetch). It gets BUILT then TESTED in Premiere, and the emitter gets fixed from observed quirks.

## 4. Build order

| # | Item | Owner | Status |
|---|---|---|---|
| 0 | **GATE: import `output/ledger-video/karen-mykel-draft-v3.xml` into Premiere, report quirks** (clip times, audio tracks, markers, relink) | Ben, 10 min | open, blocks 2 |
| 1 | Grade the Karen clip once in Premiere, export `goods-look.cube` | Ben, 20 min | open |
| 2 | Emitter v2: `--selects` project mode + SRT + MOGRT CSV + `--media-root` | Claude | ready to build after 0 |
| 3 | Wire LUT + loudnorm + sidechaincompress into `cutspec-to-ffmpeg.mjs` drafts | Claude | after 1 |
| 4 | Build .prfpset + 2 .epr presets in Premiere (save dialogs), document install | Ben + Claude doc | after 1 |
| 5 | Project folder convention: `output/ledger-video/<project>/{src,work,out}` + manifest/sidecars at root | Claude | anytime |
| 6 | EL-instance handoff additions: confirm transcripts table shape + media_storytellers columns; transcribe-at-ingest job; consent backfill (existing tasks 3/5) | EL instance + Ben | extends remap handoff |
| 7 | First full-loop run: second cleared voice, brief → manifest → cutspec → draft → package → craft pass | both | the proof |
| 8 | Reverse channel: `xmeml-to-cutspec.mjs` parses Ben's exported Final Cut XML back to a cutspec and `--diff`s it against the emitted one (taste log, archive) | Claude | built; Premiere-export fidelity confirmed at the first real craft pass |
| 8b | `make-video-package.mjs`: one command from finished cutspec to draft mp4 + Premiere XML + package note (Ben's steps, lower-thirds, blockers) | Claude | built, validated on v3 |
| 9 | Tier B pilot: adb-mcp live co-editing session (see §6); thin UXP trigger / Transcript push / MOGRT insertion only if the pilot earns it | both | after 7 |

Explicitly NOT building: anything on ExtendScript/CEP (EOL), `video_create_quick_cut` first cuts (bypasses consent + transcript selection), official-Adobe-MCP timeline control (does not exist), auto-publish of any kind.

## 5. Capture standards (unchanged from v1 design, now load-bearing)

Per person, per trip: portrait + hands + country, 60-90s voice piece, on-camera consent moment, everyone-in-frame named at capture, 30s room tone per location, lower-third details confirmed on camera. Every one of these now has a pipeline stage that consumes it directly.

## 6. Working inside Premiere: three tiers and the reverse channel

Can Claude work inside a live Premiere session? Yes, with real limits. The mechanism (the adb-mcp pattern, proven on Apple Silicon) is a chain into the running app:

```
Claude Code ←→ MCP server ←→ local proxy (ws://localhost:3001) ←→ UXP plugin loaded IN Premiere
```

Through it Claude can import media, place and trim clips on the open timeline, add markers, apply transitions, read the sequence state ("what is selected?"), and trigger exports, all visible live and undoable with Premiere's normal undo stack. It cannot touch Essential Sound or ducking (the UXP API has zero audio endpoints, verified), cannot see edits happen in real time (state is read on request), and MOGRT insertion via UXP is unconfirmed. The community plugin assumes a single sequence and is experimental.

### Tier A: file round-trip (now, the default)

Claude emits the XML, Ben imports. Iteration trick: notes produce a re-emitted v2 SEQUENCE imported into the same open project; xmeml import adds rather than overwrites, so v3 and v4 sit side by side in the bin for A/B on the timeline. No live connection, nothing fragile.

### Tier B: live co-editing pilot (after Gate 0, one session to evaluate)

Setup once: Premiere 25.6+, load the adb-mcp UXP plugin via UXP Developer Tools, run the local proxy, register the MCP server with Claude Code. Then a session is conversational: "swap the b-roll under Karen's accommodation line", "add 2 seconds to the hoodie shot", executed in the open timeline while Ben watches. Claude takes the mechanical moves and batch work; Ben keeps hands on the craft. Decision rule: keep it only if live placement clearly beats importing a fresh XML, because the setup friction is real.

### Tier C: the Goods panel (only if B proves out)

A thin Goods-owned UXP plugin with exactly the commands the pipeline needs: pull latest cut from the cutspec, place all selects from the manifest, markers from the EL transcript, export with the Goods preset.

### The reverse channel (file-based, available now)

After the craft pass, Ben exports the edited sequence as Final Cut Pro XML (File > Export > Final Cut Pro XML). `xmeml-to-cutspec.mjs` parses it back to a cutspec and diffs it against the one Claude emitted: every trim, reorder, cut, and addition becomes visible. Two wins: the FINAL cut is archived as a rebuildable cutspec (not just an mp4), and the diff is a taste log; first cuts get closer to Ben's final each time because the finishing pass stops being invisible. Caveat held honestly: the parser is validated against our own emitted XML (zero-drift round trip); Premiere's exported XML carries extra structure, and fidelity against a real export is confirmed at the first craft pass.

### Adoption order (the agreed recommendation)

Gate 0 → first 2-3 real videos on Tier A + the reverse channel → pilot Tier B once the file loop feels smooth → Tier C only if the pilot earns it.

## 7. Sources of record

- Research workflow result: 4 lenses, 9 agents; key sources: github.com/mikechambers/adb-mcp, developer.adobe.com/premiere-pro/uxp (incl. Transcript class), ppro-scripting.docsforadobe.dev (CLI execution, importMGT, Sept 2026 EOL), fcp.cafe FCPXML case studies, helpx.adobe.com (LUT install paths, loudness normalization, data-driven MOGRTs, auto-ducking), provideocoalition.com (Color Mode, watch folders).
- v1 design: `wiki/outputs/2026-06-05-ledger-video-pipeline-design.md`
- Skill: `.claude/skills/ledger-story/VIDEO.md` + scripts (el-find-clips, cutspec-to-xmeml, cutspec-to-ffmpeg)
- Consent: `.claude/skills/ledger-story/CONSENT.md` (unchanged, still the gate)
