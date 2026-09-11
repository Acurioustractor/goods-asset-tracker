# The problem: live sheet delivery

11 September 2026. Source handoff commit: 2be2ef2.

[Open The problem](https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit#gid=153)

Added gid 153 immediately before Plant budget (gid 104), the current name of The plant. Read me A41:B41 links to it. Existing financial cells were not changed.

The four sections contain 33 module-backed rows: nine health figures, five regional overcrowding rows, seven environment rows, six employment rows and six ownership rows. All rows have figure, definition, period, grade, source URL and a cell note pointing to their module export and row index. All four claim ceilings are copied from module constants. The 40-to-100-times row is explicitly marked unverified; DO NOT USE. Five rows are unverified in the actual modules, although the handoff says six. Their reasons remain visible. No grade was upgraded.

The CNOS connection and 70% / 49% / 15% comparison are prominent. The national comparator is explicitly First Nations people. Regional figures are labelled 2022–23 and distinguished from community geography and disease rates.

This is a dated source view, not an automatic live import and not a second editable evidence source. Change a typed module first, then run:

```sh
node deliverables/qbe-stage2/pages/export-problem-tab.mjs > /private/tmp/problem-tab-export.json
```

The exporter imports the four typed modules and emits CellData plus row references; it does not contact Google Sheets. Inspect live metadata and range A1:E70 before applying a refreshed export through the Sheets connector. Preserve the native tables, source hyperlinks and conditional grade formatting. If module row structure changes, review the selected rows and guards before refreshing. Do not add calculation formulas or connect these figures to bed counts.

Validation:
- Existing four module guard suites: 41 tests passed.
- Exporter safe invocation: 33 sourced rows, 70 display rows, zero formulas.
- Live readback: all display values match the module-derived export.
- All 33 source URLs and all 33 module-row notes verified.
- All four ceiling constants verified verbatim.
- Native Sheets layout inspected; headers, source links and long unverified reasons corrected.
- Existing financial formulas and model inputs were not edited.

No commit or push was made by Codex.

