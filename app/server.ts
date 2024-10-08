import express from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  ssl: {
    rejectUnauthorized: false,
  },
  port: parseInt(process.env.DB_PORT || "5432"),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  username: "asone_user",
  password: "Chelovek38!",
  database: "asone_db",
  synchronize: true,
  logging: true,
  entities: [User],
  // migrations: ["./migrations/**/*.ts"],
  // subscribers: ["./subscribers/**/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connected to database successfully");
    console.log(`🛢  Database: ${AppDataSource.options.database}`);

    app.get("/signin", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Sign In</title>
        </head>
        <body>
          <h1>Sign In</h1>
          <form action="/signin" method="POST">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="Name" required /><br/><br/>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Email" required /><br/><br/>
            <button type="submit">Sign In</button>
          </form>
        </body>
        </html>
      `);
    });

    app.post("/signin", async (req, res) => {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      try {
        const userRepository = AppDataSource.getRepository(User);
        const newUser = userRepository.create({ name, email });
        await userRepository.save(newUser);
        res.send(`
          <h1>Success!</h1>
          <p>User ${newUser.name} with email ${newUser.email} has been saved.</p>
          <a href="/signin">Sign In Another User</a>
        `);
      } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error saving user.");
      }
    });

    app.use("/auth", authRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`
🚀 Server is up and running!
🌐 http://localhost:${PORT}
⏰ ${new Date().toLocaleString()}
🛣  Available Routes:
   - /auth
   - /signin

👨‍💻 Happy coding!
      `);
    });
  })
  .catch((error) => {
    console.error("❌ TypeORM connection error: ", error);
    console.error("Connection options:", AppDataSource.options);
    process.exit(1);
  });

process.on("SIGINT", () => {
  console.log("👋 SIGINT signal received: closing HTTP server");
  AppDataSource.destroy().then(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM signal received: closing HTTP server");
  AppDataSource.destroy().then(() => process.exit(0));
});

export { AppDataSource };
