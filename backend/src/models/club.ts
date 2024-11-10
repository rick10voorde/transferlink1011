// src/models/Club.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IClub extends Document {
  name: string;
  email: string;
  country: string;
  league: string;
  clubSize: 'small' | 'medium' | 'large';
  verified: boolean;
  credits: number;
  premiumMember: boolean;
  recentAchievements?: string;
  contactInfo: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  privacySettings: {
    allowAnonymousPosting: boolean;
    visibleToVerifiedAgentsOnly: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  league: {
    type: String,
    required: true
  },
  clubSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  credits: {
    type: Number,
    default: 0
  },
  premiumMember: {
    type: Boolean,
    default: false
  },
  recentAchievements: {
    type: String
  },
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
    }
  },
  privacySettings: {
    allowAnonymousPosting: {
      type: Boolean,
      default: false
    },
    visibleToVerifiedAgentsOnly: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IClub>('Club', ClubSchema);