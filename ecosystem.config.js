module.exports = {
  apps: [
    {
      name: "fintrack-backend",
      script: "npm",
      args: "run dev",
      cwd: "./backend",
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "fintrack-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      env: {
        NODE_ENV: "development",
        PORT: 3000
      }
    }
  ]
};
