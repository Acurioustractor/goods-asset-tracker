import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const root = "/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-07-23-goc-financial-model-pack";
const inputPath = `${root}/GOC-Entity-Model-Inputs.xlsx`;
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const inputs = workbook.worksheets.getItem("Inputs");
const notes = workbook.worksheets.getItem("Notes");
const known = workbook.worksheets.getOrAdd("Known Other Costs");
const questions = workbook.worksheets.getOrAdd("Open Questions");

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

function resetSheet(sheet) {
  const used = sheet.getUsedRange();
  if (used) used.clear({ applyTo: "all" });
  sheet.showGridLines = true;
}

function styleReferenceSheet(sheet, lastRow, widths) {
  sheet.getRange(`A1:H${lastRow}`).format.font = { name: "Arial", size: 9, color: "#000000" };
  sheet.getRange("A1:H1").format.font = { name: "Arial", size: 14, bold: true, color: "#000000" };
  sheet.getRange("A2:H2").format.font = { name: "Arial", size: 9, italic: true, color: "#595959" };
  sheet.getRange("A2:H2").format.wrapText = true;
  sheet.getRange(`A1:H${lastRow}`).format.borders = { preset: "inside", style: "thin", color: "#D9D9D9" };
  for (let c = 0; c < widths.length; c++) sheet.getRangeByIndexes(0, c, lastRow, 1).format.columnWidth = widths[c];
  sheet.getRange(`A1:H${lastRow}`).format.wrapText = true;
  sheet.freezePanes.freezeRows(4);
}

resetSheet(known);
known.getRange("A1").values = [["Known Other Costs"]];
known.getRange("A1:H1").merge();
known.getRange("A2").values = [["Costs already found in the GOC codebase and workpapers. Status is load-bearing: evidenced and verified are not the same as modelled, allowance or physical-only. All AUD ex-GST unless the Unit column says otherwise."]];
known.getRange("A2:H2").merge();

