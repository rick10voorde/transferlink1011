// backend/src/models/jobs.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  clubId: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'closed';
  
  // Club Info (Public)
  country: string;
  league: string;
  clubName?: string;
  clubLevel: 'amateur' | 'semi-professional' | 'professional' | 'top-division';
  
  // Club Info (Private)
  contactInfo: {
    name: string;
    role: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone';
  };

  // Privacy Settings
  privacySettings: {
    isAnonymous: boolean;
    visibleToVerifiedAgentsOnly: boolean;
    hideFinancialDetails: boolean;
  };

  // Player Requirements
  position: string;
  experience: {
    level: 'topLevel' | 'professional' | 'semiProfessional';
    competitionLevel?: string;
    professionalMatches?: number;
  };
  ageRange: [number, number];
  height?: [number, number];
  preferredFoot?: 'left' | 'right' | 'both';
  origin?: {
    continents: string[];
  };

  // Financial Details (Can be hidden based on privacy settings)
  financialDetails?: {
    salary?: {
      range: [number, number];
      currency: string;
      isNegotiable: boolean;
    };
    contractDuration?: string;
    bonuses?: {
      signingBonus?: number;
      performanceBonuses?: string;
    };
    benefits?: string[];
    additionalPerks?: string;
  };

  // Metadata
  views: number;
  applications: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const JobSchema = new Schema({
  clubId: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },

  // Club Info (Public)
  country: {
    type: String,
    required: true
  },
  league: {
    type: String,
    required: true
  },
  clubName: String,
  clubLevel: {
    type: String,
    enum: ['amateur', 'semi-professional', 'professional', 'top-division'],
    required: true
  },

  // Club Info (Private)
  contactInfo: {
    name: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    preferredContact: {
      type: String,
      enum: ['email', 'phone'],
      required: true
    }
  },

  // Privacy Settings
  privacySettings: {
    isAnonymous: {
      type: Boolean,
      default: false
    },
    visibleToVerifiedAgentsOnly: {
      type: Boolean,
      default: true
    },
    hideFinancialDetails: {
      type: Boolean,
      default: false
    }
  },

  // Player Requirements
  position: {
    type: String,
    required: true
  },
  experience: {
    level: {
      type: String,
      enum: ['topLevel', 'professional', 'semiProfessional'],
      required: true
    },
    competitionLevel: String,
    professionalMatches: Number
  },
  ageRange: {
    type: [Number],
    required: true,
    validate: [(val: number[]) => val.length === 2, 'Age range must have min and max values']
  },
  height: {
    type: [Number],
    validate: [(val: number[]) => val.length === 2, 'Height must have min and max values']
  },
  preferredFoot: {
    type: String,
    enum: ['left', 'right', 'both']
  },
  origin: {
    continents: [String]
  },

  // Financial Details
  financialDetails: {
    salary: {
      range: {
        type: [Number],
        validate: [(val: number[]) => val.length === 2, 'Salary range must have min and max values']
      },
      currency: {
        type: String,
        default: 'EUR'
      },
      isNegotiable: {
        type: Boolean,
        default: true
      }
    },
    contractDuration: String,
    bonuses: {
      signingBonus: Number,
      performanceBonuses: String
    },
    benefits: [String],
    additionalPerks: String
  },

  // Metadata
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
JobSchema.index({ clubId: 1, status: 1 });
JobSchema.index({ country: 1, league: 1 });
JobSchema.index({ position: 1 });
JobSchema.index({ "experience.level": 1 });
JobSchema.index({ createdAt: 1 });
JobSchema.index({ expiresAt: 1 });

export default mongoose.model<IJob>('Job', JobSchema);