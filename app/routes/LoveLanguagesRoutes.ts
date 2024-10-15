import express from "express";
import { AppDataSource } from "../server.js";
import { User } from "../models/User.js";
import { LoveLanguagesResult } from "../models/LoveLanguagesResult.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, language_ids, percentages } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const loveLanguagesResultRepository =
    AppDataSource.getRepository(LoveLanguagesResult);

  try {
    if (
      !user_id ||
      !Array.isArray(language_ids) ||
      !Array.isArray(percentages) ||
      language_ids.length !== 5 ||
      percentages.length !== 5
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const user = await userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sortedData = language_ids
      .map((id, index) => ({ id, percentage: percentages[index] }))
      .sort((a, b) => b.percentage - a.percentage);

    const sortedLanguageIds = sortedData.map((item) => item.id);
    const sortedPercentages = sortedData.map((item) => item.percentage);

    if (
      !sortedLanguageIds.every((id) => id >= 1 && id <= 5) ||
      !sortedPercentages.every((p) => p >= 0 && p <= 100) ||
      sortedPercentages.reduce((sum, p) => sum + p, 0) !== 100
    ) {
      return res
        .status(400)
        .json({ message: "Invalid language_ids or percentages" });
    }

    let result = await loveLanguagesResultRepository.findOne({
      where: { user_id },
    });
    if (!result) {
      result = new LoveLanguagesResult();
      result.user_id = user_id;
    }

    result.language_ids = sortedLanguageIds;
    result.percentages = sortedPercentages;
    result.test_date = new Date();

    await loveLanguagesResultRepository.save(result);

    res
      .status(200)
      .json({ message: "Love languages result saved successfully", result });
  } catch (error) {
    console.error("Error saving love languages result:", error);
    res.status(500).json({
      message: "Error saving love languages result",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const loveLanguagesResultRepository =
    AppDataSource.getRepository(LoveLanguagesResult);

  try {
    const loveLanguagesResult = await loveLanguagesResultRepository.findOne({
      where: { user_id: userId },
    });

    if (!loveLanguagesResult) {
      return res
        .status(404)
        .json({ message: "Love languages result not found for this user" });
    }

    const result = {
      user_id: loveLanguagesResult.user_id,
      test_date: loveLanguagesResult.test_date,
      language_ids: loveLanguagesResult.language_ids,
      percentages: loveLanguagesResult.percentages,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving love languages result:", error);
    res.status(500).json({
      message: "Error retrieving love languages result",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
