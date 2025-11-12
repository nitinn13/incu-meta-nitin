const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  industry: { type: String, required: true },
  fundingStage: { 
    type: String, 
    enum: ['Ideation', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'], 
    required: true 
  },
  revenue: { type: Number },
  teamSize: { type: Number },

  founders: [
    {
      name: { type: String },
      email: { type: String }
    }
  ],

  businessSummary: { type: String },
  innovationProof: { type: String },
  pitchDeckURL: { type: String },

  previousFunding: [
    {
      round: { type: String },
      amount: { type: Number },
      investor: { type: String }
    }
  ],

  documents: [
    {
      type: { type: String },
      url: { type: String }
    }
  ],

  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },                      
  email: { type: String, unique: true, required: true },        
  password: { type: String, required: true },                   

  organizationType: { type: String, enum: ['Academic', 'Government', 'Private', 'Corporate', 'Other'], required: true }, 
  website: { type: String },
  director: { name: String, email: String },
  yearEstablished: { type: Number },
  supportedIndustries: [{ type: String }],
  programsOffered: [{ type: String }],
  minEligibilityCriteria: { type: String },
  totalStartupsIncubated: { type: Number, default: 0 },
  recognitionCertifications: [{ type: String }],
  about: { type: String },
  documents: [
    {
      type: { type: String },
      url: { type: String }
    }
  ],
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