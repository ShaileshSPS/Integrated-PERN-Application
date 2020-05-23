const router = require("express").Router();
const authorize = require("../../middleware/jwtAuthorization");
const pool = require("../../db");

//get todos list
router.get("/", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT t.id, t.description FROM todos.todos  AS t LEFT JOIN users.users AS u ON u.id = t.user_id WHERE u.id = $1 ORDER BY t.id",
      [req.user.id]
    );

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//search todos list
router.get("/search", authorize, async (req, res) => {
  try {
    const { description } = req.query;

    const user = await pool.query(
      "SELECT t.id, t.description FROM todos.todos  AS t LEFT JOIN users.users AS u ON u.id = t.user_id WHERE u.id = $1 AND t.description ILIKE $2 ORDER BY t.id",
      [
        req.user.id,
        `%${description}%`
      ]
    );

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//create a todo
router.post("/", authorize, async (req, res) => {
  try {
    const { description } = req.body;
    if (description == '') {
      return res.json("Description is empty");
    } 
    const newTodo = await pool.query(
      "INSERT INTO todos.todos (user_id, description) VALUES ($1, $2) RETURNING *",
      [req.user.id, description]
    );
    
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo
router.put("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    
    const updateTodo = await pool.query(
      "UPDATE todos.todos SET description = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [description, id, req.user.id]
    );

    if (updateTodo.rows.length === 0) {
      return res.json("This todo is not yours");
    }

    res.json("Todo was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo
router.delete("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todos.todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (deleteTodo.rows.length === 0) {
      return res.json("This Todo is not yours");
    }

    res.json("Todo was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;