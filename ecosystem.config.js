module.exports = {
  apps: [
    {
      name: "qr_table_ordering_fe",
      script: "./node_modules/next/dist/bin/next", // Trỏ thẳng vào file chạy của Next.js
      args: "start", // Tham số kích hoạt dự án ở chế độ Production
      watch: false,
      env: {
        PORT: 3000, // Cấu hình cổng chạy ứng dụng tại đây
      },
    },
  ],
  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
