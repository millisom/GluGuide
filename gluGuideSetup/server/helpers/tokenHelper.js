const crypto = require('crypto');

function generateResetToken() {
  const token = crypto.randomBytes(20).toString('hex');
  const expiry = new Date(Date.now() + 3600000); // 1 hour from now
  return { token, expiry };
}

module.exports = { generateResetToken };
