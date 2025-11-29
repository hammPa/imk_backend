const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({
    credential: admin.credential.cert(
        require(path.join(__dirname, "..", "trendscope-f4d8a-firebase-adminsdk-fbsvc-0c0a4ae189.json"))
    ),
});

module.exports = admin;