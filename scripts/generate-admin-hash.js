#!/usr/bin/env node
/**
 * Generate ADMIN_PASSWORD_HASH for .env (with $ escaped for Next.js).
 * Usage: node scripts/generate-admin-hash.js [password]
 * Default password: Admin123!
 */
const bcrypt = require('bcryptjs');
const password = process.argv[2] || 'Admin123!';
const hash = bcrypt.hashSync(password, 10);
const envValue = hash.replace(/\$/g, '\\$');
console.log('\nAdd this to your .env file (Next.js requires \\$ so $ is not expanded):\n');
console.log('ADMIN_EMAIL=admin@cfwt.com');
console.log('ADMIN_PASSWORD_HASH=' + envValue);
console.log('\nThen sign in at /en/admin/login with that email and your password.\n');
