# QR Code Attendance System

A Telegram bot for QR-based attendance. A volunteer sends a photo of a
student's IITK ID card; the bot decodes the QR code on the card, extracts
the roll number, checks it's in the registered range (240001–240400), and
marks the student present in a local JSON store. Duplicate scans are
detected and reported with the original timestamp.

## How it works

- `qr.js` — reads an image with `jimp` and decodes any QR code in it with `jsqr`.
- `parser.js` — pulls a 6-digit roll number out of the raw QR string and checks it against the registered range.
- `attendance.js` — a tiny JSON-file-backed store: marks students present and reports stats.
- `bot.js` — the Telegram bot itself: wires the above together, handles `/start`, `/report`, and the bonus `/export` (CSV).

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your bot token:
   ```
   cp .env.example .env
   ```
   Get a token by messaging [@BotFather](https://t.me/BotFather) on Telegram and creating a new bot.

## Running

```
node bot.js
```

The bot starts in polling mode. In Telegram:

- Send `/start` for a welcome message.
- Send a photo of an ID card to mark that student present.
- Send `/report` to see the total count and list of roll numbers marked present.
- Send `/export` to receive a CSV file of `RollNumber,Timestamp` for everyone marked present.

## Notes

- `attendance.json` is created automatically on first run and is *not* committed to git.
- The roll number comment at the top of `parser.js` must be replaced with your own scanned QR string before submission — see the TODO there.
