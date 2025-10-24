module.exports = {
  apps: [
    {
      name: "socialid-prod",
      script: "npm",
      args: "start",
      cwd: "/home/adminios/htdocs/socialid.one",
      env: {
        NODE_ENV: "production",
        PORT: "3004"
      }
    }
  ]
}
