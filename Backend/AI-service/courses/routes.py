# courses/routes.py
#Express routes.ts  → handles CRUD (create, delete, update courses...)
#FastAPI routes.py  → handles ONLY recommendations (read only, no CRUD)
from fastapi import APIRouter, HTTPException
from courses.CB_recommender_service import get_recommender, get_enrollments

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/course/{course_id}")
def recommend_by_course(course_id: str, top_n: int = 5):
    recommender = get_recommender()
    try:
        results = recommender.recommend(course_id=course_id, top_n=top_n)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    return {
        "course_id": course_id,
        "recommendations": results
    }


@router.get("/user/{user_id}")
def recommend_for_user(user_id: str, top_n: int = 5):
    recommender = get_recommender()
    enrollments_df = get_enrollments()

    results = recommender.recommend_for_user(
        user_id=user_id,
        enrollments_df=enrollments_df,
        top_n=top_n
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No enrollments found for user {user_id}."
        )

    return {
        "user_id": user_id,
        "recommendations": results
    }