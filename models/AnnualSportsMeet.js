import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
});

const sportsEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
  type: String,
  default: "",
},

imagePublicId: {
  type: String,
  default: "",
},
});

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
  type: String,
  default: "",
},

imagePublicId: {
  type: String,
  default: "",
},
});

const gallerySchema = new mongoose.Schema({
 image: {
  type: String,
  required: true,
},

publicId: {
  type: String,
  default: "",
},
  caption: {
    type: String,
    default: "",
  },
});

const timelineSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});

const highlightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "🏆",
  },
});

const annualSportsMeetSchema = new mongoose.Schema(
  {
    
    heroSubtitle: {
      type: String,
      default: "",
    },

    heroImage: {
  type: String,
  default: "",
},

heroImagePublicId: {
  type: String,
  default: "",
},
    aboutText: {
      type: String,
      default: "",
    },

    startDate: Date,

    endDate: Date,

    venue: {
      type: String,
      default: "",
    },

    registerLink: {
      type: String,
      default: "",
    },

    stats: [statSchema],

    sportsEvents: [sportsEventSchema],

    achievements: [achievementSchema],

    gallery: [gallerySchema],

    timeline: [timelineSchema],

    highlights: [highlightSchema],

    ctaTitle: {
      type: String,
      default: "",
    },

    ctaDescription: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "AnnualSportsMeet",
  annualSportsMeetSchema
);