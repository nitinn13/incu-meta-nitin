const { Router } = require("express");
const userRouter = Router();
const { userModel, eventModel, announcementModel, scheduleModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");
const { userMiddleware } = require("../middlewares/user");

/* --------------------------- USER (STARTUP) REGISTRATION --------------------------- */
userRouter.post("/apply", async (req, res) => {
  try {
    const reqBody = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(3),

      industry: z.string().min(1),
      fundingStage: z.enum(["Ideation", "Pre-Seed", "Seed", "Series A", "Series B", "Growth"]),
      revenue: z.number().nonnegative().optional(),
      teamSize: z.number().int().nonnegative().optional(),

      founders: z
        .array(
          z.object({
            name: z.string().min(1),
            email: z.string().email(),
          })
        )
        .optional(),

      businessSummary: z.string().optional(),
      innovationProof: z.string().optional(),
      pitchDeckURL: z.string().url().optional(),

      previousFunding: z
        .array(
          z.object({
            round: z.string(),
            amount: z.number().nonnegative(),
            investor: z.string().optional(),
          })
        )
        .optional(),

      documents: z
        .array(
          z.object({
            type: z.string(),
            url: z.string().url(),
          })
        )
        .optional(),
    });

    const parsed = reqBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request body", error: parsed.error.issues });
    }

    const { email, password } = parsed.data;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Startup already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ ...parsed.data, password: hashedPassword });

    res.status(201).json({
      message: "Startup application submitted successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        fundingStage: newUser.fundingStage,
        isApproved: newUser.isApproved,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

/* --------------------------- USER LOGIN --------------------------- */
userRouter.post("/login", async (req, res) => {
  try {
    const reqBody = z.object({
      email: z.string().email(),
      password: z.string().min(3),
    });

    const parsed = reqBody.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid request body", error: parsed.error.issues });

    const { email, password } = parsed.data;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "Startup not found" });
    if (!user.isApproved) return res.status(401).json({ message: "Startup not approved by incubator" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ email, id: user._id }, JWT_USER_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        industry: user.industry,
        fundingStage: user.fundingStage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

/* --------------------------- USER PROFILE --------------------------- */
userRouter.get("/profile", userMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* --------------------------- DASHBOARD STATS --------------------------- */
userRouter.get("/dashboard-stats", userMiddleware, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("name email industry fundingStage revenue teamSize createdAt");

    if (!user) return res.status(404).json({ message: "Startup not found" });

    const [totalEvents, totalAnnouncements, nextEvent] = await Promise.all([
      eventModel.countDocuments(),
      announcementModel.countDocuments(),
      eventModel.findOne().sort({ createdAt: 1 }).limit(1),
    ]);

    res.json({
      name: user.name,
      email: user.email,
      industry: user.industry,
      fundingStage: user.fundingStage,
      revenue: user.revenue,
      teamSize: user.teamSize,
      joinedOn: user.createdAt,
      totalEvents,
      totalAnnouncements,
      nextEvent: nextEvent ? nextEvent.title : "No events available",
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
  }
});

/* --------------------------- EVENTS & ANNOUNCEMENTS --------------------------- */
userRouter.get("/events", async (_, res) => {
  try {
    const events = await eventModel.find({}).sort({ createdAt: -1 });
    res.json({ events });
  } catch {
    res.status(500).json({ message: "Error fetching events" });
  }
});

userRouter.get("/announcements", async (_, res) => {
  try {
    const announcements = await announcementModel.find({}).sort({ createdAt: -1 });
    res.json({ announcements });
  } catch {
    res.status(500).json({ message: "Error fetching announcements" });
  }
});

/* --------------------------- USER’S OWN MEETINGS --------------------------- */
userRouter.get("/my-schedules", userMiddleware, async (req, res) => {
  try {
    const schedules = await scheduleModel
      .find({ startupId: req.userId })
      .populate("startupId", "name email");
    res.json({ schedules });
  } catch {
    res.status(500).json({ message: "Error fetching schedules" });
  }
});

module.exports = { userRouter };
