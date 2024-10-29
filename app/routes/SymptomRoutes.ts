import express from "express";
import { AppDataSource } from "../server.js";
import { Symptom } from "../models/Symptom.js";

const router = express.Router();  

router.get("/", async (req, res) => {
    const symptomRepository = AppDataSource.getRepository(Symptom);
    
    try {
        const symptoms = await symptomRepository.find();
        res.status(200).json({ symptoms });
    } catch (error) {
        console.error("Error fetching symptoms:", error);
        res.status(500).json({ message: "Error fetching symptoms" });
    }
});

router.post("/", async (req, res) => {
    const symptomRepository = AppDataSource.getRepository(Symptom);
    
    try {
        const symptom = symptomRepository.create(req.body);
        await symptomRepository.save(symptom);
        res.status(201).json({ symptom });
    } catch (error) {
        console.error("Error creating symptom:", error);
        res.status(500).json({ message: "Error creating symptom" });
    }
});

export default router;
