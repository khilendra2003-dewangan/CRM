import mongoose from "mongoose";
const programSchema = new mongoose.Schema({
    name: String,
    code: String,
    description: String,
    head: String,
    status: String,
    departmentId: String,
    academicYear: String,
    duration: String,
    fee: String,


    courseType: {
        type: String,
        enum: ["UG", "PG"],
        default: "UG",
    },
    entryType: {
        type: String,
        enum: ["Regular", "Lateral"],
        default: "Regular",
    },
    admissionMode: {
        type: String,
        enum: ["Government", "Management"],
        default: "Government",
    },

    intake: {
        type: Number,
        required: true,
    },
    quotas: [
        {
            type: {
                type: String,
                required: true
            },
            totalSeats: {
                type: Number,
                required: true
            },
            filledSeats: {
                type: Number,
                default: 0
            }
        }
    ]
});

const Program = mongoose.model("Program", programSchema);
export default Program;