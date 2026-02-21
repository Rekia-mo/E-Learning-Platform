import { Role, User } from "../models/index";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
 

interface createUserBody {
  name: string,
  email: string,
  password: string,
  role_id: string
}

export const createUser = async (req: Request<{}, {}, createUserBody>, res: Response) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const defaultRole = await Role.findOne({
      where: {
        name: "Student"
      }
    });

    if (!defaultRole) return res.status(500).json({ message: "Default role not configured" });
    console.log(defaultRole);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role_id: defaultRole?.id 
    });

    const token = user.generateAuthToken(defaultRole?.name);

    res.json({
      success: true,
      token: token
    });

  } catch (err : any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}