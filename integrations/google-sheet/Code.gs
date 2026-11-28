/**
 * CCC website leads -> this Google Sheet.
 *
 * Setup (README.md, "Where form submissions go"):
 *   1. In the sheet: Extensions > Apps Script. Replace the code with this file.
 *   2. Project Settings > Script properties: add LEADS_SECRET (the same value as SHEETS_WEBHOOK_SECRET).
 *   3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *   4. Copy the web app URL (ends in /exec) into SHEETS_WEBHOOK_URL.
 *
 * "Anyone" lets the website call the script; the script refuses requests without the secret.
 * It only ever appends rows, so the sheet itself can (and should) stay Restricted.
 */
var TAB = 'Leads';

function doPost(e) {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty('LEADS_SECRET');
    var data = JSON.parse(e.postData.contents);
    if (!secret || data.secret !== secret) return reply({ ok: false, error: 'unauthorised' });
    if (!Array.isArray(data.headers) || !Array.isArray(data.row) || data.headers.length !== data.row.length) {
      return reply({ ok: false, error: 'bad request' });
    }
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var book = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = book.getSheetByName(TAB) || book.insertSheet(TAB);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(data.headers);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, data.headers.length).setFontWeight('bold');
      }
      sheet.appendRow(data.row.map(safeCell));
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: String(err) });
  }
}

/** Second guard against formulas: the website already prefixes these with an apostrophe. */
function safeCell(value) {
  var text = String(value).slice(0, 5000);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
