const pool = require("./config/db");

const makeAdmin = async (username) => {
  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userCheck.rows.length === 0) {
      console.log(`User "${username}" was not found.`);
      process.exit(1);
    }

    if (userCheck.rows[0].is_admin) {
      console.log(`User "${username}" is already an admin!`);
      process.exit(0);
    }

    await pool.query("UPDATE users SET is_admin = true WHERE username = $1", [
      username,
    ]);
    console.log(`Successfully made "${username}" an admin!`);
  } catch (error) {
    console.error("Error making user admin: ", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

const username = process.argv[2];
if (!username) {
  console.log(
    "Please provide a username clearly. Usage: node makeAdmin.js username_here"
  );
  process.exit(1);
}

makeAdmin(username);
