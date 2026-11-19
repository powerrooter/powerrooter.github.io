/**
 * Power Rooter office stock.
 * Container-bound to the Google Sheet (Extensions → Apps Script).
 * The first run creates the tabs if they are missing.
 *
 * Add another office later by appending its name to LOCATIONS,
 * then deploy a new web app version.
 */
var LOCATIONS = ["Power Brooklyn", "Power HQ"];
var NOTIFY_EMAILS = ["office@powerrooter.com"];
var CHECKLIST_KEY = "pr-checklist-2026";

var SHEET_LOG = "Office Stock Log";
var SHEET_VANS = "Van Counts";
var SHEET_ITEMS = "Items";

var LOG_HEADERS = ["timestamp", "action", "item", "section", "qty", "person", "van plate", "note", "location"];
var VAN_HEADERS = ["report date", "van plate", "mechanic", "item", "section", "listed qty", "actual qty", "status", "note", "received"];
var ITEM_HEADERS = ["section", "item", "listed qty", "retired"];

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
    var data = readBody_(e);
    var action = String(data.action || "").trim().toUpperCase();
    if (action === "CHECKLIST") return json_(saveChecklist_(data));
    if (action === "ADD_ITEM") return json_(addItem_(data));
    if (action === "EDIT_ITEM") return json_(editItem_(data));
    if (action === "RETIRE_ITEM") return json_(retireItem_(data));
    return json_(appendMovement_(data));
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
  if (found.retired) return { ok: false, error: "That item is hidden. Show it again before changing its stock." };

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
  return { section: matches[0].section, item: matches[0].item, retired: !!matches[0].retired };
}

