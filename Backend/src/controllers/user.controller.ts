import { Role, User } from "../models/index";
import { Request, Response } from "express";
import bcrypt from "bcrypt";


interface createUserBody {
  name: string;
  email: string;
  password: string;
  isSick: boolean;
}

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

//register
export const createUser = async (
  req: Request<{}, {}, createUserBody>,
  res: Response,
) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    //VEREFY EXISTNS OF USER
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    //HACH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //SET DEFAULT ROLE AS STUDENT
    const defaultRole = await Role.findOne({
      where: {
        name: "Student",
      },
    });
    if (!defaultRole)
      return res.status(500).json({ message: "Default role not configured" });

    //CREAT USER
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isSick: req.body.isSick,
      role_id: defaultRole.id,
    });

    //GENERAT TOKEN
    const token = user.generateAuthToken(defaultRole?.name);

    res.json({
      success: true,
      token: token,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

//GET ALL USERS ADMIN
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'emailVerificationToken', 'emailVerificationExpires'] },
      include: [
        {
          model: Role,
          attributes: ['name']
        }
      ]
    });
    res.json(users);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//DELETE USER ADMIN
export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {

    //get the user id from the request params (DELTE BY ID)
    const userId = req.params.id;
    if (!userId) {
      res.json({ message: "No user ID provided" });
    };

    //find the user by id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //delete the user
    await user.destroy();
    res.json({ message: "User deleted successfully" });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//UPDATE ROLE USER BY ADMIN 
export const updateUserRole = async (req: Request<{ id: string }>, res: Response) => {
  try {
    //get the user id from the request params
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "No user ID provided" });
    }

    //find the user by id
    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { roleName } = req.body;
    if (!roleName) {
      return res.status(400).json({ message: "No role name provided" });
    }

    //find the role by name
    const role = await Role.findOne({
      where: {
        name: roleName,
      },
    });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    //update the user's role_id
    user = await user.update({ role_id: role.id });

    res.json({
      user,
      success: true,
      message: "User role updated successfully"
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//UPDATE USER BY USER 
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {

    //get the user id from the request params
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;

    //find the user by id
    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "No name provided" });
    }

    //update the user's name
    user = await user.update({ name: name });

    res.json({
      user,
      success: true,
      message: "User role updated successfully"
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//get user profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;

    //find the user by id
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'role_id', 'emailVerificationToken', 'emailVerificationExpires'] }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      success: true,
    })
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}