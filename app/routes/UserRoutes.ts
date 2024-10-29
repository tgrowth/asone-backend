import express from "express";
import { AppDataSource } from "../server.js";
import { User } from "../models/User.js";
import { UserInfo } from "../models/UserInfo.js";

const router = express.Router();  

router.get("/:uid", async (req, res) => {
    const uid = req.params.uid;

    const userRepository = AppDataSource.getRepository(User);
    
    try {
        const user = await userRepository.findOne({ where: { uid: uid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

router.get("/:uid/isComplete", async (req, res) => {
    const uid = req.params.uid;

    const userRepository = AppDataSource.getRepository(UserInfo);
    
    try {
        const user = await userRepository.findOne({ where: { uid: uid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ isComplete: user.isComplete });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

router.get("/", async (req, res) => {
    const userRepository = AppDataSource.getRepository(User);
    
    try {
        const users = await userRepository.find();
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

router.delete("/:uid", async (req, res) => {
    const uid = req.params.uid;

    const userInfoRepository = AppDataSource.getRepository(UserInfo);
    const userRepository = AppDataSource.getRepository(User);

    try {
        const userInfo = await userInfoRepository.findOne({ where: { uid: uid } });
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = await userRepository.findOne({ where: { uid: uid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await userInfoRepository.remove(userInfo);
        await userRepository.remove(user);

        res.status(204).json({ message: "User deleted: " + uid });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});

export default router;
