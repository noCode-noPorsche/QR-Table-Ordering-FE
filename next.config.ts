import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.tsantriduc.io.vn',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      }
    ]
  }
}

const withNextIntl = createNextIntlPlugin()

//  Xuất cấu hình thông qua hàm để bypass kiểu dữ liệu nghiêm ngặt của Next.js 16
export default async function config() {
  // Chỉ khi nào biến ANALYZE bằng "true", hệ thống mới nạp gói Bundle Analyzer vào để tránh làm chậm tiến trình build thường
  if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
      enabled: true
    })

    // Bọc lồng cả Analyzer và NextIntl kế thừa cấu hình gốc
    return withBundleAnalyzer(withNextIntl(nextConfig))
  }

  // Chế độ build thường: Chỉ kích hoạt đa ngôn ngữ i18n
  return withNextIntl(nextConfig)
}
