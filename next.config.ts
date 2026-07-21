import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Press email auto-linkers swallow the sentence's full stop into the
      // href, so /chilifest goes out as /chilifest. and 404s. Bounce it back.
      { source: "/chilifest.", destination: "/chilifest", permanent: true },
    ];
  },
};

export default nextConfig;
