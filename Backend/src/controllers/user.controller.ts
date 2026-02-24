import { Role, User } from "../models/index";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

interface createUserBody {
  name: string;
  email: string;
  password: string;
  role_id: string;
  isSick: boolean;
}

export const createUser = async (
  req: Request<{}, {}, createUserBody>,
  res: Response,
) => {
  try {
    const existingUser = await User.findOne({
      where: {

        email: req.body.email
      }
    })
    //VEREFY EXISTNS OF USER 
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    

    //HACH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //SET DEFAULT ROLE AS STUDENT 
    const defaultRole = await Role.findOne({
      where: {
        name: "Student",
      },
    });

    if (!defaultRole) return res.status(500).json({ message: "Default role not configured" });

    //CREAT USER
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isSick: req.body.isSick,
      role_id: defaultRole.id
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
