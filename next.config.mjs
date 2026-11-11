/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@electric-sql/pglite", "exceljs", "postgres"],
};
export default nextConfig;
