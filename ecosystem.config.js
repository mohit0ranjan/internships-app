module.exports = {
  apps: [
    {
      name: 'internships-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max', // Scale across all available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
