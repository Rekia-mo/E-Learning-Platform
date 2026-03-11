import { Request, Response } from "express";
import { Teacher, User, Role } from "../models/index";


interface createTeacherBody {
  id: string;
  user_id: string;
  isPsychologist: boolean;
  cv_URL?: string | null;
  status: "pending" | "approved" | "rejected";
  descreption?: string | null;
}

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}


//POST NEW TEACHER
export const createTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { isPsychologist, descreption } = req.body as createTeacherBody;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user_id = req.user.id;

    //CHECK IF CV FILE IS UPLOADED
    if (!req.file) {
      return res.status(400).json({ message: "CV is required" });
    }
    const cv_URL= req.file.path;

    //CHECK IF TEACHER ALREADY EXISTS FOR THE USER
    const existingTeacher = await Teacher.findOne({
      where: {
        user_id: user_id
      }
    });
    if (existingTeacher) return res.status(400).json({ message: "Teacher profile already exists for this user" });

    //CREATE TEACHER

    const teacher = await Teacher.create({
      user_id: user_id,
      isPsychologist: isPsychologist,
      cv_URL: cv_URL,
      descreption: descreption,
      status: "pending"
    });

    res.json({
      success: true,
      teacher
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//GET ALL TEACHERS (ADMIN)
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'emailVerificationToken', 'emailVerificationExpires'] },
          include: [
            {
              model: Role,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    // Add base URL to cv_URL to make it accessible  
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const teachersWithUrls = teachers.map(teacher => ({
      ...teacher.toJSON(),
      cv_URL: teacher.cv_URL ? `${baseURL}/${teacher.cv_URL.replace(/\\/g, "/")}` : null
    }));
    
    res.json(teachersWithUrls);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//GET TTCHER BY ID (ADMIN)
export const getTeacherById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "No teacher ID provided" });

    const teacher = await Teacher.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'emailVerificationToken', 'emailVerificationExpires'] },
          include: [
            {
              model: Role,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json(teacher);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//DELETE TEACHER  (ADMIN)
export const deleteTeacher = async (req: Request<{ id: string }>, res: Response) => {
  try {

    //get the user id from the request params (DELTE BY ID)
    const teacher = req.params.id;
    if (!teacher) {
      res.json({ message: "No teacher ID provided" });
    };

    //find the teacher by id
    const teacherInstance = await Teacher.findByPk(teacher);
    if (!teacherInstance) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    //delete the teacher
    await teacherInstance.destroy();
    res.json({ message: "Teacher deleted successfully" });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//PATCH TEACHER'S STATUS  (ADMIN)
export const updateTeacherStatus = async (req: Request<{ id: string }>, res: Response) => {
  const teacher_id = req.params.id;
  const { status } = req.body as { status: "pending" | "approved" | "rejected" };

  try {
    //CHECK STATUS
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    //FIND TEACHER BY ID
    const teacher = await Teacher.findByPk(teacher_id,
      {
        include: [
          {
            model: User,
            attributes: { exclude: ['password', 'emailVerificationToken', 'emailVerificationExpires'] },
            include: [
              {
                model: Role,
                attributes: ['name']
              }
            ]
          }
        ]
      });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    //  IF APPROVED, UPDATE USER ROLE TO TEACHER
    if (status === "approved") {
      //get role id for teacher
      const role = await Role.findOne({ where: { name: "teacher" } });
      if (!role) return res.status(404).json({ message: "Role not found" });

      //UPDATE USER
      await User.update(
        { role_id: role.id },
        { where: { id: teacher.user_id } }
      );

    }

    //UPDATE STATUS
    await teacher.update({ status });

    res.json({
      success: true,
      message: `Teacher ${status} successfully`,
      teacher
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