const knownRows = [
  ["1. EXISTING PLANT AND HARDWARE: ACTUAL OR PHYSICALLY CONFIRMED", null, null, null, null, null, null, null],
  ["Cost item", "Low", "High", "Selected/current", "Unit", "Status", "Source", "Notes"],
  ["Evidenced sunk hardware total", null, null, 75000, "AUD", "evidenced/mixed", "MVF reconciliation, 2026-07-22", "About $43.7K cleanly tagged, $12.5K ambiguous and $19.8K physical-only shredder. Rounded total."],
  ["Press + cold press + CNC bundle", null, null, 32780, "AUD inc GST", "evidenced", "Xero INV-0054, 2025-12-17, ACT-GD", "Existing purchase, not a fresh-site quote."],
  ["Workshop tools", null, null, 6387, "AUD inc GST", "evidenced, tagged Harvest", "Carbatec Brisbane, Xero, Jan 2026", "$4,575.65 + $1,811.70."],
  ["20ft container, Monument Grey", null, null, 3320, "AUD inc GST", "evidenced", "Bionic Self Storage, Xero, 2026-04-29", "Capitalised to ACT-FM The Farm."],
  ["Crane placement", null, null, 1041, "AUD inc GST", "evidenced", "GM Crane Hire, Xero, 2026-06-29", "Two 20T Franna cranes."],
  ["Container transport", null, null, 193, "AUD inc GST", "evidenced", "Rapid Container, Xero, 2026-06-24", "After-hours transport."],
  ["Two generators", null, null, 6600, "AUD inc GST", "evidenced, ambiguous", "Orange Sky Australia, Xero, 2025-05-22", "No project tag. Confirm whether both belong to GOC."],
  ["Larger container", null, null, 5904, "AUD inc GST", "evidenced, flagged", "Container Options, Xero, 2025-12-09", "Tagged Mounty Yarns and flagged as on-sold. Do not include until ownership is confirmed."],
  ["Shredder, Telford Smith", null, null, 19800, "AUD", "physical only", "Ben confirmation; no record in connected Xero", "Owned, invoice to locate."],
  ["Bigger CNC router", null, null, null, "AUD", "open", "MVF section 4b", "Recently purchased. Amount and purchasing entity to confirm. About $5,135 installation is booked separately."],
  [null, null, null, null, null, null, null, null],
  ["2. NEW-SITE REPLICATION: MIXED EVIDENCE AND ESTIMATES", null, null, null, null, null, null, null],
  ["Cost item", "Low", "High", "Selected/current", "Unit", "Status", "Source", "Notes"],
  ["40ft shipping container", 13000, 16000, 14500, "AUD", "modelled", "Ben / MVF replication model", "Market-rate fresh-site range."],
  ["20ft shipping container", 6000, 10000, 8000, "AUD", "modelled", "Ben / MVF replication model", "Market-rate fresh-site range."],
  ["Diesel generator, press-line sized", 6600, 20000, 13300, "AUD", "mixed", "Orange Sky actual to proper diesel estimate", "Capacity and site power requirement need confirmation."],
  ["Shredder", 19800, 19800, 19800, "AUD", "physical basis", "Existing Telford Smith unit", "Invoice still to locate."],
  ["Press + cold press + CNC", 32780, 32780, 32780, "AUD inc GST", "evidenced basis", "Circularity INV-0054", "Existing purchase used as replication basis."],
  ["Workshop tools", 6387, 6387, 6387, "AUD inc GST", "evidenced basis", "Carbatec actuals", "Existing purchase used as replication basis."],
  ["Crane placement + transport", 1200, 2500, 1850, "AUD", "mixed", "Existing actuals + allowance", "Remote/site conditions can move this materially."],
  ["Electrical fit-out", 3000, 8000, 5500, "AUD", "allowance", "MVF replication model", "Board and three-phase work. Quote required."],
  ["Ventilation / fume extraction", 1000, 3000, 2000, "AUD", "allowance", "MVF replication model", "Quote required for hot-press heat load."],
  ["Site preparation", 500, 3000, 1750, "AUD", "allowance", "MVF replication model", "Pad and levelling."],
  ["PPE + startup consumables", 500, 1500, 1000, "AUD", "allowance", "MVF replication model", "Initial stock only."],
  ["NEW-SITE MINIMAL VIABLE FACILITY", 90767, 122967, 105000, "AUD", "modelled midpoint", "MVF reconciliation, 2026-07-22", "Use about $105K as the replication planning figure. Firm quotes required."],
  ["Matt container-workshop build", null, null, 207450, "AUD", "modelled", "Matt Inputs B27", "$167K equipment midpoint + $40,450 container lines. Different scope from the MVF replication case."],
  [null, null, null, null, null, null, null, null],
  ["3. RECURRING COSTS ALREADY FOUND", null, null, null, null, null, null, null],
  ["Cost item", "Low", "High", "Selected/current", "Unit", "Status", "Source", "Notes"],
  ["Founder full Goods time, 150 days", null, null, 84000, "AUD/yr", "locked", "Ben, 2026-05-29", "30 production, 50 fundraising, 25 commercialisation, 45 governance days."],
  ["Founder non-production time", null, null, 67200, "AUD/yr", "locked", "Ben, 2026-05-29", "Excluded from unit cost. Decide whether entity overhead, founder contribution or sensitivity."],
  ["Equipment maintenance per facility", null, null, 8350, "AUD/facility/yr", "placeholder", "GoC Q&A Q9; Matt selected 5%", "5% of $167K equipment. Vendor quotes pending."],
  ["Community lease, rent, utilities and site", null, null, 60000, "AUD/site/yr", "as-written", "Oonchiumpa DEWR application", "$180K over three years."],
  ["Community facility insurance", null, null, 40000, "AUD/site/yr", "as-written", "Oonchiumpa DEWR application", "$120K over three years."],
  ["Community administration, accounting and IT", null, null, 33333, "AUD/site/yr", "as-written", "Oonchiumpa DEWR application", "$100K over three years."],
  ["Community machine upkeep and consumables", null, null, 18333, "AUD/site/yr", "as-written", "Oonchiumpa DEWR application", "$55K over three years."],
  ["BARE COMMUNITY FACILITY", null, null, 151666, "AUD/site/yr", "derived", "Sum of DEWR facility lines", "Pot 2. Do not add the old $24K rent-only figure."],
  ["Community project manager incl. super", null, null, 150000, "AUD/site/yr", "as-written", "Oonchiumpa DEWR application", "Open alternative is a $90K coordinator."],
  ["Trainer / WHS officer", null, null, 40000, "AUD/site/yr", "modelled split", "Portion of DEWR ACT $190K line", "Estimate, not a stated standalone figure."],
  ["FULLY STAFFED COMMUNITY FACILITY", null, null, 341666, "AUD/site/yr", "derived", "Bare + manager + trainer/WHS", "Pot 2, grant/government-funded by design."],
  ["Employment program brokerage and wages", null, null, 300000, "AUD/site/yr", "as-written", "Oonchiumpa DEWR application", "Pot 2. Never carried by bed sales."],
];
known.getRange(`A4:H${3 + knownRows.length}`).values = knownRows;
const knownLast = 3 + knownRows.length;
styleReferenceSheet(known, knownLast, [34, 12, 12, 15, 16, 18, 31, 54]);
for (const row of [4, 17, 33]) {
  known.getRange(`A${row}:H${row}`).format.fill = "#1F4E5F";
  known.getRange(`A${row}:H${row}`).format.font = { name: "Arial", size: 11, bold: true, color: "#FFFFFF" };
}
for (const row of [5, 18, 34]) {
  known.getRange(`A${row}:H${row}`).format.fill = "#D9E7F3";
  known.getRange(`A${row}:H${row}`).format.font = { name: "Arial", size: 9, bold: true, color: "#000000" };
}
for (const row of [30, 42, 45]) known.getRange(`A${row}:H${row}`).format.font = { name: "Arial", size: 9, bold: true, color: "#000000" };
known.getRange(`B6:D${knownLast}`).format.numberFormat = "$#,##0;($#,##0);-";

