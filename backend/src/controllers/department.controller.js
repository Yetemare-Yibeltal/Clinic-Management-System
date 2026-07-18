// department.controller.js — Clinic department management
import Department from "../models/Department.model.js";
import User from "../models/User.model.js";

// POST /api/departments (admin only)
export async function createDepartment(req, res, next) {
  try {
    const {
      name,
      shortCode,
      description,
      floor,
      room,
      phone,
      services,
      head,
      workingHours,
    } = req.body;

    const existing = await Department.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json({ error: "A department with this name already exists." });
    }

    const department = await Department.create({
      name,
      shortCode: shortCode?.toUpperCase() || "",
      description: description || "",
      floor: floor || "",
      room: room || "",
      phone: phone || "",
      services: services || [],
      head: head || null,
      workingHours: workingHours || undefined,
    });

    res.status(201).json(department);
  } catch (err) {
    next(err);
  }
}

// GET /api/departments
export async function getDepartments(req, res, next) {
  try {
    const { isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const departments = await Department.find(filter)
      .populate("head", "firstName lastName specialization avatar")
      .sort({ name: 1 });

    // Get doctor count for each department
    const departmentsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const doctorCount = await User.countDocuments({
          role: "doctor",
          department: dept._id,
          isActive: true,
        });
        return { ...dept.toObject(), totalDoctors: doctorCount };
      }),
    );

    res.json(departmentsWithCount);
  } catch (err) {
    next(err);
  }
}

// GET /api/departments/:id
export async function getDepartmentById(req, res, next) {
  try {
    const department = await Department.findById(req.params.id).populate(
      "head",
      "firstName lastName specialization avatar",
    );

    if (!department) {
      return res.status(404).json({ error: "Department not found." });
    }

    // Get doctors in this department
    const doctors = await User.find({
      role: "doctor",
      department: department._id,
      isActive: true,
    }).select(
      "firstName lastName specialization consultationFee averageRating avatar",
    );

    res.json({ ...department.toObject(), doctors });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/departments/:id (admin only)
export async function updateDepartment(req, res, next) {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Department not found." });
    }

    const allowedFields = [
      "name",
      "description",
      "shortCode",
      "floor",
      "room",
      "phone",
      "services",
      "head",
      "workingHours",
      "isActive",
      "image",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        department[field] = req.body[field];
      }
    }

    await department.save();
    res.json(department);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/departments/:id (admin only)
export async function deleteDepartment(req, res, next) {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Department not found." });
    }

    // Check if any doctors are assigned to this department
    const doctorCount = await User.countDocuments({
      department: req.params.id,
    });
    if (doctorCount > 0) {
      return res.status(400).json({
        error: `Cannot delete department. ${doctorCount} doctor(s) are assigned to it. Reassign them first.`,
      });
    }

    await department.deleteOne();
    res.json({ message: "Department deleted successfully." });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/departments/:id/assign-doctor (admin only)
// Assign a doctor to a department
export async function assignDoctorToDepartment(req, res, next) {
  try {
    const { doctorId } = req.body;
    const { id: departmentId } = req.params;

    const [department, doctor] = await Promise.all([
      Department.findById(departmentId),
      User.findOne({ _id: doctorId, role: "doctor" }),
    ]);

    if (!department) {
      return res.status(404).json({ error: "Department not found." });
    }
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    doctor.department = departmentId;
    await doctor.save();

    res.json({
      message: `Dr. ${doctor.firstName} ${doctor.lastName} assigned to ${department.name}.`,
    });
  } catch (err) {
    next(err);
  }
}
