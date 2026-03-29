
import mongoose from "mongoose";
const applicantSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ["GM", "SC", "ST"],
    default: "GM",
  },
  entryType: {
    type: String,
    enum: ["Regular", "Lateral"],
    default: "Regular",
  },
  quotaType: {
    type: String,
    enum: ["KCET", "COMEDK", "Management"],
    default: "Management",
  },

  marks: {
    type: Number,
    default: 0,
  },

  documentsStatus: {
    status: {
      type: String,
      enum: ["Pending", "Submitted", "Verified"],
      default: "Pending",
    }
  }
});

const Applicant = mongoose.model("Applicant", applicantSchema);
export default Applicant;
