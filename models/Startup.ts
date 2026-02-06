import mongoose, { Schema, Document, models } from "mongoose";

export interface IStartup extends Document {
  name: string;
  slug: string;
  email: string;
  mobileNumber: string;
  incubatedDate: Date;
  incubationDetails?: string;
  status: "incubated" | "non-incubated";
  website?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StartupSchema = new Schema<IStartup>(
  {
    name: {
      type: String,
      required: [true, "Startup name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Startup slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    incubatedDate: {
      type: Date,
      required: [true, "Incubated date is required"],
    },
    incubationDetails: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["incubated", "non-incubated"],
      default: "non-incubated",
    },
    website: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
StartupSchema.index({ isActive: 1, createdAt: -1 });
StartupSchema.index({ status: 1 });

const Startup =
  models.Startup || mongoose.model<IStartup>("Startup", StartupSchema);

export default Startup;
