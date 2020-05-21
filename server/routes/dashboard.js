const router = require("express").Router();
const authorize = require("../middleware/jwtAuthorization");
const pool = require("../db");

router.get("/", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT name FROM users.users WHERE id = $1",
      [req.user.id] // payload data
    ); 
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;