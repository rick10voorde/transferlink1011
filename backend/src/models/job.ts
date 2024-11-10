// src/models/Job.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  club: mongoose.Types.ObjectId;
  isAnonymous: boolean;
  playerRequirements: {
    position: 'GK' | 'RB' | 'CB' | 'LB' | 'DM' | 'CM' | 'AM' | 'RW' | 'LW' | 'SS' | 'ST';
    experience: {
      level: 'topLevel' | 'professional' | 'semiProfessional';
      competitionLevel: string;
      professionalMatches: number;
    };
    ageRange: [number, number];
    height: [number, number];
    preferredFoot: 'left' | 'right' | 'both';
    origin: {
      continents: ('EU' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'All')[];
    };
  };
  financialDetails: {
    salary: string;
    contractDuration: '6months' | '1year' | '2years' | '3years' | '4years' | '5years';
    bonuses?: string;
    benefits: ('Housing' | 'Car' | 'Flight Tickets' | 'Health Insurance' | 'Language Courses')[];
    otherBenefits?: string;
    signingBonus?: string;
  };
  status: 'draft' | 'active' | 'closed' | 'filled';
  views: number;
  applications: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const JobSchema = new Schema({
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  playerRequirements: {
    position: {
      type: String,
      enum: ['GK', 'RB', 'CB', 'LB', 'DM', 'CM', 'AM', 'RW', 'LW', 'SS', 'ST'],
      required: true
    },
    experience: {
      level: {
        type: String,
        enum: ['topLevel', 'professional', 'semiProfessional'],
        required: true
      },
      competitionLevel: String,
      professionalMatches: {
        type: Number,
        default: 0
      }
    },
    ageRange: [{
      type: Number,
      required: true,
      min: 15,
      max: 45
    }],
    height: [{
      type: Number,
      required: true,
      min: 150,
      max: 210
    }],
    preferredFoot: {
      type: String,
      enum: ['left', 'right', 'both']
    },
    origin: {
      continents: [{
        type: String,
        enum: ['EU', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'All']
      }]
    }
  },
  financialDetails: {
    salary: {
      type: String,
      required: true
    },
    contractDuration: {
      type: String,
      enum: ['6months', '1year', '2years', '3years', '4years', '5years'],
      required: true
    },
    bonuses: String,
    benefits: [{
      type: String,
      enum: ['Housing', 'Car', 'Flight Tickets', 'Health Insurance', 'Language Courses']
    }],
    otherBenefits: String,
    signingBonus: String
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'filled'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 30); // Default 30 days expiration
      return date;
    }
  }
}, {
  timestamps: true
});

// Index voor zoeken en sorteren
JobSchema.index({ 'playerRequirements.position': 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ expiresAt: 1 });

export default mongoose.model<IJob>('Job', JobSchema);