// auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Role, User } from "../models/index"; // importer le modèle User et Role pour les utiliser dans le controller

// --------- LOGIN ---------
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body; // On utilise 'email' pour l'identification

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  try {
    // Cherche l'utilisateur par email
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user) return res.status(401).json({ message: "User not found" });

    // Vérifie le mot de passe:
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    if (!user.Role) {
      return res.status(500).json({ message: "User role not loaded" });
    }
    // Génère le JWT en utilisant la méthode du modèle User.Model.ts
    const token = user.generateAuthToken(user.Role.name); // tu peux remplacer par le vrai role

    res.json({ message: "Logged in", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
