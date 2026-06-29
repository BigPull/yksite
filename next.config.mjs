/** @type {import('next').NextConfig} */
const nextConfig = {
  // Erzeugt einen minimalen, self-contained Server-Build für Docker.
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    // Erlaubt das Lesen von Dateien aus dem Upload-Volume zur Laufzeit.
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
};

export default nextConfig;
