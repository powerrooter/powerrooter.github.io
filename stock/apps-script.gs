/**
 * Power Rooter office stock.
 * Container-bound to the Google Sheet (Extensions → Apps Script).
 * The first run creates the tabs if they are missing.
 *
 * Add another office later by appending its name to LOCATIONS,
 * then deploy a new web app version.
 */
var LOCATIONS = ["Power Brooklyn", "Power HQ"];

var SHEET_LOG = "Office Stock Log";
var SHEET_VANS = "Van Counts";
var SHEET_ITEMS = "Items";

var LOG_HEADERS = ["timestamp", "action", "item", "section", "qty", "person", "van plate", "note", "location"];
var VAN_HEADERS = ["report date", "van plate", "mechanic", "item", "section", "listed qty", "actual qty"];
var ITEM_HEADERS = ["section", "item", "listed qty"];

var SEED_ITEMS = [{"section": "300 Machine & Tools", "item": "Maintained 300 Machine with 75 Ft of cable", "qty": 1}, {"section": "300 Machine & Tools", "item": "Extra 25 Ft of cable", "qty": 2}, {"section": "300 Machine & Tools", "item": "Extra Pins", "qty": 5}, {"section": "300 Machine & Tools", "item": "Pairs of yellow gloves", "qty": 2}, {"section": "300 Machine & Tools", "item": "Whip", "qty": 1}, {"section": "300 Machine & Tools", "item": "U Blade 3\"", "qty": 1}, {"section": "300 Machine & Tools", "item": "Half Blade 3\"", "qty": 1}, {"section": "300 Machine & Tools", "item": "U Blade 4\"", "qty": 1}, {"section": "300 Machine & Tools", "item": "Half Blade 4\"", "qty": 1}, {"section": "300 Machine & Tools", "item": "Saw blade", "qty": 1}, {"section": "300 Machine & Tools", "item": "Puncher & Stand", "qty": 1}, {"section": "300 Machine & Tools", "item": "Hammer", "qty": 1}, {"section": "300 Machine & Tools", "item": "Channel Lock 10\" or 12\"", "qty": 1}, {"section": "300 Machine & Tools", "item": "Channel Lock 6.5\"", "qty": 1}, {"section": "300 Machine & Tools", "item": "Pipe Wrench", "qty": 1}, {"section": "300 Machine & Tools", "item": "PB Blaster / WD-40", "qty": 1}, {"section": "300 Machine & Tools", "item": "Extension wire 25 ft", "qty": 1}, {"section": "300 Machine & Tools", "item": "Duct Tape", "qty": 2}, {"section": "300 Machine & Tools", "item": "Long gloves", "qty": 1}, {"section": "300 Machine & Tools", "item": "Philip screw driver", "qty": 1}, {"section": "300 Machine & Tools", "item": "Flat screw driver", "qty": 1}, {"section": "300 Machine & Tools", "item": "Nut Driver", "qty": 1}, {"section": "300 Machine & Tools", "item": "Screw driver 4 in 1", "qty": 1}, {"section": "300 Machine & Tools", "item": "Outlet adapters 2-3", "qty": 1}, {"section": "300 Machine & Tools", "item": "PVC pipe with elbow for trap out sewer 2\"", "qty": 1}, {"section": "300 Machine & Tools", "item": "Repair plates 4\"", "qty": 2}, {"section": "Hand Machine & Tools", "item": "Hand Machine with 25 ft cable", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Extra 25 ft cable", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Drop head 25 ft cable", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Construction gloves", "qty": 3}, {"section": "Hand Machine & Tools", "item": "Channel lock 10\" or 12\"", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Channel lock 6.5\"", "qty": 1}, {"section": "Hand Machine & Tools", "item": "PVC channel lock", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Vise grip", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Flat Screw driver", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Philip screw driver", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Nut driver", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Screw driver 4 in 1", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Teflon Tape", "qty": 5}, {"section": "Hand Machine & Tools", "item": "Electric Tape", "qty": 5}, {"section": "Hand Machine & Tools", "item": "Epoxy", "qty": 2}, {"section": "Hand Machine & Tools", "item": "Plumbers putty", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Outlet adapters 2-3", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Extension wire 25 ft", "qty": 1}, {"section": "Hand Machine & Tools", "item": "Wheeling Case", "qty": 1}, {"section": "100 Machine", "item": "Maintained 100 machine with 75 ft cable", "qty": 1}, {"section": "100 Machine", "item": "Construction gloves", "qty": 3}, {"section": "100 Machine", "item": "Boiler plugs", "qty": 10}, {"section": "Toilet", "item": "Toilet auger", "qty": 1}, {"section": "Toilet", "item": "Wax Rings", "qty": 10}, {"section": "Toilet", "item": "Johnny bolts", "qty": 10}, {"section": "Toilet", "item": "Silicone gun", "qty": 1}, {"section": "Toilet", "item": "Silicone", "qty": 2}, {"section": "Toilet", "item": "Plaster", "qty": 1}, {"section": "Toilet", "item": "Foam spray", "qty": 1}, {"section": "Toilet", "item": "Fill valves (Fluidmaster)", "qty": 3}, {"section": "Toilet", "item": "Flappers", "qty": 5}, {"section": "Toilet", "item": "Ratchet wrench set", "qty": 1}, {"section": "Toilet", "item": "Lock wrench for johnny bolts", "qty": 1}, {"section": "Camera & Tools", "item": "Camera", "qty": 1}, {"section": "Camera & Tools", "item": "Locator", "qty": 1}, {"section": "Camera & Tools", "item": "Rags", "qty": 2}, {"section": "Air Tank", "item": "Maintained Air tank", "qty": 2}, {"section": "Air Tank", "item": "Hose", "qty": 1}, {"section": "Air Tank", "item": "Hose Adapter", "qty": 1}, {"section": "Air Tank", "item": "Flush bag 2\"", "qty": 1}, {"section": "Air Tank", "item": "Flush bag 1/2\"–3\"", "qty": 1}, {"section": "Air Tank", "item": "Flush bag 3\"–4\"", "qty": 1}, {"section": "Air Tank", "item": "Flush bag 3\"–6\"", "qty": 1}, {"section": "Water Testing", "item": "Water hose 150 Ft", "qty": 1}, {"section": "Water Testing", "item": "Speedy with adapter to sink / toilet", "qty": 1}, {"section": "Water Testing", "item": "Nozzle", "qty": 1}, {"section": "Drill", "item": "Electric Drill", "qty": 1}, {"section": "Drill", "item": "Carbide hole saw bit 7/8\"", "qty": 1}, {"section": "Drill", "item": "Center bits", "qty": 2}, {"section": "Drill", "item": "PVC saw hole bit 7/8\"", "qty": 2}, {"section": "Drill", "item": "Plugs 7/8\"", "qty": 5}, {"section": "Tubular Piping", "item": "Pipe Cutter", "qty": 1}, {"section": "Tubular Piping", "item": "Brass Sink traps", "qty": 2}, {"section": "Tubular Piping", "item": "P trap set 1 1/2\"", "qty": 2}, {"section": "Tubular Piping", "item": "Elbows 1 1/2\"", "qty": 5}, {"section": "Tubular Piping", "item": "Offsets 1 1/2\"", "qty": 2}, {"section": "Tubular Piping", "item": "Tail Ends 1 1/2\"", "qty": 2}, {"section": "Tubular Piping", "item": "Slip nuts & washers 1 1/2\"", "qty": 5}, {"section": "Tubular Piping", "item": "P Trap sets 1 1/4\"", "qty": 3}, {"section": "Tubular Piping", "item": "Elbows 1 1/4\"", "qty": 5}, {"section": "Tubular Piping", "item": "Offsets 1 1/4\"", "qty": 2}, {"section": "Tubular Piping", "item": "Tail ends 1 1/4\"", "qty": 2}, {"section": "Tubular Piping", "item": "Slip nuts & washers 1 1/4\"", "qty": 5}, {"section": "Caps", "item": "Caps 3\"", "qty": 5}, {"section": "Caps", "item": "Caps 3 1/2\"", "qty": 5}, {"section": "Caps", "item": "Caps 4\"", "qty": 10}, {"section": "Caps", "item": "Caps 4 1/2\"", "qty": 5}, {"section": "Caps", "item": "Jim Cap 3\"", "qty": 5}, {"section": "Caps", "item": "Jim Cap 4\"", "qty": 5}, {"section": "Caps", "item": "Jim Cap 5\"", "qty": 5}, {"section": "Caps", "item": "Test Plugs 3\"", "qty": 4}, {"section": "Caps", "item": "Test Plugs 4\"", "qty": 4}, {"section": "Couplings & Elbows", "item": "Couplings 4\"", "qty": 5}, {"section": "Couplings & Elbows", "item": "Couplings 3\"", "qty": 5}, {"section": "Couplings & Elbows", "item": "Couplings 2\"", "qty": 5}, {"section": "Couplings & Elbows", "item": "Couplings 2–1 1/2\"", "qty": 2}, {"section": "Miscellaneous", "item": "Grinder with blades", "qty": 1}, {"section": "Miscellaneous", "item": "Shop Vac", "qty": 1}, {"section": "Miscellaneous", "item": "Pump Vac", "qty": 1}, {"section": "Miscellaneous", "item": "Pump with hose", "qty": 1}, {"section": "Miscellaneous", "item": "Set of L keys", "qty": 1}, {"section": "Miscellaneous", "item": "Sledgehammer", "qty": 1}, {"section": "Miscellaneous", "item": "Chisel", "qty": 1}, {"section": "Miscellaneous", "item": "Suction cups", "qty": 2}, {"section": "Miscellaneous", "item": "Extra extension wire 25 ft", "qty": 1}, {"section": "Miscellaneous", "item": "Extra extension wire 50 ft", "qty": 1}, {"section": "Miscellaneous", "item": "Goggles", "qty": 2}, {"section": "Miscellaneous", "item": "Boxes latex gloves", "qty": 6}, {"section": "Miscellaneous", "item": "Bulb outlet adapter", "qty": 1}, {"section": "Miscellaneous", "item": "Regular / Rechargeable flashlight", "qty": 1}, {"section": "Miscellaneous", "item": "Rubber boots", "qty": 1}, {"section": "Miscellaneous", "item": "Disposable boots", "qty": 1}, {"section": "Miscellaneous", "item": "Raincoat", "qty": 1}, {"section": "Miscellaneous", "item": "Grabber", "qty": 1}, {"section": "Miscellaneous", "item": "Bolt Cutter", "qty": 1}, {"section": "Miscellaneous", "item": "Razor blade", "qty": 1}, {"section": "Miscellaneous", "item": "Head Flash light", "qty": 1}, {"section": "Miscellaneous", "item": "Crow Bar", "qty": 1}, {"section": "Miscellaneous", "item": "Long Bar", "qty": 1}, {"section": "Miscellaneous", "item": "Pump", "qty": 1}, {"section": "Miscellaneous", "item": "Degreasing Wipes", "qty": 1}, {"section": "Miscellaneous", "item": "Degrease Spray", "qty": 1}, {"section": "Miscellaneous", "item": "Shoe Covers", "qty": 10}, {"section": "Registration & Insurance", "item": "Registration in the van", "qty": 1}, {"section": "Registration & Insurance", "item": "Insurance card in the van", "qty": 1}];

