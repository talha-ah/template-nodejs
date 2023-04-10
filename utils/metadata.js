module.exports.PERMISSIONS = {
  user: {
    routes: [
      {
        methods: ["GET", "POST"],
        regex: /organizations$|metadata$/,
      },
      {
        methods: ["GET", "POST"],
        regex: /wallet/,
      },
    ],
  },
  admin: {
    routes: [
      {
        methods: ["ALL"],
        regex: /organizations/,
      },
      {
        methods: ["ALL"],
        regex: /analytics/,
      },
      {
        methods: ["ALL"],
        regex: /invites/,
      },
      {
        methods: ["ALL"],
        regex: /wallet/,
      },
    ],
  },
  superadmin: {
    routes: [
      {
        methods: ["ALL"],
        regex: /organizations/,
      },
      {
        methods: ["ALL"],
        regex: /analytics/,
      },
      {
        methods: ["ALL"],
        regex: /users/,
      },
      {
        methods: ["ALL"],
        regex: /invites/,
      },
    ],
  },
  general: {
    routes: [
      {
        methods: ["ALL"],
        regex: /auth/,
      },
      {
        methods: ["ALL"],
        regex: /profile/,
      },
      {
        methods: ["ALL"],
        regex: /notifications/,
      },
      {
        methods: ["ALL"],
        regex: /upload/,
      },
    ],
  },
  permissions: {
    Dashboard: {
      permission: "hidden",
      description: "Dashboard",
      modules: {
        Users: "hidden",
        Overview: "hidden",
      },
      settings: {
        Wallet: "hidden",
        Profile: "hidden",
        Organization: "hidden",
        Notifications: "hidden",
      },
      // Will not be in the DB, but will be used to check if the user has access to the route
      routes: {
        Users: ["users"],
        Overview: ["overview"],
        Wallet: ["wallet"],
        Profile: ["profile"],
        Organization: ["organization"],
        Notifications: ["notifications"],
      },
    },
  },
}
