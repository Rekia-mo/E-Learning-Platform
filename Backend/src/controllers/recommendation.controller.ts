import { Request, Response } from "express";



const FASTAPI_URL = "http://localhost:8000";
const ENROLLMENT_API = "http://localhost:3000";


interface AuthRequest extends Request {
  user?: { id: string; role: string };
}


export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    // 🔐 Ensure auth exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // 🔹 Step 1: Get user enrollments (NON-admin safe route)
    const enrollmentResponse = await fetch(
      `${ENROLLMENT_API}/api/enrollments/me`,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    if (!enrollmentResponse.ok) {
      throw new Error(
        `Enrollments API error: ${enrollmentResponse.status}`
      );
    }

    const enrollmentData = await enrollmentResponse.json();

    // ✅ Safe check
    const hasEnrollments = enrollmentData?.count > 0;

    let recommendationResponse;

    // 🔹 Step 2: HYBRID (user has enrollments)
    if (hasEnrollments) {
      recommendationResponse = await fetch(
        `${FASTAPI_URL}/recommendations/user/${req.user?.id || ""}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 🔹 Step 3: POPULAR fallback (no enrollments)
    else {
      recommendationResponse = await fetch(
        `${FASTAPI_URL}/recommendations/popular`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ❗ Validate FastAPI response
    if (!recommendationResponse.ok) {
      throw new Error(
        `Recommendation API error: ${recommendationResponse.status}`
      );
    }

    const data = await recommendationResponse.json();

    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Recommendation Error:", error.message || error);

    return res.status(500).json({
      message: "Recommendation service unavailable",
      error: error.message || "Unknown error",
    });
  }
};