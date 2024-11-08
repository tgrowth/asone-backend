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
// router.post("/", async (req, res) => {
//     const symptomRepository = AppDataSource.getRepository(Symptom);
    
//     try {
//         const symptom = symptomRepository.create(req.body);
//         await symptomRepository.save(symptom);
//         res.status(201).json({ symptom });
//     } catch (error) {
//         console.error("Error creating symptom:", error);
//         res.status(500).json({ message: "Error creating symptom" });
//     }
// });

router.post("/", async (req, res) => {
    const { uid, symptoms, date } = req.body.symptomLog;
    const symptomRepository = AppDataSource.getRepository(SymptomLog);

    try {
        const existingSymptomLog = await symptomRepository.findOne({ where: { uid: uid, date: date } });

        if (existingSymptomLog) {
            existingSymptomLog.symptoms = symptoms;
            await symptomRepository.save(existingSymptomLog);
            return res.status(200).json({ symptomLog: existingSymptomLog });
        }

        const symptomLog = symptomRepository.create({ uid, symptoms, date });
        await symptomRepository.save(symptomLog);
        res.status(201).json({ symptomLog });
    } catch (error) {
        console.error("Error creating symptom log:", error);
        res.status(500).json({ message: "Error creating symptom log" });
    }
});

// Get user symptom logs by uid and date
router.get("/:uid/:date", async (req, res) => {
    const uid = req.params.uid;
    const date = req.params.date;
    const symptomRepository = AppDataSource.getRepository(SymptomLog);

    try {
        const symptomLog = await symptomRepository.findOne({ where: { uid: uid, date: date } });

        if (!symptomLog) {
            return res.status(404).json({ message: "Symptom log not found" });
        }

        res.status(200).json({ symptomLog });
    } catch (error) {
        console.error("Error fetching symptom log:", error);
        res.status(500).json({ message: "Error fetching symptom log" });
    }
});

export default router;
