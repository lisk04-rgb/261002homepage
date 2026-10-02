import type { NextConfig } from "next";

// 플랫폼 전용 기능(Vercel 이미지 최적화 설정 등)을 쓰지 않아 Netlify로도 그대로 옮길 수 있다.
const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
