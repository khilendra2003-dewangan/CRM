import mongoose from "mongoose";
const instituteSchema = new mongoose.Schema({
    name: String,
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

const Institute = mongoose.model("Institute", instituteSchema);
export default Institute;