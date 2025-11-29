// Backend/src/controllers/userAdminController.js
const admin = require("../firebaseAdmin");
const db = admin.firestore();

/**
 * GET /admin/users
 * Ambil semua user dari Firestore collection "users"
 */
exports.getUsers = async (req, res) => {
  try {
    const snap = await db.collection("users").get();
    const excluded = ["admin@gmail.com", "devops@gmail.com"];

    const list = snap.docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter(u => !excluded.includes(u.email));

    res.json(list);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /admin/users/update
 * Body: { uid, name, region, notifications }
 * Update profil user di Firestore
 */
exports.updateUser = async (req, res) => {
  try {
    const { uid, name, region, notifications } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required" });
    }

    const payload = {};
    if (name !== undefined) payload.name = name;
    if (region !== undefined) payload.region = region;
    if (notifications !== undefined) payload.notifications = notifications;

    await db.collection("users").doc(uid).update(payload);

    res.json({ success: true });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /admin/users/delete
 * Body: { uid }
 * Hapus user dari Firebase Auth + Firestore
 */
exports.deleteUser = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required" });
    }

    // Hapus dari Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Hapus dari Firestore
    await db.collection("users").doc(uid).delete();

    res.json({ success: true });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: err.message });
  }
};
