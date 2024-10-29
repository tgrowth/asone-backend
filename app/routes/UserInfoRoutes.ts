import express from "express";
import { AppDataSource } from "../server.js";
import { User } from "../models/User.js";
import { UserInfo } from "../models/UserInfo.js";

const router = express.Router();  

router.post("/", async (req, res) => {
  const uid = req.body.uid;
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    let userInfo = await userInfoRepository.findOne({ where: { uid: uid } });

    if (!userInfo) {
      userInfo = new UserInfo();
      Object.assign(userInfo, req.body);
      userInfo.uid = uid;
    } else {
      Object.assign(userInfo, req.body);
    }

    userInfo = await userInfoRepository.save(userInfo);
    res.status(201).json({ userInfo });
  } catch (error) {
    console.error("Error creating user info:", error);
    res.status(500).json({ message: "Error creating user info" });
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

router.delete("/:id", async (req, res) => {
  const userInfoId = parseInt(req.params.id);
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    const userInfo = await userInfoRepository.findOne({ where: { id: userInfoId } });
    if (!userInfo) {
      return res.status(404).json({ message: "User info not found" });
    }

    await userInfoRepository.remove(userInfo);
    res.status(200).json({ message: "User info deleted successfully" });
  } catch (error) {
    console.error("Error deleting user info:", error);
    res.status(500).json({ message: "Error deleting user info" });
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

router.post("/:uid/symptoms/:symptomId", async (req, res) => {
  const userId = req.params.uid;
  const symptomId = parseInt(req.params.symptomId);
  const userInfoRepository = AppDataSource.getRepository(UserInfo);

  try {
    const userInfo = await userInfoRepository.findOne({
      where: { user: { uid: userId } },
    });

    if (!userInfo) {
      return res.status(404).json({ message: "User info not found" });
    }

    userInfo.symptoms = [...userInfo.symptoms, symptomId];
    await userInfoRepository.save(userInfo);

    res.status(200).json({ message: "Symptom added to user info", userInfo });
  } catch (error) {
    console.error("Error adding symptom to user info:", error);
    res.status(500).json({ message: "Error adding symptom to user info" });
  }
});

export default router;