function readItems_() {
  var parsed = readSheet_(SHEET_ITEMS);
  var out = [];
  parsed.rows.forEach(function (row) {
    var item = text_(cell_(row, parsed.map, "item"));
    var section = text_(cell_(row, parsed.map, "section"));
    if (!item) return;
    var retiredRaw = text_(cell_(row, parsed.map, "retired")).toLowerCase();
    out.push({
      section: section,
      item: item,
      qty: numberOrNull_(cell_(row, parsed.map, "listed qty")),
      retired: retiredRaw === "yes" || retiredRaw === "true" || retiredRaw === "1"
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
    var actual = null;
    if (actualRaw !== "" && actualRaw != null) {
      actual = Number(actualRaw);
      if (!isFinite(actual)) return;
    }
    out.push({
      date: date,
      van: van,
      mechanic: text_(cell_(row, parsed.map, "mechanic")),
      item: item,
      section: text_(cell_(row, parsed.map, "section")),
      listed: numberOrNull_(cell_(row, parsed.map, "listed qty")),
      actual: actual,
      status: text_(cell_(row, parsed.map, "status")),
      note: text_(cell_(row, parsed.map, "note"))
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

function normPlate_(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function itemKey_(section, item) {
  return String(section || "") + "\n" + String(item || "");
}

function saveChecklist_(data) {
  if (String(data.key || "") !== CHECKLIST_KEY) {
    return { ok: false, error: "Checklist key doesn't match." };
  }
  var mechanic = text_(data.mechanic);
  var van = text_(data.van || data.vanPlate);
  var date = dateKey_(data.date);
  if (!mechanic) return { ok: false, error: "Enter the mechanic's name." };
  if (!van) return { ok: false, error: "Enter the van license plate." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "Enter the checklist date." };
  var items = normalizeChecklistItems_(data.items);
  if (!items.length) return { ok: false, error: "The checklist has no items." };
  var history = readVanCounts_().filter(function (row) {
    return !(normPlate_(row.van) === normPlate_(van) && row.date === date);
  });
  var report = buildReport_(mechanic, van, date, items, history, readLog_(), text_(data.notice));
  writeChecklist_(date, van, mechanic, items);
  var emailed = false;
  var emailError = "";
  if (data.notify !== false) {
    try {
      sendChecklistEmail_(report);
      emailed = true;
    } catch (err) {
      emailError = message_(err);
    }
  }
  return {
    ok: true,
    baseline: report.baseline,
    needs: report.needs.length,
    recount: report.recount.length,
    emailed: emailed,
    emailError: emailError
  };
}

function normalizeChecklistItems_(items) {
  var list = [];
  if (!items || !items.length) return list;
  var known = readItems_();
  for (var i = 0; i < items.length; i++) {
    var raw = items[i] || {};
    var item = text_(raw.item);
    if (!item) continue;
    var wantedSection = text_(raw.section);
    var matches = known.filter(function (row) {
      if (row.item !== item) return false;
      if (wantedSection && row.section !== wantedSection) return false;
      return true;
    });
    var section = matches.length === 1 ? matches[0].section : wantedSection;
    var name = matches.length === 1 ? matches[0].item : item;
    var actual = raw.actual;
    if (actual === "" || actual == null) actual = null;
    else {
      actual = Number(actual);
      if (!isFinite(actual)) actual = null;
    }
    var listed = raw.listed == null || raw.listed === "" ? null : Number(raw.listed);
    if (listed != null && !isFinite(listed)) listed = null;
    list.push({
      section: section,
      item: name,
      listed: listed,
      actual: actual,
      status: text_(raw.status),
      note: text_(raw.note)
    });
  }
  return list;
}

function writeChecklist_(date, van, mechanic, items) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_VANS);
  ensureHeaders_(sheet, VAN_HEADERS);
  deleteReportRows_(sheet, date, normPlate_(van));
  var headerMap = {};
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers.forEach(function (header, index) {
    headerMap[String(header || "").trim().toLowerCase()] = index;
  });
  var width = Math.max(sheet.getLastColumn(), 1);
  var received = new Date();
  var values = items.map(function (item) {
    var line = [];
    for (var c = 0; c < width; c++) line.push("");
    var fields = {
      "report date": date,
      "van plate": textCell_(van),
      "mechanic": textCell_(mechanic),
      "item": item.item,
      "section": item.section,
      "listed qty": item.listed == null ? "" : item.listed,
      "actual qty": item.actual == null ? "" : item.actual,
      "status": item.status,
      "note": textCell_(item.note),
      "received": received
    };
    Object.keys(fields).forEach(function (key) {
      if (headerMap[key] != null) line[headerMap[key]] = fields[key];
    });
    return line;
  });
  if (!values.length) return;
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, width).setValues(values);
}

function deleteReportRows_(sheet, date, vanKey) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return;
  var map = {};
  values[0].forEach(function (header, index) {
    map[String(header || "").trim().toLowerCase()] = index;
  });
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var rowDate = dateKey_(cell_(values[i], map, "report date"));
    var rowVan = normPlate_(text_(cell_(values[i], map, "van plate")));
    if (rowDate === date && rowVan === vanKey) rows.push(i + 1);
  }
  rows.sort(function (a, b) { return b - a; });
  rows.forEach(function (rowNumber) { sheet.deleteRow(rowNumber); });
}

function buildReport_(mechanic, van, date, items, history, log, notice) {
  var dates = [];
  history.forEach(function (row) {
    if (normPlate_(row.van) === normPlate_(van) && row.date && dates.indexOf(row.date) === -1 && row.date < date) dates.push(row.date);
  });
  dates.sort();
  var previous = dates.length ? dates[dates.length - 1] : "";
  var prevBy = {};
  if (previous) {
    history.forEach(function (row) {
      if (normPlate_(row.van) === normPlate_(van) && row.date === previous) prevBy[itemKey_(row.section, row.item)] = row;
    });
  }
  var taken = {};
  if (previous) {
    log.forEach(function (row) {
      if (row.action !== "TAKE" || normPlate_(row.van) !== normPlate_(van)) return;
      var day = nyDateKey_(row.timestamp);
      if (!day || day <= previous || day > date) return;
      var id = itemKey_(row.section, row.item);
      taken[id] = (taken[id] || 0) + (Number(row.qty) || 0);
    });
  }
  var needs = [];
  var recount = [];
  var discrepancies = [];
  var registration = [];
  var notes = [];
  items.forEach(function (row) {
    var status = row.status || inferStatus_(row);
    var actual = row.actual == null || !isFinite(Number(row.actual)) ? null : Number(row.actual);
    var listed = row.listed == null || !isFinite(Number(row.listed)) ? null : Number(row.listed);
    if (row.note) notes.push({ section: row.section, item: row.item, note: row.note });
    if (row.section === "Registration & Insurance" && status !== "Exact" && (actual === 0 || actual == null || status === "Less")) {
      registration.push({ item: row.item, actual: actual });
    }
    if (status === "Less" && actual == null) {
      recount.push({ section: row.section, item: row.item, listed: listed, note: row.note || "" });
      return;
    }
    if (status === "Less" && actual != null && listed != null && listed - actual > 0) {
      var stock = officeStock_(log, row.section, row.item);
      var need = listed - actual;
      var brooklyn = stock["Power Brooklyn"] || 0;
      var hq = stock["Power HQ"] || 0;
      needs.push({
        section: row.section,
        item: row.item,
        listed: listed,
        actual: actual,
        need: need,
        brooklyn: brooklyn,
        hq: hq,
        source: suggestSource_(need, brooklyn, hq),
        big: isBigMissing_(row.item, listed, actual),
        note: row.note || ""
      });
    }
    if (previous && actual != null) {
      var prev = prevBy[itemKey_(row.section, row.item)];
      var prevActual = prev && prev.actual != null && isFinite(Number(prev.actual)) ? Number(prev.actual) : null;
      if (prevActual != null) {
        var took = taken[itemKey_(row.section, row.item)] || 0;
        var expected = prevActual + took;
        if (actual !== expected) {
          discrepancies.push({
            item: row.item,
            previous: prevActual,
            taken: took,
            expected: expected,
            actual: actual,
            direction: actual < expected ? "below" : "above"
          });
        }
      }
    }
  });
  needs.sort(function (a, b) {
    if (a.big !== b.big) return a.big ? -1 : 1;
    if (a.need !== b.need) return b.need - a.need;
    return a.item < b.item ? -1 : 1;
  });
  return {
    mechanic: mechanic,
    van: van,
    date: date,
    notice: notice || "",
    baseline: !previous,
    needs: needs,
    recount: recount,
    discrepancies: discrepancies,
    registration: registration,
    notes: notes,
    big: needs.filter(function (row) { return row.big; })
  };
}

function officeStock_(log, section, item) {
  var totals = {};
  LOCATIONS.forEach(function (name) { totals[name] = 0; });
  log.forEach(function (row) {
    if (itemKey_(row.section, row.item) !== itemKey_(section, item)) return;
    if (row.action !== "ADD" && row.action !== "TAKE") return;
    var delta = row.action === "ADD" ? Number(row.qty) : -Number(row.qty);
    if (!isFinite(delta)) return;
    totals[row.location] = (totals[row.location] || 0) + delta;
  });
  return totals;
}

function suggestSource_(need, brooklyn, hq) {
  if (brooklyn >= need && hq >= need) return brooklyn >= hq ? "Brooklyn" : "HQ";
  if (brooklyn >= need) return "Brooklyn";
  if (hq >= need) return "HQ";
  if (brooklyn + hq >= need) return "Split";
  return "Order";
}

function isBigMissing_(item, listed, actual) {
  if (actual !== 0) return false;
  if (Number(listed) === 1) return true;
  return /machine|camera|locator|drill|grinder|pipe cutter|bolt cutter/i.test(item || "");
}

function inferStatus_(row) {
  if (row.status) return row.status;
  if (row.actual == null || !isFinite(Number(row.actual)) || !isFinite(Number(row.listed))) return "";
  if (Number(row.actual) < Number(row.listed)) return "Less";
  if (Number(row.actual) > Number(row.listed)) return "More";
  return "Exact";
}

function nyDateKey_(value) {
  if (!value) return "";
  var s = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  var parsed = new Date(s);
  if (isNaN(parsed.getTime())) return "";
  return Utilities.formatDate(parsed, "America/New_York", "yyyy-MM-dd");
}

function formatLongDate_(iso) {
  var parts = String(iso || "").split("-");
  if (parts.length < 3) return String(iso || "");
  var date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 17, 0, 0));
  return Utilities.formatDate(date, "America/New_York", "MMM d, yyyy");
}

function esc_(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sendChecklistEmail_(report) {
  var to = NOTIFY_EMAILS.filter(function (email) { return text_(email); }).join(",");
  if (!to) throw new Error("NOTIFY_EMAILS is empty.");
  var when = formatLongDate_(report.date);
  var subject = "Van " + report.van + " needs " + report.needs.length + " items — " + report.mechanic + " — " + when;
  var link = "https://powerrooter.github.io/stock/?van=" + encodeURIComponent(report.van);
  var html = [];
  html.push('<div style="font-family:sans-serif;color:#1b3a4b;font-size:16px;line-height:1.4;max-width:640px">');
  html.push("<p><b>" + esc_(report.mechanic) + "</b> checked van <b>" + esc_(report.van) + "</b> on " + esc_(when) + ".</p>");
  var split = splitNeeds_(report.needs);
  html.push("<p>Short " + split.items + " items, " + split.pieces + " pieces total; another " + report.recount.length + " items need a recount.</p>");
  if (report.registration.length) {
    html.push('<p style="background:#fdeceb;padding:12px;border-radius:8px"><b>Registration or insurance card is missing:</b> ' +
      esc_(report.registration.map(function (row) { return row.item; }).join(", ")) + ".</p>");
  }
  if (report.notice) html.push('<p style="background:#fff4e5;padding:12px;border-radius:8px">' + esc_(report.notice) + "</p>");
  if (report.baseline) html.push("<p>First checklist for this van. This count is the baseline.</p>");
  html.push("<h2>Has none at all — " + split.noneItems + " items, " + split.nonePieces + " pieces</h2>");
  if (split.tools.length) {
    html.push("<h3>Big tools</h3><ul>");
    split.tools.forEach(function (row) { html.push("<li>" + needLine_(row, "none") + "</li>"); });
    html.push("</ul>");
  }
  html.push(groupedNeeds_(split.rest, "none"));
  html.push("<h2>Has some, but not enough — " + split.someItems + " items, " + split.somePieces + " pieces</h2>");
  html.push(groupedNeeds_(split.some, "some"));
  html.push("<h2>No count entered, recount</h2>");
  if (!report.recount.length) html.push("<p>Every short item has a count.</p>");
  else {
    html.push("<ul>");
    report.recount.forEach(function (row) {
      html.push("<li>" + esc_(row.item) + ": count missing, recount (listed " + (row.listed == null ? "?" : row.listed) + ")" +
        (row.note ? " — " + esc_(row.note) : "") + "</li>");
    });
    html.push("</ul>");
  }
  html.push("<h2>Discrepancies</h2>");
  if (report.baseline) html.push("<p>No earlier checklist to compare.</p>");
  else if (!report.discrepancies.length) html.push("<p>The new count matches the last checklist plus what this van took from the office.</p>");
  else {
    html.push("<ul>");
    report.discrepancies.forEach(function (row) {
      var sentence = row.direction === "below"
        ? "Has " + row.actual + ", expected " + row.expected + ". Lost, used, or not logged."
        : "Has " + row.actual + ", expected " + row.expected + ". More than the office logged.";
      html.push("<li>" + esc_(row.item) + ": " + sentence + "</li>");
    });
    html.push("</ul>");
  }
  if (report.notes.length) {
    html.push("<h2>Notes from " + esc_(report.mechanic) + "</h2><ul>");
    report.notes.forEach(function (row) {
      html.push("<li>" + esc_(row.item) + ": " + esc_(row.note) + "</li>");
    });
    html.push("</ul>");
  }
  html.push('<p><a href="' + link + '">Open this van on the stock page</a></p>');
  html.push("</div>");
  var plain = [
    report.mechanic + " checked van " + report.van + " on " + when + ".",
    "Short " + split.items + " items, " + split.pieces + " pieces total; another " + report.recount.length + " items need a recount.",
    "Has none at all — " + split.noneItems + " items, " + split.nonePieces + " pieces.",
    "Has some, but not enough — " + split.someItems + " items, " + split.somePieces + " pieces."
  ];
  split.some.forEach(function (row) {
    plain.push(row.item + ": has " + row.actual + " of " + row.listed + ", needs " + row.need);
  });
  plain.push("", "Stock page: " + link);
  MailApp.sendEmail({
    to: to,
    subject: subject,
    htmlBody: html.join(""),
    body: plain.filter(function (line) { return line != null; }).join("\n")
  });
}

function splitNeeds_(needs) {
  var none = [];
  var some = [];
  var pieces = 0;
  (needs || []).forEach(function (row) {
    pieces += Number(row.need) || 0;
    if (row.actual === 0) none.push(row);
    else if (row.actual > 0 && row.listed != null && row.actual < row.listed) some.push(row);
  });
  var tools = none.filter(isBigTool_).sort(function (a, b) { return toolRank_(a.item) - toolRank_(b.item); });
  var rest = none.filter(function (row) { return !isBigTool_(row); });
  return {
    items: (needs || []).length,
    pieces: pieces,
    none: none,
    some: some,
    tools: tools,
    rest: rest,
    noneItems: none.length,
    nonePieces: pieceSum_(none),
    someItems: some.length,
    somePieces: pieceSum_(some)
  };
}

function pieceSum_(rows) {
  var total = 0;
  rows.forEach(function (row) { total += Number(row.need) || 0; });
  return total;
}

function isBigTool_(row) {
  if (Number(row.listed) !== 1 || row.actual !== 0) return false;
  return /machine|camera|locator|drill|grinder|cutter|sledgehammer|chisel|\bbar\b/i.test(row.item || "");
}

function toolRank_(item) {
  var name = String(item || "").toLowerCase();
  if (name.indexOf("machine") !== -1) return 0;
  if (name.indexOf("camera") !== -1) return 1;
  if (name.indexOf("locator") !== -1) return 2;
  if (name.indexOf("drill") !== -1) return 3;
  if (name.indexOf("grinder") !== -1) return 4;
  if (name.indexOf("cutter") !== -1) return 5;
  if (/\bbar\b/.test(name)) return 6;
  if (name.indexOf("sledgehammer") !== -1) return 7;
  if (name.indexOf("chisel") !== -1) return 8;
  return 9;
}

function needLine_(row, mode) {
  var stock = "Brooklyn " + row.brooklyn + ", HQ " + row.hq + ". " + row.source + ".";
  var main = mode === "some"
    ? esc_(row.item) + ": has " + row.actual + " of " + row.listed + ", needs " + row.need
    : esc_(row.item) + " — need " + row.need;
  return main + ". " + stock + (row.note ? " " + esc_(row.note) : "");
}

function groupedNeeds_(rows, mode) {
  if (!rows.length) return "";
  var order = ["300 Machine & Tools", "Hand Machine & Tools", "100 Machine", "Toilet", "Camera & Tools", "Air Tank", "Water Testing", "Drill", "Tubular Piping", "Caps", "Couplings & Elbows", "Miscellaneous", "Registration & Insurance"];
  var sorted = rows.slice().sort(function (a, b) {
    var ai = order.indexOf(a.section); if (ai < 0) ai = 99;
    var bi = order.indexOf(b.section); if (bi < 0) bi = 99;
    if (ai !== bi) return ai - bi;
    return a.item < b.item ? -1 : 1;
  });
  var html = [];
  var last = "";
  sorted.forEach(function (row) {
    if (row.section !== last) {
      if (last) html.push("</ul>");
      last = row.section;
      html.push("<h3>" + esc_(row.section || "Other") + "</h3><ul>");
    }
    html.push("<li>" + needLine_(row, mode) + "</li>");
  });
  if (last) html.push("</ul>");
  return html.join("");
}

function needsTable_(needs) {
  if (!needs.length) return "<p>Nothing short with a known count.</p>";
  var html = ['<table style="width:100%;border-collapse:collapse;font-size:16px">'];
  var last = "";
  needs.forEach(function (row) {
    if (row.section !== last) {
      last = row.section;
      html.push('<tr><td colspan="2" style="padding:12px 0 4px;font-weight:700">' + esc_(row.section || "Other") + "</td></tr>");
    }
    html.push('<tr><td style="padding:8px 8px 8px 0;vertical-align:top">' + esc_(row.item) +
      (row.note ? '<br><span style="color:#5c6b73">' + esc_(row.note) + "</span>" : "") +
      '</td><td style="padding:8px 0;vertical-align:top;white-space:nowrap">Need ' + row.need +
      "<br>Brooklyn " + row.brooklyn + " · HQ " + row.hq +
      "<br>" + esc_(row.source) + "</td></tr>");
  });
  html.push("</table>");
  return html.join("");
}

function addItem_(data) {
  assertPin_(data.pin);
  var name = text_(data.item || data.name);
  var section = text_(data.section || data.category);
  if (!name) return { ok: false, error: "Enter the item name." };
  if (!section) return { ok: false, error: "Choose a category." };
  if (name.length > 120) return { ok: false, error: "Item name is too long." };
  if (section.length > 80) return { ok: false, error: "Category name is too long." };
  var listed = wholeQty_(data.qty == null ? data.listed : data.qty, true, false);
  if (listed.error) return { ok: false, error: listed.error };
  var brooklyn = wholeQty_(data.brooklyn, true, true);
  if (brooklyn.error) return { ok: false, error: "Brooklyn: " + brooklyn.error };
  var hq = wholeQty_(data.hq, true, true);
  if (hq.error) return { ok: false, error: "Power HQ: " + hq.error };
  var note = text_(data.note);
  if (note.length > 300) return { ok: false, error: "Note is too long." };
  if (findItemRow_(section, name)) return { ok: false, error: "That item is already in " + section + "." };
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ITEMS);
  ensureHeaders_(sheet, ITEM_HEADERS);
  appendByHeaders_(sheet, {
    "section": section,
    "item": name,
    "listed qty": listed.value,
    "retired": ""
  });
  logStartingStock_(section, name, "Power Brooklyn", brooklyn.value, note);
  logStartingStock_(section, name, "Power HQ", hq.value, note);
  return { ok: true };
}

function editItem_(data) {
  assertPin_(data.pin);
  var fromSection = text_(data.fromSection || data.section);
  var fromItem = text_(data.fromItem || data.item);
  var name = text_(data.item || data.name);
  var section = text_(data.section || data.category);
  if (!fromItem || !name) return { ok: false, error: "Enter the item name." };
  if (!section) return { ok: false, error: "Choose a category." };
  var listed = wholeQty_(data.qty == null ? data.listed : data.qty, true, false);
  if (listed.error) return { ok: false, error: listed.error };
  var found = findItemRow_(fromSection, fromItem);
  if (!found) return { ok: false, error: "That item is not on the list." };
  var duplicate = findItemRow_(section, name);
  if (duplicate && duplicate.row !== found.row) return { ok: false, error: "That item is already in " + section + "." };
  setItemCell_(found, "section", section);
  setItemCell_(found, "item", name);
  setItemCell_(found, "listed qty", listed.value);
  if (fromSection !== section || fromItem !== name) renameItemHistory_(fromSection, fromItem, section, name);
  return { ok: true };
}

function retireItem_(data) {
  assertPin_(data.pin);
  var found = findItemRow_(data.section, data.item);
  if (!found) return { ok: false, error: "That item is not on the list." };
  var hide = !(data.retired === false || String(data.retired || "").toLowerCase() === "no" || String(data.retired || "") === "0");
  setItemCell_(found, "retired", hide ? "yes" : "");
  return { ok: true, retired: hide };
}

function wholeQty_(value, allowZero, allowBlank) {
  if (value === "" || value == null) {
    if (allowBlank) return { value: null };
    return { error: "Enter a whole number. Use 0 if this item stays in the office and is not on the van checklist." };
  }
  var n;
  if (typeof value === "number") n = value;
  else {
    var s = String(value).trim();
    if (!/^\d+$/.test(s)) return { error: "Enter a whole number. Use 0 if this item stays in the office and is not on the van checklist." };
    n = parseInt(s, 10);
  }
  if (!isFinite(n) || Math.floor(n) !== n || n < 0 || n > 100000) {
    return { error: "Enter a whole number. Use 0 if this item stays in the office and is not on the van checklist." };
  }
  if (n === 0 && !allowZero && !allowBlank) return { error: "Enter a quantity greater than zero." };
  return { value: n };
}

function findItemRow_(section, item) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ITEMS);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var values = sheet.getDataRange().getValues();
  var map = {};
  values[0].forEach(function (header, index) { map[String(header || "").trim().toLowerCase()] = index; });
  var wantS = text_(section).toLowerCase();
  var wantI = text_(item).toLowerCase();
  for (var i = 1; i < values.length; i++) {
    var gotS = text_(cell_(values[i], map, "section")).toLowerCase();
    var gotI = text_(cell_(values[i], map, "item")).toLowerCase();
    if (gotS === wantS && gotI === wantI) return { sheet: sheet, row: i + 1, map: map };
  }
  return null;
}

