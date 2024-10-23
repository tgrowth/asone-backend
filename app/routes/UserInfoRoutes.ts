import express from "express";
import { AppDataSource } from "../server.js";
import { User } from "../models/User.js";
import { UserInfo } from "../models/UserInfo.js";

const router = express.Router();  

router.post("/:uid", async (req, res) => {
  const userId = req.params.uid;
  const userRepository = AppDataSource.getRepository(User);
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    const user = await userRepository.findOne({ where: { uid: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let userInfo = await userInfoRepository.findOne({
      where: { user: { uid: userId } },
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

router.get("/:uid", async (req, res) => {
  const userId = req.params.uid;
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    const userInfo = await userInfoRepository.findOne({
      where: { uid: userId },
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
    const userInfos = await userInfoRepository.find();
    res.status(200).json({ userInfos });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ message: "Error retrieving user info" });
  }
});

export default router;
