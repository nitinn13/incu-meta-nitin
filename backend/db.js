const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  industry: { type: String, required: true },
  fundingStage: { type: String, enum: ['Ideation', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'], required: true },
  revenue: { type: Number },
  teamSize: { type: Number },
  founders: [{ name: String, email: String }],
  businessSummary: { type: String },
  innovationProof: { type: String },
  pitchDeckURL: { type: String },
  previousFunding: [{ round: String, amount: Number, investor: String }],
  documents: [{ type: String, url: String }],

  isApproved: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});


const incubatorSchema = new mongoose.Schema({
  name: { type: String, required: true },                      
  email: { type: String, unique: true, required: true },        
  password: { type: String, required: true },                   

  // Incubator-specific details
  organizationType: { type: String, enum: ['Academic', 'Government', 'Private', 'Corporate', 'Other'], required: true }, 
  website: { type: String },                                    // Incubator website
  director: { name: String, email: String },                    // Main authorized person/director
  yearEstablished: { type: Number },                            // Year founded
  supportedIndustries: [{ type: String }],                      // Array: industries they support
  programsOffered: [{ type: String }],                          // Array: e.g., mentorship, funding, lab access, coworking
  minEligibilityCriteria: { type: String },                     // Basic eligibility for startups to apply
  totalStartupsIncubated: { type: Number, default: 0 },         // Running count
  recognitionCertifications: [{ type: String }],                // e.g., Startup India, DIPP, NIDHI, University recognition
  about: { type: String },                                      // Short description/mission
  documents: [{ type: String, url: String }],                   // Supporting documents

  isApproved: { type: Boolean, default: false },                // Application/Portal approval status

  createdAt: { type: Date, default: Date.now }
});



const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  // date: { type: Date, required: true },
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ScheduleSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});



const userModel = mongoose.model('users', userSchema);
const adminModel = mongoose.model('admins', adminSchema);
const announcementModel = mongoose.model('announcements', AnnouncementSchema);
const eventModel = mongoose.model('events', EventSchema);
const scheduleModel = mongoose.model('schedules', ScheduleSchema);

module.exports = {
  userModel,
  adminModel,
  announcementModel,
  eventModel,
  scheduleModel
}