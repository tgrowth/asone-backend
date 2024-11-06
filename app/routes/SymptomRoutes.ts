import express from "express";
import { AppDataSource } from "../server.js";
import { Symptom } from "../models/Symptom.js";
import { SymptomLog } from "../models/SymptomLog.js";

const router = express.Router();  

// Get all symptoms
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

// Create a new symptom
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

router.post("/symptom_logs", async (req, res) => {
    const symptomRepository = AppDataSource.getRepository(SymptomLog);

    try {
        const symptomLog = symptomRepository.create(req.body);
        await symptomRepository.save(symptomLog);
        res.status(201).json({ symptomLog });
    } catch (error) {
        console.error("Error creating symptom log:", error);
        res.status(500).json({ message: "Error creating symptom log" });
    }
});

export default router;
