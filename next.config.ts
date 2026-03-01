import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 정적 사이트 배포를 위한 설정
  images: {
    unoptimized: true, // 정적 배포 시 이미지 최적화 비활성화 (Cloudflare용)
  },
  // 빌드 시 에러가 나더라도 배포를 진행하고 싶을 때 (선택 사항)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
