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
    modules: {
      Dashboard: {
        description: "Dashboard",
        options: [],
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
      {
        methods: ["ALL"],
        regex: /wallet/,
      },
    ],
    modules: {
      Dashboard: {
        description: "Dashboard",
        options: ["overview", "users"],
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
      Dashboard: {
        description: "Dashboard",
        options: ["overview", "users", "organizations"],
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
