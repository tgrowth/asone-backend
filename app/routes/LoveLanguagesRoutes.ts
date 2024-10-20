import express from "express";
import { AppDataSource } from "../server.js";
import { LoveLanguagesResult } from "../models/LoveLanguagesResult.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { quizResult, user_id, quiz_id, isComplete } = req.body;
  const loveLanguagesResultRepository =
    AppDataSource.getRepository(LoveLanguagesResult);

  try {
    if (
      !quizResult ||
      typeof quizResult !== "object" ||
      Object.keys(quizResult).length !== 5
    ) {
      return res.status(400).json({ message: "Invalid quiz result format" });
    }

    if (parseInt(user_id) !== userId) {
      return res
        .status(400)
        .json({ message: "User ID in body doesn't match URL parameter" });
    }

    const languageMap = {
      "Words of Affirmation": 1,
      "Acts of Service": 2,
      "Receiving Gifts": 3,
      "Quality Time": 4,
      "Physical Touch": 5
    };

    const sortedResults = Object.entries(quizResult)
      .map(([language, percentage]) => ({
        languageId: languageMap[language as keyof typeof languageMap],
        percentage: parseFloat(percentage as string),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const languageIds = sortedResults.map((result) => result.languageId);
    const percentages = sortedResults.map((result) => result.percentage);

    // const totalPercentage = percentages.reduce(
    //   (sum, percentage) => sum + percentage, 0);
    // if (Math.abs(totalPercentage - 100) > 0.01) {
    //   return res.status(400).json({ message: "Percentages must sum to 100" });
    // }

    let loveLanguagesResult = await loveLanguagesResultRepository.findOne({
      where: { user_id: userId },
    });

    if (!loveLanguagesResult) {
      loveLanguagesResult = new LoveLanguagesResult();
      loveLanguagesResult.user_id = userId;
    }

    loveLanguagesResult.language_ids = languageIds;
    loveLanguagesResult.percentages = percentages;
    loveLanguagesResult.test_date = new Date();
    loveLanguagesResult.quiz_id = quiz_id;
    loveLanguagesResult.isComplete = isComplete;

    await loveLanguagesResultRepository.save(loveLanguagesResult);

    res.status(200).json({
      message: "Love languages result saved successfully",
      result: {
        user_id: loveLanguagesResult.user_id,
        test_date: loveLanguagesResult.test_date,
        language_ids: loveLanguagesResult.language_ids,
        percentages: loveLanguagesResult.percentages,
        quiz_id: loveLanguagesResult.quiz_id,
        isComplete: loveLanguagesResult.isComplete,
      },
    });
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

    res.status(200).json({
      message: "Love languages result retrieved successfully",
      user_id: loveLanguagesResult.user_id,
      quiz_id: loveLanguagesResult.quiz_id,
      quizResult: {
        "Words of Affirmation": loveLanguagesResult.percentages[0],
        "Acts of Service": loveLanguagesResult.percentages[1],
        "Receiving Gifts": loveLanguagesResult.percentages[2],
        "Quality Time": loveLanguagesResult.percentages[3],
        "Physical Touch": loveLanguagesResult.percentages[4],
      },
      isComplete: loveLanguagesResult.isComplete,
      test_date: loveLanguagesResult.test_date,
    });
  } catch (error) {
    console.error("Error retrieving love languages result:", error);
    res.status(500).json({
      message: "Error retrieving love languages result",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
