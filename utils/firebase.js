const admin = require("firebase-admin")

// Fetch the service account key JSON file contents
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS)

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

module.exports.firebase = admin.firestore()
