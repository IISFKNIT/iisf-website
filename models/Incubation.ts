import mongoose, { Schema, Document, models } from "mongoose";

export interface IIncubation extends Document {
  // Basic Information
  startupName: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  founderCollege: string;
  founderYear: string;
  founderBranch: string;
  teamSize: number;

  // Problem & Solution
  problemStatement: string;
  proposedSolution: string;
  uniqueSellingPoint: string;

  // Current Stage
  currentStage: "idea" | "mvp" | "early-traction";

  // Support Needed
  supportNeeded: ("mentorship" | "technical" | "funding" | "coworking")[];
  additionalInfo?: string;

  // Status
  status: "pending" | "reviewing" | "approved" | "rejected";
  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const IncubationSchema = new Schema<IIncubation>(
  {
    // Basic Information
    startupName: {
      type: String,
      required: [true, "Startup name is required"],
      trim: true,
    },
    founderName: {
      type: String,
      required: [true, "Founder name is required"],
      trim: true,
    },
    founderEmail: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    founderPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    founderCollege: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    founderYear: {
      type: String,
      required: [true, "Year is required"],
      enum: [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Alumni",
        "Faculty",
      ],
    },
    founderBranch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },
    teamSize: {
      type: Number,
      required: [true, "Team size is required"],
      min: 1,
      max: 10,
    },

    // Problem & Solution
    problemStatement: {
      type: String,
      required: [true, "Problem statement is required"],
      trim: true,
    },
    proposedSolution: {
      type: String,
      required: [true, "Proposed solution is required"],
      trim: true,
    },
    uniqueSellingPoint: {
      type: String,
      required: [true, "USP is required"],
      trim: true,
    },

    // Current Stage
    currentStage: {
      type: String,
      required: [true, "Current stage is required"],
      enum: ["idea", "mvp", "early-traction"],
    },

    // Support Needed
    supportNeeded: {
      type: [String],
      required: [true, "At least one support type is required"],
      enum: ["mentorship", "technical", "funding", "coworking"],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "At least one support type is required",
      },
    },
    additionalInfo: {
      type: String,
      trim: true,
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "reviewing", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
IncubationSchema.index({ status: 1, createdAt: -1 });
IncubationSchema.index({ founderEmail: 1 });

const Incubation =
  models.Incubation ||
  mongoose.model<IIncubation>("Incubation", IncubationSchema);

export default Incubation;
