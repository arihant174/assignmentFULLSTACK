const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'attendance.json');

// Loaded once at module load time, kept in memory, and re-written to disk
// on every write so the JSON file always reflects current state.
let store = {};
try {
  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  store = JSON.parse(raw);
} catch (err) {
  store = {};
}

function save() {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

/**
 * Marks a roll number present. No-ops (without overwriting) if the roll
 * number was already marked, returning the original timestamp instead.
 *
 * @param {string} rollNumber
 * @returns {{success: boolean, reason?: string, timestamp?: string}}
 */
function markPresent(rollNumber) {
  if (store[rollNumber]) {
    return {
      success: false,
      reason: 'already_marked',
      timestamp: store[rollNumber],
    };
  }

  store[rollNumber] = new Date().toISOString();
  save();

  return { success: true };
}

/**
 * @returns {{total: number, rollNumbers: string[]}}
 */
function getStats() {
  const rollNumbers = Object.keys(store).sort();
  return { total: rollNumbers.length, rollNumbers };
}

/**
 * Returns every record as { rollNumber, timestamp } pairs, sorted by roll
 * number. Used for the /export CSV bonus feature.
 *
 * @returns {{rollNumber: string, timestamp: string}[]}
 */
function getAllRecords() {
  return Object.keys(store)
    .sort()
    .map((rollNumber) => ({ rollNumber, timestamp: store[rollNumber] }));
}

module.exports = { markPresent, getStats, getAllRecords };
