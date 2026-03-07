const withNextIntl = require('next-intl/plugin')('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = withNextIntl(nextConfig);
