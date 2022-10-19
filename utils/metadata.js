module.exports = {
  permissions: {
    user: [
      "profile",
      "services",
      "organizations",
      "jobs",
      "notifications",
      "upload",
    ],
    admin: ["profile", "notifications", "organizations"],
    superadmin: ["users", "profile", "notifications", "organizations"],
  },
}
