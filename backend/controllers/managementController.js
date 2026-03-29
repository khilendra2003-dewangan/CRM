import Program from "../module/programmodel.js";
import Applicant from "../module/applicantmodel.js";
import Admission from "../module/admissionmodel.js";

export const getDashboard = async (req, res) => {
    try {
        const programs = await Program.find();

        let totalIntake = 0;
        let totalFilled = 0;

        let quotaStats = [];

        programs.forEach(program => {
            totalIntake += program.intake;

            program.quotas.forEach(q => {
                totalFilled += q.filledSeats;

                quotaStats.push({
                    program: program.name,
                    quota: q.type,
                    total: q.totalSeats,
                    filled: q.filledSeats,
                    remaining: q.totalSeats - q.filledSeats
                });
            });
        });

        const pendingDocs = await Applicant.find({
            "documentsStatus.status": { $ne: "Verified" }
        });

        const feePending = await Admission.find({
            feeStatus: "Pending"
        }).populate("applicantId");

        res.json({
            totalIntake,
            totalFilled,
            remainingSeats: totalIntake - totalFilled,
            quotaStats,
            pendingDocuments: pendingDocs.length,
            feePendingCount: feePending.length,
            feePendingList: feePending
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};