function setItemCell_(found, header, value) {
  ensureHeaders_(found.sheet, ITEM_HEADERS);
  var headers = found.sheet.getRange(1, 1, 1, found.sheet.getLastColumn()).getValues()[0];
  var col = -1;
  headers.forEach(function (name, index) {
    if (String(name || "").trim().toLowerCase() === header) col = index + 1;
  });
  if (col < 1) return;
  found.sheet.getRange(found.row, col).setValue(value);
}

function appendByHeaders_(sheet, fields) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var line = [];
  for (var c = 0; c < width; c++) line.push("");
  headers.forEach(function (header, index) {
    var key = String(header || "").trim().toLowerCase();
    if (fields[key] != null) line[index] = fields[key];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, width).setValues([line]);
}

function logStartingStock_(section, item, location, qty, note) {
  if (qty == null || qty === 0) return;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_LOG);
  sheet.appendRow([
    new Date(),
    "ADD",
    item,
    section,
    qty,
    "Office",
    "",
    textCell_(note || "Starting stock"),
    location
  ]);
}

function renameItemHistory_(fromSection, fromItem, toSection, toItem) {
  renameSheetItems_(SHEET_LOG, "section", "item", fromSection, fromItem, toSection, toItem);
  renameSheetItems_(SHEET_VANS, "section", "item", fromSection, fromItem, toSection, toItem);
}

function renameSheetItems_(sheetName, sectionHeader, itemHeader, fromSection, fromItem, toSection, toItem) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return;
  var values = sheet.getDataRange().getValues();
  var map = {};
  values[0].forEach(function (header, index) { map[String(header || "").trim().toLowerCase()] = index; });
  var sectionCol = map[sectionHeader];
  var itemCol = map[itemHeader];
  if (sectionCol == null || itemCol == null) return;
  for (var i = 1; i < values.length; i++) {
    if (text_(values[i][sectionCol]) === fromSection && text_(values[i][itemCol]) === fromItem) {
      sheet.getRange(i + 1, sectionCol + 1).setValue(toSection);
      sheet.getRange(i + 1, itemCol + 1).setValue(toItem);
    }
  }
}
