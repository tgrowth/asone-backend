import express from "express";
import admin from "firebase-admin";
import { AppDataSource } from "../server.js";
import { User } from "../models/User.js";
import { hash } from "bcrypt";

const router = express.Router();

router.post("/signin", async (req, res) => {
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
            message: "Sign in successful",
            user,
        });
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ message: "Error signing in" });
    }
});

router.post("/signup", async (req, res) => {
    const { uid, name, email, password } = req.body;
    
    if (!uid || !name || !email || !password) {
        return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        const existingUser = await userRepository.findOne({ where: { uid } });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = hash(password, "sha256");

        const user = userRepository.create({ uid, name, email, password: hashedPassword });
        await userRepository.save(user);
    
        res.status(201).json({
            message: "Sign up successful",
            user,
        });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Error signing up" });
    }
});

router.post("/signout", async (req, res) => {
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
        await admin.auth().revokeRefreshTokens(token);
        res.status(200).json({ message: "Sign out successful" });
    } catch (error) {
        console.error("Error signing out:", error);
        res.status(500).json({ message: "Error signing out" });
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        // Send password reset email logic
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ message: "Error sending password reset email" });
    }
});

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = hash(newPassword, "sha256");
    
        user.password = hashedPassword;
        await userRepository.save(user);
    
        res.status(200).json({
            message: "Password reset successful",
            newPassword,
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
});

router.post("/verify-code", async (req, res) => {
    const { email, code } = req.body;
    
    if (!email || !code) {
        return res
        .status(400)
        .json({ message: "Email and code are required" });
    }
    
    try {
        // Verify code logic
        res.status(200).json({ message: "Code verified successfully" });
    } catch (error) {
        console.error("Error verifying code:", error);
        res.status(500).json({ message: "Error verifying code" });
    }
});

export default router;
