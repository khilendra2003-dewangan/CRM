import mongoose from "mongoose";
const admissionSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },

  quotaType: {
    type: String,
    enum: ["KCET", "COMEDK", "Management"],
    default: "Management",
  },

  allotmentNumber: {
    type: String,
    default: "",
  },

  admissionNumber: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["Allocated", "Confirmed"],
    default: "Allocated",
  },

  feeStatus: {
    type: String,
    enum: ["Pending", "paid"],
    default: "Pending",
  },
});

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;