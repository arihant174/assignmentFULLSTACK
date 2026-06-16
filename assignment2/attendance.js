const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'attendance.json');

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


function getStats() {
  const rollNumbers = Object.keys(store).sort();
  return { total: rollNumbers.length, rollNumbers };
}


function getAllRecords() {
  return Object.keys(store)
    .sort()
    .map((rollNumber) => ({ rollNumber, timestamp: store[rollNumber] }));
}

module.exports = { markPresent, getStats, getAllRecords };
