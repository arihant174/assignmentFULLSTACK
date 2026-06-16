require('dotenv').config();

const fs = require('fs');
const os = require('os');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const { decodeQR } = require('./qr');
const { extractRollNumber, isRegistered } = require('./parser');
const { markPresent, getStats, getAllRecords } = require('./attendance');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN is missing. Add it to a .env file (see .env.example).');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'QR Attendance bot is online.\n\nSend a photo of a student ID card to mark them present.\nUse /report for current stats, or /export for a CSV.'
  );
});

bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  let tempPath;

  try {
    // msg.photo is an array of the same image at increasing resolutions —
    // the last entry is the highest resolution available.
    const photo = msg.photo[msg.photo.length - 1];
    tempPath = await bot.downloadFile(photo.file_id, os.tmpdir());

    const qrString = await decodeQR(tempPath);
    const rollNumber = extractRollNumber(qrString);

    if (!rollNumber) {
      bot.sendMessage(chatId, 'Could not find a valid roll number in that QR code.');
      return;
    }

    if (!isRegistered(rollNumber)) {
      bot.sendMessage(chatId, `Roll number ${rollNumber} is not in the registered range (240001–240400).`);
      return;
    }

    const result = markPresent(rollNumber);

    if (result.success) {
      bot.sendMessage(chatId, `Marked present: ${rollNumber}`);
    } else {
      bot.sendMessage(
        chatId,
        `${rollNumber} was already marked present at ${result.timestamp}.`
      );
    }
  } catch (err) {
    if (err.message === 'No QR code found') {
      bot.sendMessage(chatId, 'No QR code found in that image. Try a clearer, well-lit photo.');
    } else {
      console.error(err);
      bot.sendMessage(chatId, 'Something went wrong processing that image. Please try again.');
    }
  } finally {
    if (tempPath) {
      fs.unlink(tempPath, () => {});
    }
  }
});

bot.onText(/^\/report/, (msg) => {
  const { total, rollNumbers } = getStats();
  const list = rollNumbers.length ? rollNumbers.join('\n') : '(none yet)';
  bot.sendMessage(msg.chat.id, `Total present: ${total}\n\n${list}`);
});

// BONUS: CSV export. Built manually (no csv library) per the assignment.
bot.onText(/^\/export/, async (msg) => {
  const chatId = msg.chat.id;
  const records = getAllRecords();

  if (!records.length) {
    bot.sendMessage(chatId, 'No attendance data to export yet.');
    return;
  }

  const rows = records.map((r) => `${r.rollNumber},${r.timestamp}`);
  const csv = ['RollNumber,Timestamp', ...rows].join('\n');

  const tempCsvPath = path.join(os.tmpdir(), `attendance_${Date.now()}.csv`);
  fs.writeFileSync(tempCsvPath, csv);

  try {
    await bot.sendDocument(chatId, tempCsvPath);
  } finally {
    fs.unlink(tempCsvPath, () => {});
  }
});
