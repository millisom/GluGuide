function createPasswordResetMessage(resetLink) {
    return {
      subject: 'Password Reset Request',
      message: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
  Please click on the following link, or paste this into your browser to complete the process:\n\n
  ${resetLink}\n\n
  If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
  }
  
  module.exports = { createPasswordResetMessage };
  