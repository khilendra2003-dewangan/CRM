
import mongoose from "mongoose";
const campusSchema = new mongoose.Schema({
    name: String,
    institutionId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
    code: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    email: String,
    website: String,
    logo: String,
    status: String,
});

const Campus = mongoose.model("Campus", campusSchema);
export default Campus;