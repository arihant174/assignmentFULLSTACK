const Jimp = require('jimp');
const jsQR = require('jsqr');

/**
 * Decodes the QR code found in an image file.
 *
 * jimp gives us the raw pixel data of the image; jsqr scans those pixels
 * looking for a QR pattern and, if it finds one, decodes it back into text.
 *
 * @param {string} imagePath - path to an image containing a QR code
 * @returns {Promise<string>} the raw string encoded in the QR code
 * @throws {Error} 'No QR code found' if jsqr can't locate a QR code
 */
async function decodeQR(imagePath) {
  const image = await Jimp.read(imagePath);
  const { data, width, height } = image.bitmap;

  const result = jsQR(data, width, height);

  if (!result) {
    throw new Error('No QR code found');
  }

  return result.data;
}

// Standalone test: `node qr.js path/to/your/id-card.jpg`
if (require.main === module) {
  const testImagePath = process.argv[2];

  if (!testImagePath) {
    console.log('Usage: node qr.js <path-to-image>');
    process.exit(1);
  }

  decodeQR(testImagePath)
    .then((qrString) => {
      console.log('Decoded QR string:');
      console.log(qrString);
    })
    .catch((err) => {
      console.error('Error:', err.message);
    });
}

module.exports = { decodeQR };
