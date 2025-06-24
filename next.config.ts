import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better error detection
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    domains: [
      "localhost",
      "lh3.googleusercontent.com", // For Google OAuth profile images
      "avatars.githubusercontent.com", // If using GitHub OAuth
      // Add your production domain here when deploying
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_APP_NAME: "NutroScan Pro",
  },

  // Experimental features (if needed)
  experimental: {
    // Enable server actions if you plan to use them
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Custom Webpack configuration (if needed for certain packages)
  webpack: (config) => {
    // Example: Handle canvas package for PDF generation
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      encoding: false,
    };
    return config;
  },

  // Redirect configuration
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.mixpanel.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: *.googleusercontent.com;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
