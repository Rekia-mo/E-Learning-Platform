import { Request, Response } from "express";
import { Quize, Course } from "../models/index";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateQuiz = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const course_id = req.params.id;

    //get course doc 
    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // check if course has a document
    if (!course.document) return res.status(400).json({ success: false, message: "Course has no document" });

    //generate quiz

    const filePath = path.resolve(course.document);
    // course.document = "uploads/file.pdf" (relative path)
    // path.resolve turns it into full path: "C:/project/uploads/file.pdf"

    const fileData = fs.readFileSync(filePath);
    // reads the file as raw bytes (Buffer)

    const base64PDF = fileData.toString("base64");
    // converts bytes to base64 string
    // Gemini can't receive raw bytes, it needs base64


    // call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64PDF
        }
      },
      {
        text: `Based on this document, generate 5 multiple choice questions.
        Return ONLY a JSON array, no extra text, in this exact format:
        [
          {
            "question": "...",
            "option_a": "...",
            "option_b": "...",
            "option_c": "...",
            "option_d": "...",
            "correct_answer": "a" or "b" or "c" or "d"
          }
        ]`
      }
    ]);

    const text = result.response.text();
    // "```json\n[{...}]\n```"  ← Gemini wraps it in markdown

    // parse the JSON
    const clean = text.replace(/```json|```/g, "").trim();
    // removes the markdown → "[{...}]"

    const questions = JSON.parse(clean);
    // turns string into actual JS array → [{...}, {...}]

    // delete old questions for this course if regenerating
    await Quize.destroy({ where: { course_id } });

    // save to DB
    const saved = await Quize.bulkCreate(
      questions.map((q: any) => ({ ...q, course_id }))
    );

    return res.json({ success: true, data: saved });

  }
  catch (err: any) {
    console.log(err)
    return res.status(500).json({ err: err.message });
  }
}


export const getQuizByCourse = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const course_id = req.params.id;

    const questions = await Quize.findAll({
      where: { course_id },
    });

    if (!questions.length) return res.status(404).json({ success: false, message: "No quiz found for this course" });

    return res.json({ success: true, data: questions });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};