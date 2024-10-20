import express from "express";
import { AppDataSource } from "../server.js";
import { User } from "../models/User.js";
import { UserInfo } from "../models/UserInfo.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const userRepository = AppDataSource.getRepository(User);
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let userInfo = await userInfoRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!userInfo) {
      const newUserInfo = new UserInfo();
      Object.assign(newUserInfo, req.body);
      newUserInfo.user = Promise.resolve(user);
      userInfo = await userInfoRepository.save(newUserInfo);
    } else {
      userInfoRepository.merge(userInfo, req.body);
      userInfo = await userInfoRepository.save(userInfo);
    }

    res.status(200).json({ message: "User info saved successfully", userInfo });
  } catch (error) {
    console.error("Error saving user info:", error);
    res.status(500).json({ message: "Error saving user info" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const userRepository = AppDataSource.getRepository(User);
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userInfo = await userInfoRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!userInfo) {
      return res.status(404).json({ message: "User info not found" });
    }

    res.status(200).json({ userInfo });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ message: "Error retrieving user info" });
  }
});

router.get("/", async (req, res) => {
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    const users = await userInfoRepository.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ message: "Error retrieving user info" });
  }
});

export default router;
