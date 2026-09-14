/**
 * Writes the funder model workbook to deliverables/finance/funder-model when FUNDER_MODEL_BUILD=1.
 *
 *   FUNDER_MODEL_BUILD=1 npx vitest run src/lib/finance/build-funder-model.test.ts
 *
 * Same arrangement as the sheet canon: the test suite is the only place the repo loads TS modules
 * from, so the builder lives here and stays off the normal test run unless asked.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import ExcelJS from 'exceljs';
import { buildWorkbook, STYLE, type Cell, type NumberFormat, type RowStyle } from './funder-model';

export const OUT_DIR = join(__dirname, '..', '..', '..', '..', 'deliverables', 'finance', 'funder-model');

const FMT: Record<NumberFormat, string> = {
  aud: STYLE.audFormat,
  int: STYLE.intFormat,
  dec: STYLE.decFormat,
  pct: STYLE.pctFormat,
};

function styleCell(cell: ExcelJS.Cell, style: RowStyle, isFirst: boolean, hasNumber: boolean) {
  if (style === 'title') cell.font = { bold: true, size: 14, color: { argb: `FF${STYLE.formulaText}` } };
  else if (style === 'section') {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${STYLE.sectionFill}` } };
    cell.font = { bold: true, color: { argb: `FF${STYLE.sectionText}` } };
  } else if (style === 'header') cell.font = { bold: true, color: { argb: `FF${STYLE.formulaText}` } };
  else if (style === 'input' && hasNumber) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${STYLE.inputFill}` } };
  else if (style === 'total') cell.font = { bold: true, color: { argb: `FF${STYLE.formulaText}` } };
  if ((style === 'formula' || style === 'total') && hasNumber && !isFirst) cell.font = { ...(cell.font ?? {}), color: { argb: `FF${STYLE.formulaText}` } };
  cell.alignment = { vertical: 'top', wrapText: !hasNumber };
}

export async function writeWorkbook(outDir: string): Promise<string> {
  const desc = buildWorkbook();
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Goods on Country';
  wb.created = new Date(`${desc.version}T00:00:00Z`);
  // A formula whose cached result is 0 is written without a value, so ask Excel to recalculate on open.
  wb.calcProperties.fullCalcOnLoad = true;
  for (const s of desc.sheets) {
    const ws = wb.addWorksheet(s.name, { views: [{ state: 'frozen', ySplit: 2 }] });
    ws.columns = s.widths.map((w) => ({ width: w }));
    s.rows.forEach((row, ri) => {
      const xr = ws.getRow(ri + 1);
      row.cells.forEach((c: Cell, ci) => {
        if (!c) return;
        const xc = xr.getCell(ci + 1);
        if (c.kind === 'text') xc.value = c.value;
        else if (c.kind === 'number') { xc.value = c.value; xc.numFmt = FMT[c.format]; }
        else { xc.value = { formula: c.formula, result: c.value }; xc.numFmt = FMT[c.format]; }
        styleCell(xc, row.style, ci === 0, c.kind !== 'text');
      });
      if (row.style === 'section') for (let ci = 1; ci <= s.widths.length; ci++) styleCell(xr.getCell(ci), 'section', ci === 1, false);
    });
  }
  mkdirSync(outDir, { recursive: true });
  const path = join(outDir, desc.fileName);
  await wb.xlsx.writeFile(path);
  return path;
}

describe('the funder model workbook file', () => {
  it.skipIf(process.env.FUNDER_MODEL_BUILD !== '1')('is written to deliverables/finance/funder-model', async () => {
    const path = await writeWorkbook(OUT_DIR);
    expect(existsSync(path)).toBe(true);
    const back = new ExcelJS.Workbook();
    await back.xlsx.readFile(path);
    expect(back.worksheets.map((w) => w.name)).toEqual(buildWorkbook().sheets.map((s) => s.name));
  });
});
