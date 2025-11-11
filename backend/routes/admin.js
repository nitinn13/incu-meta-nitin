const { Router } = require("express");
const adminRouter = Router();
const { adminModel, eventModel, announcementModel, userModel, scheduleModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");

/* --------------------------- ADMIN (INCUBATOR) REGISTER --------------------------- */
adminRouter.post("/register", async (req, res) => {
  try {
    const reqBody = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(3),

      organizationType: z.enum(["Academic", "Government", "Private", "Corporate", "Other"]),
      website: z.string().url().optional(),

      director: z
        .object({
          name: z.string().min(1),
          email: z.string().email(),
        })
        .optional(),

      yearEstablished: z.number().int().nonnegative().optional(),
      supportedIndustries: z.array(z.string()).optional(),
      programsOffered: z.array(z.string()).optional(),
      minEligibilityCriteria: z.string().optional(),
      totalStartupsIncubated: z.number().int().nonnegative().optional(),
      recognitionCertifications: z.array(z.string()).optional(),
      about: z.string().optional(),
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
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await adminModel.create({
      ...parsed.data,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Incubator registered successfully",
      incubator: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        organizationType: newAdmin.organizationType,
        isApproved: newAdmin.isApproved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering incubator", error: err.message });
  }
});

/* ------------------------------ ADMIN (INCUBATOR) LOGIN ------------------------------ */
adminRouter.post("/login", async (req, res) => {
  try {
    const reqBody = z.object({
      email: z.string().email(),
      password: z.string().min(3),
    });

    const parsed = reqBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request body", error: parsed.error.issues });
    }

    const { email, password } = parsed.data;
    const incubator = await adminModel.findOne({ email });
    if (!incubator) return res.status(404).json({ message: "Incubator not found" });

    const isPasswordCorrect = await bcrypt.compare(password, incubator.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { email, id: incubator._id, name: incubator.name, organizationType: incubator.organizationType },
      JWT_ADMIN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      incubator: {
        id: incubator._id,
        name: incubator.name,
        email: incubator.email,
        organizationType: incubator.organizationType,
        website: incubator.website,
        director: incubator.director,
        isApproved: incubator.isApproved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

/* -------------------------------- PROFILE -------------------------------- */
adminRouter.get("/profile", adminMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const admin = await adminModel.findById(userId);
    if (!admin) return res.status(404).json({ message: "User not found" });

    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* --------------------------- DASHBOARD STATS --------------------------- */
adminRouter.get("/dashboard-stats", async (req, res) => {
  try {
    const totalStartups = await userModel.countDocuments();
    const approvedStartups = await userModel.countDocuments({ isApproved: true });
    const pendingStartups = await userModel.countDocuments({ isApproved: false });

    const [totalRevenue] = await userModel.aggregate([{ $group: { _id: null, total: { $sum: "$revenue" } } }]);
    const [totalTeamSize] = await userModel.aggregate([{ $group: { _id: null, total: { $sum: "$teamSize" } } }]);

    const largestTeam = await userModel.findOne().sort({ teamSize: -1 }).select("name teamSize");
    const topRevenueStartup = await userModel.findOne().sort({ revenue: -1 }).select("name revenue");

    const totalEvents = await eventModel.countDocuments();
    const totalAnnouncements = await announcementModel.countDocuments();
    const totalMeetings = await scheduleModel.countDocuments();
    const totalAdmins = await adminModel.countDocuments();

    const fundingStageBreakdown = await userModel.aggregate([{ $group: { _id: "$fundingStage", count: { $sum: 1 } } }]);

    res.json({
      totalStartups,
      approvedStartups,
      pendingStartups,
      totalRevenue: totalRevenue?.total || 0,
      totalTeamSize: totalTeamSize?.total || 0,
      largestTeam,
      topRevenueStartup,
      totalEvents,
      totalAnnouncements,
      totalMeetings,
      totalAdmins,
      fundingStageBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
  }
});

/* --------------------------- STARTUP MANAGEMENT --------------------------- */
adminRouter.get("/all-startups", adminMiddleware, async (_, res) => {
  try {
    const startups = await userModel.find({});
    res.json({ startups });
  } catch {
    res.status(500).json({ message: "Error fetching startups" });
  }
});

adminRouter.get("/all-startups/:id", adminMiddleware, async (req, res) => {
  try {
    const startup = await userModel.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    res.json({ startup });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

adminRouter.post("/approve-startup", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    const startup = await userModel.findById(id);
    if (!startup) return res.status(404).json({ message: "Startup not found" });

    startup.isApproved = true;
    await startup.save();
    res.status(200).json({ message: "Startup approved successfully" });
  } catch {
    res.status(500).json({ message: "Error approving startup" });
  }
});

/* --------------------------- EVENT MANAGEMENT --------------------------- */
adminRouter.post("/create-event", adminMiddleware, async (req, res) => {
  try {
    const reqBody = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      location: z.string().optional(),
    });

    const parsed = reqBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid event data", error: parsed.error.issues });

    await eventModel.create(parsed.data);
    res.status(201).json({ message: "Event created successfully" });
  } catch {
    res.status(500).json({ message: "Error creating event" });
  }
});

adminRouter.post("/remove-event", adminMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;
    await eventModel.deleteOne({ _id: eventId });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting event" });
  }
});

/* --------------------------- ANNOUNCEMENTS --------------------------- */
adminRouter.post("/create-announcement", adminMiddleware, async (req, res) => {
  try {
    const reqBody = z.object({
      title: z.string().min(1),
      message: z.string().min(1),
    });

    const parsed = reqBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid announcement data", error: parsed.error.issues });

    await announcementModel.create(parsed.data);
    res.status(201).json({ message: "Announcement created successfully" });
  } catch {
    res.status(500).json({ message: "Error creating announcement" });
  }
});

adminRouter.post("/remove-announcement", adminMiddleware, async (req, res) => {
  try {
    const { announcementId } = req.body;
    await announcementModel.deleteOne({ _id: announcementId });
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting announcement" });
  }
});

/* --------------------------- SCHEDULING --------------------------- */
adminRouter.post("/schedule-meeting", adminMiddleware, async (req, res) => {
  try {
    const reqBody = z.object({
      startupId: z.string(),
      date: z.string(),
      time: z.string(),
      description: z.string().optional(),
    });

    const parsed = reqBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid schedule data", error: parsed.error.issues });

    await scheduleModel.create(parsed.data);
    res.status(201).json({ message: "Meeting scheduled successfully" });
  } catch {
    res.status(500).json({ message: "Error creating schedule" });
  }
});

adminRouter.get("/all-schedules", adminMiddleware, async (_, res) => {
  try {
    const schedules = await scheduleModel.find({}).populate("startupId", "name");
    res.json({ schedules });
  } catch {
    res.status(500).json({ message: "Error fetching schedules" });
  }
});

adminRouter.get("/schedule/:id", adminMiddleware, async (req, res) => {
  try {
    const schedule = await scheduleModel.findById(req.params.id).populate("startupId", "name email");
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json({ schedule });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = { adminRouter };
