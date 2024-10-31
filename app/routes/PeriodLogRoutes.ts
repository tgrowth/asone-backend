import { AppDataSource } from "../server.js";
import { PeriodLog } from "../models/PeriodLog.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const periodLogRepository = AppDataSource.getRepository(PeriodLog);

    try {
        const periodLogs = await periodLogRepository.find();
        res.status(200).json({ periodLogs });
    } catch (error) {
        console.error("Error fetching period logs:", error);
        res.status(500).json({ message: "Error fetching period logs" });
    }
});

router.get("/:uid", async (req, res) => {
    const uid = req.params.uid;
    const periodLogRepository = AppDataSource.getRepository(PeriodLog);

    try {
        const periodLog = await periodLogRepository.findOne({ where: { uid: uid } });

        if (!periodLog) {
            return res.status(404).json({ message: "Period log not found" });
        }

        periodLog.periodLogs = periodLog.periodLogs.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());  

        res.status(200).json({ uid: uid, periodLogs: periodLog.periodLogs });
    } catch (error) {
        console.error("Error fetching period log:", error);
        res.status(500).json({ message: "Error fetching period log" });
    }
});

router.post("/", async (req, res) => {
    const uid = req.body.uid;
    const periodLogRepository = AppDataSource.getRepository(PeriodLog);

    try {
        let periodLog = await periodLogRepository.findOne({ where: { uid: uid } });

        if (!periodLog) {
            periodLog = new PeriodLog();
            Object.assign(periodLog, req.body);
            periodLog.uid = uid;
        } else {
            for (const period of req.body.periodLogs) {
                if (!periodLog.periodLogs.includes(period)) {
                    periodLog.periodLogs.push(period);
                }
            }
        }

        periodLog = await periodLogRepository.save(periodLog);
        res.status(201).json({ periodLog });
    } catch (error) {
        console.error("Error creating period log:", error);
        res.status(500).json({ message: "Error creating period log" });
    }
});

export default router;