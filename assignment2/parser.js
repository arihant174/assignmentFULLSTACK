/**
 * RAW QR STRING — RESEARCH (MANDATORY)
 * ------------------------------------
 * TODO: Scan your own IITK ID card with any QR scanner app (your phone's
 * camera app usually works) and paste the EXACT raw string it gives you
 * below, replacing the placeholder. Then note where the roll number sits
 * inside that string so the regex logic below makes sense for your input.
 *
 * Raw string from my ID card:
 *   "REPLACE_WITH_YOUR_OWN_RAW_QR_STRING"
 *
 * Where the roll number is in the string:
 *   <describe its position/format here once you've scanned your own card>
 */

/**
 * Extracts a registered roll number from a raw QR string.
 *
 * Finds every run of exactly 6 digits in the string, then returns the
 * first one that falls inside the registered range (240001–240400).
 *
 * @param {string} qrString
 * @returns {string|null} the roll number as a string, or null if none match
 */
function extractRollNumber(qrString) {
  const matches = qrString.match(/\d{6}/g);
  if (!matches) return null;

  const valid = matches.find((candidate) => isRegistered(candidate));
  return valid || null;
}

/**
 * Checks whether a roll number is within the registered range.
 *
 * @param {string|number} rollNumber
 * @returns {boolean}
 */
function isRegistered(rollNumber) {
  const num = Number(rollNumber);
  return num >= 240001 && num <= 240400;
}

module.exports = { extractRollNumber, isRegistered };