resetSheet(questions);
questions.getRange("A1").values = [["Open Questions for the GOC Entity Model"]];
questions.getRange("A1:H1").merge();
questions.getRange("A2").values = [["Items Matt may need before the GOC-only 3-statement model can be treated as decision-ready. A blank or TBC placeholder means the codebase does not currently contain a defensible number."]];
questions.getRange("A2:H2").merge();
const questionRows = [
  ["Priority", "Question / missing input", "Current evidence", "Working placeholder", "Owner", "Status", "Why it matters", "Next action"],
  ["Critical", "What is actual opening GOC cash?", "Current Inputs uses $50K assumption.", 50000, "Ben + accountant", "open", "Controls the cash trough and funding requirement.", "Confirm bank balance and entity migration date."],
  ["Critical", "Which replication capex scope should Matt use?", "MVF $90.8K-$123K, midpoint ~$105K. Matt full container build $207,450.", 105000, "Ben + Matt", "open", "Changes funding need and depreciation.", "Choose scope, then obtain firm vendor quotes."],
  ["Critical", "What did the bigger CNC cost, and who owns it?", "Recently purchased. About $5,135 installation booked.", "TBC", "Ben + bookkeeper", "open", "Opening PP&E and ownership cannot reconcile without it.", "Locate invoice and purchasing entity."],
  ["Critical", "Have the shredder and container ownership records been located?", "$19,800 shredder is physical-only. Some container costs are ambiguously tagged.", "TBC", "Ben + bookkeeper", "open", "Determines opening assets and evidence quality.", "Locate invoices or formally document owned, invoice to locate."],
  ["Critical", "Was the 40-bed run measured for time, diesel and yield?", "Factory process proven on 40 Maningrida beds. Per-bed cost remains modelled.", "Short measured run", "Ben + production lead", "open", "Locks the $425.74 factory cost and sustained capacity.", "Recover run records or perform a measured run."],
  ["Critical", "What sustained beds-per-facility capacity should be modelled?", "Sources say 250, 1,250 and about 1,500 beds/yr. Matt uses 500.", 500, "Ben + production lead", "open", "Determines whether production and community facilities are viable.", "Use 500 conservatively until the measured run resolves it."],
  ["Critical", "What is the actual capital stack and draw timing?", "SEFA $300K, QBE $400K and philanthropy $500K are placeholders. Signed match today is $0.", "TBC", "Ben + Matt + QBE", "open", "Drives debt, cash and interest.", "Confirm instrument, amount, date and matching eligibility."],
  ["Critical", "What entity owns assets and trades at forecast start?", "Historical activity is in the sole trader. Pty Ltd migration and plant handover are not complete.", "TBC", "Ben + legal + accountant", "open", "Sets opening balance sheet, tax and related-party treatment.", "Confirm transfer date, values and legal structure."],
  ["High", "Should $67,200 founder non-production time be an entity expense?", "Locked 120 days x $560. Excluded from unit cost.", 67200, "Ben + Matt", "open", "Without treatment, overhead and profitability can be overstated.", "Choose expense, founder contribution or disclosed sensitivity."],
  ["High", "Can historical $309,126 expenses be split by category?", "Only an aggregate cash-basis Goods expense figure is available here.", "TBC", "Accountant + bookkeeper", "open", "Matt needs a recurring overhead base, not one aggregate.", "Provide accountant carve-out by direct cost, payroll, travel, professional services and other."],
  ["High", "Site manager or coordinator?", "DEWR prices $150K incl. super. Alternative $90K coordinator is an assumption.", 150000, "Ben + community partner", "open", "Moves staffed-site cost and break-even materially.", "Confirm operating design for each site type."],
  ["High", "Is the $40K trainer/WHS split correct?", "Derived from a blended $190K ACT machinery + trainer/WHS line.", 40000, "Ben + Oonchiumpa", "open", "The number is not stated separately in the application.", "Obtain the underlying budget split."],
  ["High", "What working-capital treatment applies to grants?", "30 debtor, 30 creditor and 45 inventory days only address normal operations.", "TBC", "Matt + accountant", "open", "Grant receivables and acquittal timing can dominate cash.", "Set grant invoice, receipt and restricted-fund timing."],
  ["High", "What are debt fees, term and repayment profile?", "Only a 6% interest assumption exists.", "TBC", "Matt + lenders", "open", "Interest-only is not enough for a financing schedule.", "Add establishment fee, draw dates, maturity and principal repayments."],
  ["High", "What tax and GST treatment applies?", "25% company-tax placeholder. Rough GST payable signal ~$29,657 is unverified.", "TBC", "Accountant", "open", "Grants, losses, DGR flows and asset transfers may differ by entity.", "Confirm company tax, GST-free grants, BAS and loss carry-forwards."],
  ["Medium", "What central entity overheads sit outside the $109,500 block?", "No defensible standalone totals for legal, audit, insurance, software, governance or banking.", "TBC", "Ben + accountant", "open", "These costs are required in an entity P&L.", "Extract actuals and set a Year 1 budget."],
  ["Medium", "What payroll on-cost assumptions should apply?", "DEWR manager includes super. Other labour assumptions may not.", "TBC", "Accountant", "open", "Super, leave, workers compensation and payroll tax can materially change staffing cost.", "Confirm which labour lines are fully loaded."],
  ["Medium", "What warranty and replacement provision is appropriate?", "Stretch Bed has a five-year warranty. No provision is in the pack.", "TBC", "Ben + Matt", "open", "A credible product P&L needs expected warranty cost.", "Review claims history and set a percent-of-sales provision."],
  ["Medium", "What bad-debt, inventory-loss and production-yield allowances apply?", "No current assumptions. Factory yield has not been measured at sustained rate.", "TBC", "Ben + accountant", "open", "Avoids overstating margin, AR and inventory.", "Use actual history or conservative placeholders."],
  ["Medium", "What inflation and price-indexation assumptions apply?", "$750 price is held flat and no cost inflation is modelled.", "TBC", "Ben + Matt", "open", "Longer forecasts otherwise create misleading margins.", "Set annual price, wages, materials and facility escalation."],
  ["Medium", "What volumes and production-path mix are supportable by demand?", "Matt's unit model is capacity-driven. Demand constraint remains open.", "TBC", "Ben + commercial lead", "open", "Revenue cannot be based on capacity alone.", "Build a signed/weighted demand schedule by buyer and year."],
  ["Medium", "How should Pot 2 grant income match Pot 2 costs?", "Bare $151,666, staffed $341,666 and program $300K costs are known, but funding timing is not.", "TBC", "Ben + Matt", "open", "Prevents production revenue from implicitly subsidising the wraparound.", "Model separate restricted grant income and cost centres."],
];
questions.getRange(`A4:H${3 + questionRows.length}`).values = questionRows;
const questionsLast = 3 + questionRows.length;
styleReferenceSheet(questions, questionsLast, [12, 36, 46, 22, 22, 13, 45, 45]);
questions.getRange("A4:H4").format.fill = "#1F4E5F";
questions.getRange("A4:H4").format.font = { name: "Arial", size: 9, bold: true, color: "#FFFFFF" };
questions.getRange(`D5:D${questionsLast}`).format.font = { name: "Arial", size: 9, color: "#0000CC" };
questions.getRange("D5").format.numberFormat = "$#,##0;($#,##0);-";
for (const cell of ["D6", "D13", "D15", "D16"]) questions.getRange(cell).format.numberFormat = "$#,##0;($#,##0);-";
questions.getRange("D10").format.numberFormat = "#,##0";
for (let row = 5; row <= questionsLast; row++) {
  const priority = questions.getRange(`A${row}`).values[0][0];
  if (priority === "Critical") questions.getRange(`A${row}`).format.fill = "#F4CCCC";
  if (priority === "High") questions.getRange(`A${row}`).format.fill = "#FCE5CD";
  if (priority === "Medium") questions.getRange(`A${row}`).format.fill = "#FFF2CC";
}

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errorScan.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(inputPath);
