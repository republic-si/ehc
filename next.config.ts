import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the committed coverage-report HTML is traced into the serverless
  // bundle for the dynamic /admin/coverage/[campaign] route (it's read via
  // fs at request time, which output-tracing won't detect on its own).
  outputFileTracingIncludes: {
    "/admin/coverage/[campaign]": ["./content/coverage/**"],
  },
};

export default nextConfig;
