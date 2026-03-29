import mongoose from "mongoose";
const departmentSchema = new mongoose.Schema({
    name: String,
    code: String,
    campusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campus"
    },
    head: String,
    status: String,

});

const Department = mongoose.model("Department", departmentSchema);
export default Department;