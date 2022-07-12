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
    admin: [
      "profile",
      "services",
      "jobs",
      "notifications",
      "users",
      "organizations",
    ],
    superadmin: [
      "profile",
      "services",
      "jobs",
      "notifications",
      "users",
      "organizations",
    ],
  },
}
