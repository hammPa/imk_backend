const admin = require('firebase-admin');

const serviceAccountString = process.env.FIREBASE_ADMIN_CREDENTIAL;

// Cek apakah variable terbaca (Debugging)
if (!serviceAccountString) {
  throw new Error("Env variable FIREBASE_ADMIN_CREDENTIAL tidak ditemukan atau kosong!");
}

const serviceAccount = JSON.parse(serviceAccountString);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;