function doGet() {
  try {
    ensureSheets_();
    return json_({
      ok: true,
      locations: LOCATIONS,
      items: readItems_(),
      log: readLog_(),
      vanCounts: readVanCounts_()
    });
  } catch (err) {
    return json_({ ok: false, error: message_(err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    return json_({ ok: false, error: "Someone else is saving. Try again in a moment." });
  }
  try {
    ensureSheets_();
    return json_(appendMovement_(readBody_(e)));
  } catch (err) {
    return json_({ ok: false, error: message_(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Run once from the editor if you want the tabs created before the first page visit. */
function setup() {
  ensureSheets_();
  var pin = PropertiesService.getScriptProperties().getProperty("PIN");
  var msg = pin && String(pin).trim()
    ? "The stock tabs are ready, and a PIN is set."
    : "The stock tabs are ready. Before you deploy, add a Script property named PIN.";
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (err) {
    Logger.log(msg);
  }
}

function ensureSheets_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Open this script from the Google Sheet (Extensions, then Apps Script), not as a standalone project.");
  }
  var created = !ss.getSheetByName(SHEET_LOG) || !ss.getSheetByName(SHEET_VANS) || !ss.getSheetByName(SHEET_ITEMS);
  var items = getOrCreateSheet_(ss, SHEET_ITEMS);
  ensureHeaders_(items, ITEM_HEADERS);
  if (items.getLastRow() < 2) seedItems_(items);
  ensureHeaders_(getOrCreateSheet_(ss, SHEET_LOG), LOG_HEADERS);
  ensureHeaders_(getOrCreateSheet_(ss, SHEET_VANS), VAN_HEADERS);
  if (created) ss.setSpreadsheetTimeZone("America/New_York");
  return ss;
}

function getOrCreateSheet_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;
  try {
    return ss.insertSheet(name);
  } catch (err) {
    sheet = ss.getSheetByName(name);
    if (sheet) return sheet;
    throw err;
  }
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    return;
  }
  var width = Math.max(sheet.getLastColumn(), 1);
  var first = sheet.getRange(1, 1, 1, width).getValues()[0];
  var have = {};
  first.forEach(function (header) {
    have[String(header || "").trim().toLowerCase()] = true;
  });
  headers.forEach(function (header) {
    if (!have[header.toLowerCase()]) {
      var col = Math.max(sheet.getLastColumn(), 0) + 1;
      sheet.getRange(1, col).setValue(header).setFontWeight("bold");
      have[header.toLowerCase()] = true;
    }
  });
}

function seedItems_(sheet) {
  var rows = SEED_ITEMS.map(function (item) {
    return [item.section, item.item, item.qty];
  });
  if (!rows.length) return;
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
}

function appendMovement_(data) {
  assertPin_(data.pin);
  var action = String(data.action || "").trim().toUpperCase();
  if (action !== "ADD" && action !== "TAKE") {
    return { ok: false, error: "Action must be ADD or TAKE." };
  }
  var qty = positiveInt_(data.qty);
  if (qty == null) {
    return { ok: false, error: "Quantity has to be a whole number greater than zero." };
  }
  var person = String(data.person || "").trim();
  if (!person) return { ok: false, error: "Enter the person's name." };
  if (person.length > 80) return { ok: false, error: "Name is too long." };
  var location = String(data.location || data.office || "").trim();
  if (LOCATIONS.indexOf(location) === -1) {
    return { ok: false, error: "Choose an office: " + LOCATIONS.join(" or ") + "." };
  }
  var van = String(data.van || data.vanPlate || "").trim();
  if (action === "TAKE" && !van) return { ok: false, error: "Enter the van license plate." };
  if (van.length > 20) return { ok: false, error: "License plate is too long." };
  var note = String(data.note || "").trim();
  if (note.length > 300) return { ok: false, error: "Note is too long." };
  var found = findItem_(data.section, data.item);
  if (found.error) return { ok: false, error: found.error };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_LOG);
  sheet.appendRow([
    new Date(),
    action,
    found.item,
    found.section,
    qty,
    textCell_(person),
    textCell_(van),
    textCell_(note),
    location
  ]);
  return { ok: true };
}

function assertPin_(given) {
  var expected = PropertiesService.getScriptProperties().getProperty("PIN");
  if (expected == null || String(expected).trim() === "") {
    throw new Error("The script has no PIN yet. Add a Script property named PIN.");
  }
  var a = String(given == null ? "" : given).trim();
  var b = String(expected).trim();
  var mismatch = a.length === b.length ? 0 : 1;
  var n = Math.max(a.length, b.length);
  for (var i = 0; i < n; i++) {
    var left = i < a.length ? a.charCodeAt(i) : 0;
    var right = i < b.length ? b.charCodeAt(i) : 0;
    if (left !== right) mismatch = 1;
  }
  if (mismatch) throw new Error("That PIN doesn't match.");
}

function findItem_(section, item) {
  var wantedItem = String(item || "").trim();
  var wantedSection = String(section || "").trim();
  if (!wantedItem) return { error: "Choose an item." };
  var rows = readItems_();
  var matches = rows.filter(function (row) {
    if (row.item !== wantedItem) return false;
    if (wantedSection && row.section !== wantedSection) return false;
    return true;
  });
  if (!matches.length) return { error: "That item is not on the office list." };
  if (!wantedSection && matches.length > 1) {
    return { error: "That item is in more than one section. Choose the section too." };
  }
  return { section: matches[0].section, item: matches[0].item };
}

function readItems_() {
  var parsed = readSheet_(SHEET_ITEMS);
  var out = [];
  parsed.rows.forEach(function (row) {
    var item = text_(cell_(row, parsed.map, "item"));
    var section = text_(cell_(row, parsed.map, "section"));
    if (!item) return;
    out.push({
      section: section,
      item: item,
      qty: numberOrNull_(cell_(row, parsed.map, "listed qty"))
    });
  });
  return out;
}

function readLog_() {
  var parsed = readSheet_(SHEET_LOG);
  var out = [];
  parsed.rows.forEach(function (row) {
    var action = text_(cell_(row, parsed.map, "action")).toUpperCase();
    var item = text_(cell_(row, parsed.map, "item"));
    if (action !== "ADD" && action !== "TAKE") return;
    if (!item) return;
    out.push({
      timestamp: timestampIso_(cell_(row, parsed.map, "timestamp")),
      action: action,
      item: item,
      section: text_(cell_(row, parsed.map, "section")),
      qty: numberOrNull_(cell_(row, parsed.map, "qty")),
      person: text_(cell_(row, parsed.map, "person")),
      van: text_(cell_(row, parsed.map, "van plate")),
      note: text_(cell_(row, parsed.map, "note")),
      location: text_(cell_(row, parsed.map, "location"))
    });
  });
  return out;
}

function readVanCounts_() {
  var parsed = readSheet_(SHEET_VANS);
  var out = [];
  parsed.rows.forEach(function (row) {
    var item = text_(cell_(row, parsed.map, "item"));
    var van = text_(cell_(row, parsed.map, "van plate"));
    var date = dateKey_(cell_(row, parsed.map, "report date"));
    var actualRaw = cell_(row, parsed.map, "actual qty");
    if (!item || !van || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    if (actualRaw === "" || actualRaw == null) return;
    var actual = Number(actualRaw);
    if (!isFinite(actual)) return;
    out.push({
      date: date,
      van: van,
      mechanic: text_(cell_(row, parsed.map, "mechanic")),
      item: item,
      section: text_(cell_(row, parsed.map, "section")),
      listed: numberOrNull_(cell_(row, parsed.map, "listed qty")),
      actual: actual
    });
  });
  return out;
}

function readSheet_(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet || sheet.getLastRow() === 0) return { map: {}, rows: [] };
  var values = sheet.getDataRange().getValues();
  var map = {};
  values[0].forEach(function (header, index) {
    map[String(header || "").trim().toLowerCase()] = index;
  });
  return { map: map, rows: values.slice(1) };
}

function readBody_(e) {
  var data = {};
  if (e && e.postData && e.postData.contents) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) data = parsed;
    } catch (err) {
      data = {};
    }
  }
  var params = (e && e.parameter) || {};
  Object.keys(params).forEach(function (key) {
    if (data[key] == null || data[key] === "") data[key] = params[key];
  });
  return data;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function positiveInt_(value) {
  if (typeof value === "number") {
    if (!isFinite(value) || value <= 0 || Math.floor(value) !== value || value > 100000) return null;
    return value;
  }
  var s = String(value == null ? "" : value).trim();
  if (!/^\d+$/.test(s)) return null;
  var n = parseInt(s, 10);
  if (!(n > 0 && n <= 100000)) return null;
  return n;
}

function textCell_(value) {
  var s = String(value == null ? "" : value).trim();
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function text_(value) {
  if (value == null) return "";
  return String(value).trim();
}

function numberOrNull_(value) {
  if (value === "" || value == null) return null;
  var n = Number(value);
  return isFinite(n) ? n : null;
}

function cell_(row, map, name) {
  var index = map[name];
  if (index == null || index < 0 || index >= row.length) return "";
  return row[index];
}

function dateKey_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, "America/New_York", "yyyy-MM-dd");
  }
  var s = String(value || "").trim();
  var iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[1] + "-" + iso[2] + "-" + iso[3];
  var us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (us) return us[3] + "-" + ("0" + us[1]).slice(-2) + "-" + ("0" + us[2]).slice(-2);
  return "";
}

function timestampIso_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return value.toISOString();
  }
  var s = String(value || "").trim();
  if (!s) return "";
  var parsed = new Date(s);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();
  return s;
}

function message_(err) {
  return String(err && err.message ? err.message : err);
}
