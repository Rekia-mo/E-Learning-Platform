import { Role, User } from "../models/index";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service";


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
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const defaultRole = await Role.findOne({ where: { name: "Student" } });
    if (!defaultRole)
      return res.status(500).json({ message: "Default role not configured" });

    // GENERATE VERIFICATION TOKEN
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // CREATE USER — no JWT yet, account is locked
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isSick: req.body.isSick,
      role_id: defaultRole.id,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // SEND EMAIL WITH LINK
    await sendVerificationEmail(req.body.email, verificationToken);

    // NO TOKEN RETURNED HERE
    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email to activate your account.",
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

//email verification
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token)
      return res.status(400).json({ message: "Token is missing" });

    // FIND USER BY TOKEN
    const user = await User.findOne({
      where: { emailVerificationToken: token as string },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid link" });

    // CHECK IF TOKEN EXPIRED
    if (user.emailVerificationExpires! < new Date())
      return res.status(400).json({ message: "Link expired, please sign up again" });

    // FIND ROLE FOR JWT
    const role = await Role.findOne({ where: { id: user.role_id } });
    if (!role)
      return res.status(500).json({ message: "Role not found" });

    // UNLOCK ACCOUNT + DELETE TOKEN
    await user.update({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    // GENERATE JWT HERE — this is the moment the user gets access
    const jwtToken = user.generateAuthToken(role.name);

    return res.status(200).json({
      success: true,
      message: "Email verified!",
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role.name,
      },
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
    const isSick = req.body.isSick;

      // if (!name) {
      //   return res.status(400).json({ message: "No name provided" });
      // }

    //update the user's name
    user = await user.update({ name: name, isSick: isSick });

    res.json({
      success: true,
      message: "User updated successfully"
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