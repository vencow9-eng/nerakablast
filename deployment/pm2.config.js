module.exports = {
  apps: [
    {
      name: "rupiahblast-api",

      script: "./backend/src/server.js",

      cwd: "./",

      instances: 1,

      autorestart: true,

      watch: false,

      max_memory_restart: "1G",

      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },

    {
      name: "rupiahblast-worker",

      script: "./backend/src/queues/blast.worker.js",

      cwd: "./",

      instances: 1,

      autorestart: true,

      watch: false,

      env: {
        NODE_ENV: "production",
      },
    },
  ],
};