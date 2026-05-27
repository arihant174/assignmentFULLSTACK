// ─────────────────────────────────────────────
// P1 — Student class
// ─────────────────────────────────────────────

class Student {
  // P1a — Constructor
  constructor(name, scores) {
    this.name = name;
    this.scores = scores;
  }

  // P1b — get average (uses a loop, no reduce)
  get average() {
    let total = 0;
    for (let i = 0; i < this.scores.length; i++) {
      total += this.scores[i];
    }
    return total / this.scores.length;
  }

  // P1c — get letterGrade
  // Grading scale:
  //   A  →  90–100
  //   B  →  80–89
  //   C  →  70–79
  //   D  →  60–69
  //   F  →  below 60
  get letterGrade() {
    const avg = this.average;
    if (avg >= 90) return "A";
    else if (avg >= 80) return "B";
    else if (avg >= 70) return "C";
    else if (avg >= 60) return "D";
    else return "F";
  }

  // P1d — summary(): returns { highest, lowest } without Math.max/min
  summary() {
    let highest = this.scores[0];
    let lowest = this.scores[0];
    for (let i = 1; i < this.scores.length; i++) {
      if (this.scores[i] > highest) highest = this.scores[i];
      if (this.scores[i] < lowest) lowest = this.scores[i];
    }
    return { highest, lowest };
  }
}

// ─────────────────────────────────────────────
// P3b — getRemark(grade) using switch
// ─────────────────────────────────────────────

function getRemark(grade) {
  switch (grade) {
    case "A": return "Outstanding!";
    case "B": return "Great job!";
    case "C": return "Good effort.";
    case "D": return "Needs improvement.";
    case "F": return "Please seek help.";
    default:  return "Unknown grade.";
  }
}

// ─────────────────────────────────────────────
// P3a — printReportCard(student)
// ─────────────────────────────────────────────

function printReportCard(student) {
  const avg = student.average;
  const grade = student.letterGrade;
  const { highest, lowest } = student.summary();

  // P3b — ternary for PASS / FAIL (≥60 is PASS)
  const status = avg >= 60 ? "PASS" : "FAIL";
  const remark = getRemark(grade);

  // P3c — destructure scores into score1, score2, ...remaining
  const [score1, score2, ...remaining] = student.scores;

  // P3a — template literals only (no + concatenation)
  console.log(`
============================
  REPORT CARD
============================
Name   : ${student.name}
Scores : ${student.scores.join(", ")}
Average: ${avg.toFixed(1)}
Grade  : ${grade}
Status : ${status}
Remark : ${remark}
High   : ${highest}  |  Low: ${lowest}
----------------------------
Score Breakdown:
  Score 1   : ${score1}
  Score 2   : ${score2}
  Remaining : ${remaining.length > 0 ? remaining.join(", ") : "none"}
============================
`);
}

// ─────────────────────────────────────────────
// P2 — CLI input
// ─────────────────────────────────────────────

function runCLI() {
  // P2a — parse argv
  const name = process.argv[2];
  const scores = process.argv.slice(3).map(Number);

  // P2b — validate: need at least 3 scores
  if (scores.length < 3) {
    console.error("Error: Please provide a name and at least 3 scores.");
    console.error("Usage: node student.js <name> <score1> <score2> <score3> ...");
    process.exit(1);
  }

  const student = new Student(name, scores);
  printReportCard(student);
}

// ─────────────────────────────────────────────
// BONUS — Multi-student mode
// Runs when a .json file path is passed as argv[2]
// Usage: node student.js students.json
// ─────────────────────────────────────────────

function runMultiStudent(filePath) {
  const fs = require("fs");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  let topStudent = null;
  let topAvg = -Infinity;

  for (let i = 0; i < data.length; i++) {
    const s = new Student(data[i].name, data[i].scores);
    printReportCard(s);
    if (s.average > topAvg) {
      topAvg = s.average;
      topStudent = s;
    }
  }

  console.log(`🏆 Top Performer: ${topStudent.name} with an average of ${topAvg.toFixed(1)}`);
}

// ─────────────────────────────────────────────
// Entry point — detect mode
// ─────────────────────────────────────────────

const firstArg = process.argv[2];

if (firstArg && firstArg.endsWith(".json")) {
  runMultiStudent(firstArg);       // BONUS mode
} else {
  runCLI();                        // Normal CLI mode
}
