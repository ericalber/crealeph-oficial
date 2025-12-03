/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/resources/blog/",
        destination: "/resources/blog",
        permanent: true, // 308
      },
      {
        source: "/modules/",
        destination: "/modules",
        permanent: true, // 308
      },
      {
        source: "/services/paid-media",
        destination: "/services/marketing/paid",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    // Allow importing Markdown files as raw strings (edge-safe rendering)
    config.module.rules.push({ test: /\.md$/, type: "asset/source" });
    return config;
  },
};

export default nextConfig;
