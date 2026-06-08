/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://nage-eau-libre.vercel.app",
  generateRobotsTxt: true,
  outDir: "./out",
};
