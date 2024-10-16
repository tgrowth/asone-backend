import express from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import authRoutes from "./routes/AuthRoutes.js";
import userInfoRoutes from "./routes/UserInfoRoutes.js";
import loveLanguagesRoutes from "./routes/LoveLanguagesRoutes.js";
import admin from "firebase-admin";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { UserInfo } from "./models/UserInfo.js";
import { LoveLanguagesResult } from "./models/LoveLanguagesResult.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(
    join(__dirname, "asone-app-firebase-adminsdk-ueegw-d42ccfd758.json"),
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AppDataSource = new DataSource({
  type: "postgres",
  host: "asone-postgres-db.cvgkuegmoles.us-east-1.rds.amazonaws.com",
  ssl: {
    rejectUnauthorized: false,
  },
  port: parseInt(process.env.DB_PORT || "5432"),
  username: "asone_user",
  password: "Chelovek38!",
  database: "asone_db",
  synchronize: true,
  logging: true,
  entities: [User, UserInfo, LoveLanguagesResult],
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connected to database successfully");

    app.post("/signin", async (req, res) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(400)
          .json({ message: "Authorization header is missing" });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res
          .status(400)
          .json({ message: "Token is missing from Authorization header" });
      }

      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { name, email } = decodedToken;

        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({ where: { email } });

        if (!user) {
          user = userRepository.create({ name, email });
          await userRepository.save(user);
        }

        res.status(200).json({
          message: "User authenticated and saved successfully",
          user,
        });
      } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(401).json({ message: "Authentication failed" });
      }
    });

    app.use("/auth", authRoutes);
    app.use("/userInfo", userInfoRoutes);
    app.use("/love_languages_results", loveLanguagesRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`
🚀 Server is up and running!
🌐 http://localhost:${PORT}
⏰ ${new Date().toLocaleString()}
🛣  Available Routes:
   - /auth
   - /signin (POST)

👨‍💻 Happy coding!
      `);
    });
  })
  .catch((error) => {
    console.error("❌ TypeORM connection error: ", error);
    process.exit(1);
  });

export { AppDataSource };
