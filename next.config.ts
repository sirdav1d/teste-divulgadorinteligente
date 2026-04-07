import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "static.netshoes.com.br",
      },
      {
        protocol: "https",
        hostname: "production.na01.natura.com",
        pathname: "/dw/image/**",
      },
      {
        protocol: "https",
        hostname: "divulgadorinteligente.com",
        pathname: "/cdn-cgi/imagedelivery/**",
      },
    ],
  },
};

export default nextConfig;
