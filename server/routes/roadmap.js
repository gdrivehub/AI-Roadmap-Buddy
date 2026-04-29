const express = require("express");
const router = express.Router();
const Roadmap = require("../models/Roadmap");
const { generateRoadmap } = require("../middleware/aiService");

/**
 * POST /api/generate-roadmap
 * Generates a new roadmap using AI and saves to DB
 */
router.post("/generate-roadmap", async (req, res) => {
  try {
    const { goal, userId } = req.body;

    if (!goal || typeof goal !== "string" || goal.trim().length < 3) {
      return res.status(400).json({
        error: "Invalid goal",
        message: "Please provide a valid learning goal (at least 3 characters)",
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "Configuration error",
        message: "OpenRouter API key is not configured",
      });
    }

    console.log(`🤖 Generating roadmap for goal: "${goal.trim()}"`);

    const aiResponse = await generateRoadmap(goal.trim());

    // Build steps with order index
    const steps = (aiResponse.roadmap || []).map((step, index) => ({
      title: step.title || `Phase ${index + 1}`,
      description: step.description || "",
      tasks: Array.isArray(step.tasks) ? step.tasks : [],
      status: "pending",
      order: index,
    }));

    const resources = (aiResponse.resources || []).map((r) => ({
      title: r.title || "Resource",
      url: r.url || "#",
    }));

    const roadmap = new Roadmap({
      userId: userId || "anonymous",
      goal: goal.trim(),
      timeline: aiResponse.timeline || "",
      steps,
      resources,
      completionPercentage: 0,
    });

    await roadmap.save();

    console.log(`✅ Roadmap saved with ID: ${roadmap._id}`);

    res.status(201).json({
      success: true,
      roadmapId: roadmap._id,
      roadmap,
    });
  } catch (error) {
    console.error("❌ Generate roadmap error:", error.message);
    res.status(500).json({
      error: "Failed to generate roadmap",
      message: error.message,
    });
  }
});

/**
 * GET /api/roadmap/:id
 * Fetch a specific roadmap by ID
 */
router.get("/roadmap/:id", async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.json({ success: true, roadmap });
  } catch (error) {
    console.error("❌ Get roadmap error:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid roadmap ID format" });
    }
    res.status(500).json({ error: "Failed to fetch roadmap", message: error.message });
  }
});

/**
 * GET /api/roadmaps
 * List all roadmaps (optionally filter by userId)
 */
router.get("/roadmaps", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const roadmaps = await Roadmap.find(filter)
      .select("goal timeline completionPercentage createdAt userId")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, roadmaps });
  } catch (error) {
    console.error("❌ List roadmaps error:", error.message);
    res.status(500).json({ error: "Failed to list roadmaps", message: error.message });
  }
});

/**
 * PATCH /api/update-step
 * Update a single step's status in a roadmap
 */
router.patch("/update-step", async (req, res) => {
  try {
    const { roadmapId, stepId, status } = req.body;

    if (!roadmapId || !stepId || !status) {
      return res.status(400).json({
        error: "Missing fields",
        message: "roadmapId, stepId, and status are required",
      });
    }

    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    const step = roadmap.steps.id(stepId);
    if (!step) {
      return res.status(404).json({ error: "Step not found" });
    }

    step.status = status;
    await roadmap.save(); // triggers pre-save hook to recalculate completion

    res.json({
      success: true,
      completionPercentage: roadmap.completionPercentage,
      roadmap,
    });
  } catch (error) {
    console.error("❌ Update step error:", error.message);
    res.status(500).json({ error: "Failed to update step", message: error.message });
  }
});

/**
 * DELETE /api/roadmap/:id
 * Delete a roadmap
 */
router.delete("/roadmap/:id", async (req, res) => {
  try {
    const deleted = await Roadmap.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Roadmap not found" });
    }
    res.json({ success: true, message: "Roadmap deleted" });
  } catch (error) {
    console.error("❌ Delete roadmap error:", error.message);
    res.status(500).json({ error: "Failed to delete roadmap", message: error.message });
  }
});

module.exports = router;
