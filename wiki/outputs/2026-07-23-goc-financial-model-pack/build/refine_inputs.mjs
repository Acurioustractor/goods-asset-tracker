import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const root = "/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-07-23-goc-financial-model-pack";
const inputPath = `${root}/GOC-Entity-Model-Inputs.xlsx`;
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const inputs = workbook.worksheets.getItem("Inputs");
const notes = workbook.worksheets.getItem("Notes");

// Matt's house style: Arial, dark teal section bands, light-blue headers/totals.
for (const sheet of [inputs, notes]) {
  const used = sheet.getUsedRange();
  used.format.font = { ...used.format.font, name: "Arial" };
}

inputs.getRange("A1:D66").format.font = { name: "Arial", size: 10, color: "#000000" };
inputs.getRange("A1:D1").format.font = { name: "Arial", size: 14, bold: true, color: "#000000" };
inputs.getRange("A2:D2").format.font = { name: "Arial", size: 9, bold: true, color: "#595959" };
inputs.getRange("A2:D2").format.wrapText = true;
inputs.getRange("A2").values = [["Blue = editable input. Black = formula. Green = link to another sheet. All AUD ex-GST unless noted. Entity-level figures for Matt's GOC-only 3-statement model. Every figure carries a status and source. See Notes for provenance."]];

const sectionRows = [4, 13, 20, 29, 36, 45, 53, 62];
const headerRows = [5, 14, 21, 30, 37, 46, 54];
for (const row of sectionRows) {
  const range = inputs.getRange(`A${row}:D${row}`);
  range.format.fill = "#1F4E5F";
  range.format.font = { name: "Arial", size: 11, bold: true, color: "#FFFFFF" };
}
for (const row of headerRows) {
  const range = inputs.getRange(`A${row}:D${row}`);
  range.format.fill = "#D9E7F3";
  range.format.font = { name: "Arial", size: 10, bold: true, color: "#000000" };
}
for (const row of [10, 18, 26, 41]) {
  const range = inputs.getRange(`A${row}:D${row}`);
  range.format.fill = "#D9E7F3";
  range.format.font = { name: "Arial", size: 10, bold: true, color: "#000000" };
}

// Formula rows are black, derived, and carry plain-text audit notes.
inputs.getRange("C10").values = [["derived"]];
inputs.getRange("D10").values = [["Cash received less Goods expenses. Model does not rely on unpaid founder time."]];
inputs.getRange("C18").values = [["derived"]];
inputs.getRange("D18").values = [["Opening cash plus sunk plant, so the opening balance sheet balances."]];
inputs.getRange("C26").values = [["derived"]];
inputs.getRange("D26").values = [["$109,500, confirmed line by line in GoC Q&A Q1."]];
inputs.getRange("C41").values = [["derived"]];
inputs.getRange("D41").values = [["Sum of the placeholder capital stack above."]];

// Formula cells are black; hardcoded editable inputs remain blue.
for (const row of [10, 18, 26, 41]) inputs.getRange(`B${row}`).format.font = { name: "Arial", size: 10, bold: true, color: "#000000" };
for (const range of ["B6:B9", "B11:B11", "B15:B17", "B22:B25", "B27:B27", "B31:B33", "B38:B40", "B42:B43", "B47:B51", "B55:B60"]) {
  inputs.getRange(range).format.font = { name: "Arial", size: 10, color: "#0000CC" };
}
inputs.getRange("C6:D60").format.font = { name: "Arial", size: 9, color: "#595959" };
inputs.getRange("D6:D60").format.wrapText = true;

// Remove prohibited em dashes and standardise On Country wording throughout.
for (const sheet of [inputs, notes]) {
  const used = sheet.getUsedRange();
  const values = used.values;
  const formulas = used.formulas;
  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < values[r].length; c++) {
      if (!formulas[r][c] && typeof values[r][c] === "string") {
        const cleaned = values[r][c]
          .replaceAll(" — ", ": ")
          .replaceAll("—", ",")
          .replaceAll("on-country", "On Country")
          .replaceAll("On-country", "On Country");
        if (cleaned !== values[r][c]) used.getCell(r, c).values = [[cleaned]];
      }
    }
  }
}

notes.getRange("A1").format.font = { name: "Arial", size: 14, bold: true, color: "#000000" };
for (const row of [3, 6, 9, 18, 26]) notes.getRange(`A${row}`).format.font = { name: "Arial", size: 11, bold: true, color: "#000000" };
notes.getRange("A4:A31").format.font = { name: "Arial", size: 9, color: "#595959" };
notes.getRange("A4:A31").format.wrapText = true;

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errorScan.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(inputPath);
