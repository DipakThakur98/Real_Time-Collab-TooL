const crypto = require('crypto');

// Generate a secret specific to this server startup run
// This mixes the static secret in .env with a random key so that restarts invalidate all previous JWTs
const baseSecret = process.env.JWT_SECRET || 'collab_tool_default_secret_key_123456';
const JWT_SECRET = baseSecret + '_' + crypto.randomBytes(16).toString('hex');

module.exports = {
    JWT_SECRET
};
