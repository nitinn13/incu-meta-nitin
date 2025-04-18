const { Router } = require("express");
const adminRouter = Router();
const { adminModel, eventModel, announcementModel, userModel, scheduleModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");

// Admin signup
adminRouter.post("/register", async (req, res) => {
    try {
        const reqBody = z.object({
            email: z.string().email(),
            password: z.string().min(3),
            name: z.string().min(1)
        });

        const parsed = reqBody.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid request body", error: parsed.error.issues });
        }

        const { email, password, name } = parsed.data;

        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await adminModel.create({ email, password: hashedPassword, name });

        res.status(201).json({ message: "Admin created", admin: { email: newAdmin.email, name: newAdmin.name } });
    } catch (err) {
        res.status(500).json({ message: "Error creating admin", error: err.message });
    }
});

// Admin Login
adminRouter.post("/login", async (req, res) => {
    try {
        const reqBody = z.object({
            email: z.string().email(),
            password: z.string()
        });

        const parsed = reqBody.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid request body", error: parsed.error.issues });
        }

        const { email, password } = parsed.data;

        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ email, id: admin._id }, JWT_ADMIN_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});

adminRouter.get('/profile', adminMiddleware, async (req, res) => {
    try {
        const { userId } = req; 
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await adminModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
adminRouter.get("/dashboard-stats", async (req, res) => {
    try {
      const totalStartups = await userModel.countDocuments();
      const approvedStartups = await userModel.countDocuments({ isApproved: true });
      const pendingStartups = await userModel.countDocuments({ isApproved: false });
      const totalRevenue = await userModel.aggregate([{ $group: { _id: null, total: { $sum: "$revenue" } } }]);
      const totalTeamSize = await userModel.aggregate([{ $group: { _id: null, total: { $sum: "$teamSize" } } }]);
      const largestTeam = await userModel.findOne().sort({ teamSize: -1 }).select("name teamSize");
      const topRevenueStartup = await userModel.findOne().sort({ revenue: -1 }).select("name revenue");
  
      const totalEvents = await eventModel.countDocuments();
      const upcomingEvents = await eventModel.countDocuments({ createdAt: { $gte: new Date() } });
      const totalAnnouncements = await announcementModel.countDocuments();
      const announcementsLast30Days = await announcementModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      const totalMeetings = await scheduleModel.countDocuments();
      const meetingsToday = await scheduleModel.countDocuments({
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)), $lt: new Date(new Date().setHours(23, 59, 59, 999)) }
      });
      const startupsThisMonth = await userModel.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      });
      const totalAdmins = await adminModel.countDocuments();
  
      const fundingStageBreakdown = await userModel.aggregate([
        { $group: { _id: "$fundingStage", count: { $sum: 1 } } }
      ]);
  
      res.json({
        totalStartups,
        approvedStartups,
        pendingStartups,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalTeamSize: totalTeamSize[0]?.total || 0,
        largestTeam,
        topRevenueStartup,
        totalEvents,
        upcomingEvents,
        totalAnnouncements,
        announcementsLast30Days,
        totalMeetings,
        meetingsToday,
        startupsThisMonth,
        totalAdmins,
        fundingStageBreakdown
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
    }
  });
  
  
  

adminRouter.get('/all-startups', adminMiddleware, async (req, res) => {
    try {
        const startups = await userModel.find({});
        res.json({startups});
    } 
    catch(err){
        res.status(500).json({message: "Error fetching startups"})
    }
});
adminRouter.get('/all-startups/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const startup = await userModel.findById(id);
        if (!startup) {
            return res.status(404).json({ message: "Startup not found" });
        }
        res.json({ startup });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
adminRouter.post('/approve-startup', adminMiddleware, async (req, res) => {
    try{
        const {id} = req.body;
        const startup = await userModel.findById(id);
        if (!startup) {
            return res.status(404).json({ message: "Startup not found" });
        }
        startup.isApproved = true;
        await startup.save();
        res.status(201).json({message: "Startup approved"});
    }
    catch(err){
        res.status(500).json({message: "Error approving startup"})
    }
});

adminRouter.post('/create-event', adminMiddleware, async (req, res) => {
    try{
        const {title, description, location} = req.body;
        await eventModel.create({title, description, location});
        res.status(201).json({message: "Event created"});
    }
    catch(err){
        res.status(500).json({message: "Error creating event"})
    }
});

adminRouter.post('/remove-event', adminMiddleware, async (req, res) => {
    try{
        const {eventId} = req.body;
        await eventModel.deleteOne({_id: eventId});
        res.status(201).json({message: "Event deleted"});
    }
    catch(err){
        res.status(500).json({message: "Error deleting event"})
    }
});
adminRouter.post('/create-announcement', adminMiddleware, async (req, res) => {
    try{
        const {title, message} = req.body;
        await announcementModel.create({title, message});
        res.status(201).json({message: "announcement created"});
    }
    catch(err){
        res.status(500).json({message: "Error creating announcement"})
    }
});

adminRouter.post('/remove-announcement', adminMiddleware, async (req, res) => {
    try{
        const {announcementId} = req.body;
        await announcementModel.deleteOne({_id: announcementId});
        res.status(201).json({message: "Announcement deleted"});
    }
    catch(err){
        res.status(500).json({message: "Error deleting announcement"})
    }
});


adminRouter.post('/schedule-meeting', adminMiddleware, async (req, res) => {
    try{
        const {startupId, date, time, description} = req.body;
        await scheduleModel.create({startupId, date, time, description});
        res.status(201).json({message: "Schedule created"});
    }
    catch(err){
        res.status(500).json({message: "Error creating schedule"})
    }
});

adminRouter.get('/all-schedules', adminMiddleware, async (req, res) => {
    try {
        const schedules = await scheduleModel.find({}).populate('startupId', 'name');
        res.json({ schedules });
    } catch (err) {
        res.status(500).json({ message: "Error fetching schedules" });
    }
});
adminRouter.get('/schedule/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await scheduleModel.findById(id);

        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.json({ schedule });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = {
    adminRouter
};
