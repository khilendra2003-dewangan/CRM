import Campus from "../module/campusmodel.js";
import Institute from "../module/institutemodel.js";
import Department from "../module/departmentmodel.js";
import Program from "../module/programmodel.js";


//institute

export const createInstitute = async (req, res) => {
    try {
        const { name, code, address, city, state, country, phone, email } = req.body;

        if (!name || !code || !address || !city || !state || !country || !phone || !email) {
            return res.status(400).json({ message: "All fields required" });
        }
        const existingInstitute = await Institute.findOne({ code });
        if (existingInstitute) {
            return res.status(400).json({ message: "Institute already exists" });
        }
        const institute = await Institute.create({
            name,
            code,
            address,
            city,
            state,
            country,
            phone,
            email,

        });

        res.status(201).json({
            message: "Institute created",
            institute
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteInstitute = async (req, res) => {
    try {
        const institute = await Institute.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Institute deleted",
            institute
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateInstitute = async (req, res) => {
    try {
        const { name, code, address, city, state, country, phone, email } = req.body;

        const institute = await Institute.findByIdAndUpdate(
            req.params.id,
            { name, code, address, city, state, country, phone, email },
            { new: true }
        );

        res.status(200).json({
            message: "Institute updated",
            institute
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getInstituteById = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);
        res.status(200).json(institute);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getAllInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find();
        res.status(200).json(institutes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


//campus

export const createCampus = async (req, res) => {
    try {
        const { name, institutionId, code, address, city, state, country, phone, email } = req.body;

        if (!name || !institutionId || !code || !address || !city || !state || !country || !phone || !email) {
            return res.status(400).json({ message: "All fields required" });
        }
        const existingCampus = await Campus.findOne({ code });
        if (existingCampus) {
            return res.status(400).json({ message: "Campus already exists" });
        }
        const campus = await Campus.create({
            name,
            institutionId,
            code,
            address,
            city,
            state,
            country,
            phone,
            email,

        });

        res.status(201).json({
            message: "Campus created",
            campus
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteCampus = async (req, res) => {
    try {
        const campus = await Campus.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Campus deleted",
            campus
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateCampus = async (req, res) => {
    try {
        const { name, institutionId, code, address, city, state, country, phone, email } = req.body;

        const campus = await Campus.findByIdAndUpdate(
            req.params.id,
            { name, institutionId, code, address, city, state, country, phone, email },
            { new: true }
        );

        res.status(200).json({
            message: "Campus updated",
            campus
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getCampusById = async (req, res) => {
    try {
        const campus = await Campus.findById(req.params.id);
        res.status(200).json(campus);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllCampuses = async (req, res) => {
    try {
        const campuses = await Campus.find();
        res.status(200).json(campuses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



//department

export const createDepartment = async (req, res) => {
    try {
        const { name, code, campusId } = req.body;

        if (!name || !code || !campusId) {
            return res.status(400).json({ message: "All fields required" });
        }
        const existingDepartment = await Department.findOne({ code });
        if (existingDepartment) {
            return res.status(400).json({ message: "Department already exists" });
        }
        const department = await Department.create({
            name,
            code,
            campusId,
        });

        res.status(201).json({
            message: "Department created",
            department
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Department deleted",
            department
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const { name, code, campusId } = req.body;

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name, code, campusId },
            { new: true }
        );

        res.status(200).json({
            message: "Department updated",
            department
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        res.status(200).json(department);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



//program

export const createProgram = async (req, res) => {
    try {
        const { name, code, departmentId, academicYear, duration, fee, courseType, entryType, admissionMode, intake, quotas } = req.body;

        if (!name || !code || !departmentId || !academicYear || !duration || !fee || !courseType || !entryType || !admissionMode || !intake || !quotas) {
            return res.status(400).json({ message: "All fields required" });
        }
        const existingProgram = await Program.findOne({ code });
        if (existingProgram) {
            return res.status(400).json({ message: "Program already exists" });
        }
        const existingDepartment = await Department.findById(departmentId);
        if (!existingDepartment) {
            return res.status(400).json({ message: "Department not found" });
        }
        const existingCampus = await Campus.findById(existingDepartment.campusId);
        if (!existingCampus) {
            return res.status(400).json({ message: "Campus not found" });
        }
        const existingInstitute = await Institute.findById(existingCampus.institutionId);
        if (!existingInstitute) {
            return res.status(400).json({ message: "Institute not found" });
        }
        const totalQuotaSeats = quotas.reduce((sum, q) => sum + Number(q.totalSeats), 0);
        if (totalQuotaSeats > intake) {
            return res.status(400).json({ message: `Total quota seats (${totalQuotaSeats}) cannot exceed program intake (${intake})` });
        }

        const program = await Program.create({
            name,
            code,
            departmentId,
            academicYear,
            duration,
            fee,
            courseType,
            entryType,
            admissionMode,
            intake,
            quotas,
        });

        res.status(201).json({
            message: "Program created",
            program
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const deleteProgram = async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Program deleted",
            program
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const updateProgram = async (req, res) => {
    try {
        const { name, code, departmentId, academicYear, duration, fee, courseType, entryType, admissionMode, intake, quotas } = req.body;

        const totalQuotaSeats = quotas.reduce((sum, q) => sum + Number(q.totalSeats), 0);
        if (totalQuotaSeats > intake) {
            return res.status(400).json({ message: `Total quota seats (${totalQuotaSeats}) cannot exceed program intake (${intake})` });
        }

        const program = await Program.findByIdAndUpdate(
            req.params.id,
            { name, code, departmentId, academicYear, duration, fee, courseType, entryType, admissionMode, intake, quotas },
            { new: true }
        );

        res.status(200).json({
            message: "Program updated",
            program
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getProgramById = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        res.status(200).json(program);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.find();
        res.status(200).json(programs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getProgramsByDepartmentId = async (req, res) => {
    try {
        const programs = await Program.find({ departmentId: req.params.departmentId });
        res.status(200).json(programs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

