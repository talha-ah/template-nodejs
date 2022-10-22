module.exports.PERMISSIONS = {
  user: {
    routes: [
      {
        methods: ["GET", "POST"],
        regex: /organizations$/,
      },
    ],
    modules: {
      dashboard: {
        description: "Dashboard",
        options: ["overview"],
        settings: [],
      },
    },
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
    ],
    modules: {
      dashboard: {
        description: "Dashboard",
        options: ["overview", "users"],
        settings: [],
      },
      users: {
        description: "Users",
        options: ["users"],
        settings: [],
      },
    },
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
    modules: {
      dashboard: {
        description: "Dashboard",
        options: ["overview", "users"],
        settings: [],
      },
      users: {
        description: "Users",
        options: ["users"],
        settings: [],
      },
      organizations: {
        description: "Organizations",
        options: ["overview", "organizations"],
        settings: [],
      },
    },
  },
  generalRoutes: [
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
}
