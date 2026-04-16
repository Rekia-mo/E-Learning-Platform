import { Request, Response } from "express";
import { z } from "zod";
import { Enrollment, Course } from "../models/index";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Zod schema (was missing)
const createEnrollment = z.object({
  course_id: z.string().uuid("Invalid course ID"),
});

// GET /enrollments/me
export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user!.id;

    const enrollments = await Enrollment.findAll({
      where: { user_id },
      include: [
        {
          model: Course,
          attributes: ["id", "title", "description", "image_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// GET /enrollments/course/:course_id
export const getEnrollmentByCourseId = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user!.id;
    const course_id = req.params.course_id;

    const enrollment = await Enrollment.findOne({
      where: { user_id, course_id },
      include: [
        {
          model: Course,
          attributes: ["id", "title", "description", "image_url"],
        },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    return res.status(200).json({ success: true, data: enrollment });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// GET /enrollments/user/:user_id  (admin)
export const getEnrollmentByUserId = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.params.user_id;

    const enrollments = await Enrollment.findAll({
      where: { user_id },
      include: [
        {
          model: Course,
          attributes: ["id", "title", "description", "image_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// POST /enrollments/:course_id
export const createEnrollmentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { course_id } = req.params;
    const validated = createEnrollment.parse({ course_id });
    const user_id = req.user!.id;

    const course = await Course.findByPk(validated.course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      where: { user_id, course_id: validated.course_id },
    });
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: "Course already enrolled" });
    }

    const enrollment = await Enrollment.create({
      user_id,
      course_id: validated.course_id,
    });

    return res.status(201).json({ success: true, data: enrollment });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// DELETE /enrollments/:course_id
export const deleteEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { course_id } = req.params;
    const validated = createEnrollment.parse({ course_id }); // reuse same schema
    const user_id = req.user!.id;

    const enrollment = await Enrollment.findOne({
      where: { user_id, course_id: validated.course_id },
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    await enrollment.destroy();

    return res.status(200).json({ success: true, message: "Enrollment deleted successfully" });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};