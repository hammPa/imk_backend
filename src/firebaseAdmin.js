const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({
    credential: admin.credential.cert(
        require(path.join(__dirname, "..", process.env.FIREBASE_ADMIN_CREDENTIAL))
    ),
});

module.exports = admin;