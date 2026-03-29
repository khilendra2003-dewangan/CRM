import Admission from "../module/admissionmodel.js";
import Applicant from "../module/applicantmodel.js";
import Program from "../module/programmodel.js";


//applicant
export const createapplicant = async (req, res) => {
    try {
        const { name, email, phone, category, entryType, quotaType, marks, documentsStatus } = req.body;
        if (!name || !email || !phone || !category || !entryType || !quotaType || !marks || !documentsStatus) {
            return res.status(400).json({ message: "All fields required" });
        }
        const existingApplicant = await Applicant.findOne({ email });
        if (existingApplicant) {
            return res.status(400).json({ message: "Applicant already exists" });
        }
        const applicant = await Applicant.create({
            name,
            email,
            phone,
            category,
            entryType,
            quotaType,
            marks,
            documentsStatus,
        });
        res.status(201).json({
            message: "Applicant created",
            applicant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const updateapplicant = async (req, res) => {
    try {
        const { name, email, phone, category, entryType, quotaType, marks, documentsStatus } = req.body;
        const applicant = await Applicant.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, category, entryType, quotaType, marks, documentsStatus },
            { new: true }
        );
        res.status(200).json({
            message: "Applicant updated",
            applicant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const deleteapplicant = async (req, res) => {
    try {
        const applicant = await Applicant.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Applicant deleted",
            applicant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getapplicant = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id);
        res.status(200).json(applicant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getallapplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find();
        res.status(200).json(applicants);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const updateDocumentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const applicant = await Applicant.findByIdAndUpdate(
            req.params.id,
            { "documentsStatus.status": status },
            { new: true }
        );

        res.json(applicant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//allotment


export const createallotment = async (req, res) => {
    try {
        const { applicantId, programId, quotaType, allotmentNumber } = req.body;
        if (!applicantId || !programId || !quotaType || !allotmentNumber) {
            return res.status(400).json({ message: "All fields required" });
        }
        const existingAllotment = await Admission.findOne({ allotmentNumber });
        if (existingAllotment) {
            return res.status(400).json({ message: "Allotment already exists" });
        }

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }
        const quota = program.quotas.find((q) => q.type === quotaType);
        if (!quota) {
            return res.status(404).json({ message: "Quota not found" });
        }

        if (quota.filledSeats >= quota.totalSeats) {
            return res.status(400).json({ message: "Quota is full for this program" });
        }

        quota.filledSeats += 1;
        await program.save();
        const allotment = await Admission.create({
            applicantId,
            programId,
            quotaType,
            allotmentNumber,
        });
        res.status(201).json({
            message: "Allotment created",
            allotment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const confirmAdmission = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id)
            .populate("applicantId")
            .populate("programId");

        if (!admission) {
            return res.status(404).json({ message: "Admission not found" });
        }

        if (admission.feeStatus !== "paid") {
            return res.status(400).json({ message: "Fee not paid" });
        }

        if (admission.status === "Confirmed") {
            return res.status(400).json({ message: "Already confirmed" });
        }

        const admissionNumber = `INST/2026/${admission.programId.courseType}/${admission.programId.name}/${admission.quotaType}/${Date.now()}`;

        admission.admissionNumber = admissionNumber;
        admission.status = "Confirmed";

        await admission.save();

        res.json({
            message: "Admission confirmed",
            admission
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateFeeStatus = async (req, res) => {
    try {
        const { feeStatus } = req.body;

        const admission = await Admission.findByIdAndUpdate(
            req.params.id,
            { feeStatus },
            { new: true }
        );

        res.json(admission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find()
            .populate("applicantId")
            .populate("programId");
        res.status(200).json(admissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};