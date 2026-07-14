# Ledger video pipeline: at-scale design (EL + Premiere)

Date: 2026-06-05. Status: designed, tracer bullet built and validated locally. Premiere import not yet verified (Ben's step, see §9).

Answers the six "NEXT SESSION" questions in `thoughts/shared/handoffs/ledger-story/2026-06-05-video-pipeline-session.md`. The v3 Karen + Mykel cut (`output/ledger-video/karen-mykel-draft-v3.mp4`, Ben-reviewed) is the reference artifact the whole design generalises from.

## 1. The one-sentence design

Empathy Ledger becomes the edit backbone (every clip transcribed and spine-tagged at ingest), Claude assembles consent-gated **cutspecs** (declarative timelines) from template beats, machines render fast ffmpeg drafts, and finals open as pre-built timelines in Premiere where a human does the craft pass.

## 2. Principles

1. **Generate timelines, not videos.** The machine's job is selection, sequencing, and evidence (transcripts, consent, markers). Grade, titles, music, and feel are human work in Premiere.
2. **Consent is structural, not editorial.** The same gate as the ledger-story skill, enforced in the data (cutspec consent fields) and at emit time (auto blocker list, frame-0 marker). A timeline with blockers is a draft, no exceptions.
3. **One spine.** The same vocabulary as photos and quotes: storyteller, place, product, theme, kind, plus trip and participant tags. Video adds transcripts and in-frame people.
4. **Drafts are cheap, finals are crafted.** ffmpeg path for iteration speed (v1 to v3 took one session), Premiere path for anything that ships.

## 3. Architecture: five stages

```
INGEST (EL side)          FIND (query)            ASSEMBLE                RENDER                  REVIEW / PUBLISH
upload to EL              spine-tag +             template beats     →    ffmpeg draft mp4        Ben craft pass in
→ whisper transcript      transcript-text         filled from cleared     (iteration)             Premiere → consent
→ spine tags              query, consent-         clips → cutspec    →    xmeml timeline          blockers cleared →
→ media_storytellers      filtered clip list      JSON                    (Premiere/Resolve)      publish (Ben's verb)
→ consent fields
```

### 3.1 INGEST: EL as the edit backbone

Transcribe-at-ingest is the single highest-leverage piece. Requirements for the EL side (schema decisions belong to the EL instance + Ben, not this doc):

- Every video/audio `media_asset` gets a whisper transcription at ingest; timestamped segments retrievable by media asset id. Mykel's interview currently exists only as a local file with no EL transcript rows; that is the gap pattern to close.
- Transcript text is full-text searchable, scoped by project and consent state.
- `media_storytellers` lists EVERYONE in frame, not just a primary storyteller. This already caused a real error (2026-06-05: a pitch mock paired Katrina Bloomfield's voice with a photo of the old men at Utopia).
- Consent fields (`consent_obtained`, `elder_review_status`) are the authoritative gate the queries filter on.

These extend the existing remap handoff (`2026-06-05-story-remap-handoff.md`, tasks 3/5). Delta tasks for the EL instance:

1. Transcribe-at-ingest job (whisper runs locally or on a worker, not in an edge function; model size is an open decision, §10).
2. Backfill transcripts for the 22 trip:may-2026 videos plus the EL audio interviews (Nigel.mp3, Laquisha.mp3, Kylie Interview.mp3, Shayne.mp3, Fred.wav, Uncle George.mp3, and the null-filename rows that first need names).
3. In-frame people tagging pass (Ben names faces, the instance records them).

The target query this enables: "every cleared person saying something about ownership, on country, tagged stretch-bed" returns clips + timestamped lines + consent proof in one result.

### 3.2 FIND: query primitives and known gotchas

- Column is `filename` NOT `file_name`.
- Tag queries MUST quote: `cultural_tags=cs.{"trip:may-2026"}` (unquoted = 22P02 error).
- Duplicate rows exist; dedupe.
- Public storage URL: `$EMPATHY_LEDGER_SUPABASE_URL/storage/v1/object/public/media/<file_path>` (env in `v2/.env.local`).
- `participant:*` tags work (karen, mykel, dorrie-jones, charley, clancy).
- NEVER the Supabase MCP (wrong project). Read-only SELECT via curl/psql with keys from `v2/.env.local`.

Local sources beyond EL (until pushed): `~/Pictures/Alice & Utopia Goods May 25/Exported Video/`, `~/Downloads/AI Library/Videos/Mykel.mp4`, `~/Code/Oochiumpa/REAL INNOVATION DOCS/Recents/Mykel.mp4`.

### 3.3 ASSEMBLE: template grammar → cutspec

The v3 shape is the reusable template: voice spine → b-roll where the words point → on-camera heart → homecoming/proof → blessing. Encoded as named beats in `.claude/skills/ledger-story/VIDEO.md` (open-broll-voice-spine, on-camera-heart, broll-where-words-point, on-camera-joy, second-voice-proof, homecoming-detail, ending-blessing), with unit targets: weekly 45-70s, field-note hero 90-120s, funder cut 2-3min with canon-number title cards.

Each beat is a query (spine tags + transcript text) plus a craft note. Assembly = fill beats from the cleared clip list, write the cutspec.

### 3.4 RENDER: two paths from one cutspec

**ffmpeg draft recipe** (proven on v1 to v3): uniform intermediates (libx264 crf18, 1080p, 24000/1001, -an), drawtext lower-thirds (Georgia.ttf at /System/Library/Fonts/Supplemental/), concat demuxer (paths in concat.txt are RELATIVE TO THE TXT), audio assembled separately in one filter_complex, mux -c:v copy. Contact sheets for shot picking: `fps=1/N,scale=320:-1,tile=8x1`.

**Premiere path**: `node .claude/skills/ledger-story/scripts/cutspec-to-xmeml.mjs <cutspec> [-o out.xml]` emits FCP7 XML, then File > Import in Premiere.

Interchange format decision:

| Format | Verdict | Why |
|---|---|---|
| FCPXML | no | Final Cut Pro X only; Premiere cannot import it |
| EDL | no | single video track, loses markers, multi-track audio, notes |
| OpenTimelineIO | later | the right long-term answer, but adds a Python dependency and adapter maturity varies; revisit if the pipeline outgrows xmeml |
| **xmeml v4 (FCP7 XML)** | **chosen** | Premiere AND Resolve import it, hand-rollable with zero dependencies, carries multi-track audio + markers |

Known interchange losses, by design: titles, fades, gains, and speed ramps do not survive xmeml into Premiere reliably. The emitter converts all of them to sequence markers (LOWER THIRD / FADE / GAIN / NOTE) so the craft pass has the full intent on the timeline without trusting lossy translation.

### 3.5 REVIEW / PUBLISH

Ben imports the XML, relinks if needed (paths are absolute file:// URLs so relink should be rare), drops the brand lower-third template on the LOWER THIRD markers, applies fades/gains per markers, replaces placeholder music, grades. Publish requires: blocker list empty (consent backfilled in EL), Ben's explicit verb. The skill never publishes.

## 4. The cutspec contract (`ledger-cutspec/v1`)

The cutspec is the pivot of the whole pipeline: one declarative JSON both renderers read, diffable, committable, and rebuildable months later. Worked example: `output/ledger-video/karen-mykel-v3.cutspec.json` (the exact v3 cut).

| Field | Meaning |
|---|---|
| `spec` | `ledger-cutspec/v1` |
| `title`, `unit` | sequence name; weekly / field-note / funder |
| `sequence` | width, height, fps as a rational string ("24000/1001"), audioRate |
| `sources.<key>` | path (relative to the cutspec file), el_media_asset_id, probed duration/width/height, `in_frame[]` (everyone visible), `consent{status, provenance, el_backed, el_note}` |
| `video[]` | src, `in` (source seconds), `dur`, `at` (timeline seconds), beat, note, optional lowerThird{name, detail}, optional fadeOut{start, dur} (clip-relative) |
| `audio[]` | same timing fields plus track number, role (voice/ambient), optional fadeIn, gain, note |
| `music` | placeholder flag + sourcing note (never auto-shipped) |
| `globalAudioFadeOut` | start, dur in timeline seconds |

Conventions: all times in seconds (the emitter does frame math per the sequence fps); consent status is `cleared` or `flag`, nothing else; constructed moments (audio placed over picture it did not happen with) get a note saying so.

## 5. Consent gates (video-specific)

On top of the ledger-story CONSENT.md gate:

1. Everyone in frame counts; missing `media_storytellers` data = flag, not a pass.
2. Voice and face are separate clearances.
3. Constructed moments are flagged for keep/kill (v3's blessing-over-bedroom is the canonical example).
4. The emitter auto-generates the PUBLISH BLOCKERS list from cutspec consent fields and stamps a frame-0 marker. v3's current blockers: Karen + Mykel EL consent backfill pending despite Ben's 2026-06-02 voice clearance; unnamed faces in girls/boys/delivery b-roll and bedroom scenes.

## 6. Capture standards (feed the pipeline at the source)

Per person, per trip (from the pitch checklist, now with pipeline reasons attached):

- Portrait + hands + country (photo spine)
- 60-90s voice piece (the weekly video spine; Karen's 36s take was barely enough)
- On-camera consent moment (becomes the EL consent record evidence)
- Everyone-in-frame named at capture (kills the in-frame tagging backfill)
- Room tone / ambient 30s per location (audio beds without synthesis)
- Lower-third details confirmed on camera (name spelling, role, community)

## 7. The skill

Extension, not a sibling: `.claude/skills/ledger-story/VIDEO.md` (same consent gate, same brand rules, same handoff shape, one skill to maintain). Scripts live in the skill: `cutspec-to-xmeml.mjs`, `el-find-clips.mjs`, and `cutspec-to-ffmpeg.mjs` (all three built, see §9).

## 8. What was built this session (tracer bullet)

1. `output/ledger-video/karen-mykel-v3.cutspec.json`: the Ben-approved v3 cut expressed declaratively, with honest consent state per source.
2. `.claude/skills/ledger-story/scripts/cutspec-to-xmeml.mjs`: cutspec → xmeml emitter, zero dependencies.
3. `output/ledger-video/karen-mykel-draft-v3.xml`: generated timeline. Verified: xmllint well-formed, 1577 frames = 65.785s (matches the rendered v3 mp4 exactly), 9 video clips, 6 audio clips on 3 tracks, 18 markers, 2 lower-thirds, 6 blockers listed.
4. `.claude/skills/ledger-story/VIDEO.md`: the video unit of the skill (consent rules, workflow, template grammar, audio grammar).

NOT verified: actual Premiere import (no Premiere in this environment). That is the gate for the rest of the roadmap.

## 9. Roadmap (build order)

1. **Ben, 10 min: import `output/ledger-video/karen-mykel-draft-v3.xml` into Premiere.** Check: clips land at the right times, audio tracks split correctly, markers visible, relink behaviour. Quirks found get fixed in the emitter, not worked around by hand.
2. EL instance: transcribe-at-ingest + backfills (§3.1 delta tasks, extends the remap handoff).
3. ~~`el-find-clips.mjs`~~ **BUILT + validated live (2026-06-05, second session):** EL spine-tag query (AND semantics) joined to `media_storytellers`/`storytellers` for in-frame people, per-source consent quarantine, `ledger-clipmanifest/v1` output whose `sources` block pastes into a cutspec, `--fetch` (download + ffprobe) and `--transcribe` (whisper, model base) flags. Validated: 22 trip:may-2026 videos found, all correctly flagged pending the consent backfill; `participant:karen` filter returns exactly 1. Transcript-TEXT query still waits on EL transcripts (item 2).
4. ~~`cutspec-to-ffmpeg.mjs`~~ **BUILT + validated (2026-06-05, second session):** the v3 recipe automated (uniform intermediates, drawtext lower-thirds via textfile, concat demuxer, one audio filter_complex with atrim/adelay/volume/afade + amix normalize=0, placeholder pad only when `music.placeholder`, mux -c:v copy). Validated by re-rendering the v3 cutspec: 65.86s vs 65.785s reference (packet-boundary trim), specs match, lower-thirds verified on extracted frames at 10s/40s.
5. First at-scale run: a weekly ledger video for a second cleared voice, end to end through the pipeline.
6. Brand lower-third template (MOGRT) in Premiere so the LOWER THIRD markers become a 10-second drop.

## 10. Open decisions (Ben)

1. v3 blessing-over-bedroom: keep or kill (constructed moment).
2. Music sourcing: licensed vs community-made (value-back aligned; the synth pad never ships).
3. Karen's final line by ear: whisper heard "itching", curated canon says "hits you".
4. Whisper model at ingest: base (fast, current) vs medium (better names/places); and where the batch runs.
5. Confirm the skill-extension choice (VIDEO.md inside ledger-story) over a sibling ledger-video skill.
