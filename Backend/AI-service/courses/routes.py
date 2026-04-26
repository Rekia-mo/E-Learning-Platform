# courses/routes.py
#Express routes.ts  → handles CRUD (create, delete, update courses...)
#FastAPI routes.py  → handles ONLY recommendations (read only, no CRUD)
from fastapi import APIRouter, HTTPException
from courses.CB_recommender_service import get_recommender, get_enrollments
from courses.PB_recommender_service import get_popularity_recommender
from courses.CF_recommender_service import get_cf_recommender
from courses.hyberd import HybridRecommender




router = APIRouter(prefix="/recommendations", tags=["Recommendations"])



@router.get("/user/{user_id}")
def recommend_for_user(user_id: str, top_n: int = 5):
    cb_recommender = get_recommender()
    cf_recommender = get_cf_recommender()
    enrollments_df = get_enrollments()

    hybrid = HybridRecommender(cb_recommender, cf_recommender, enrollments_df)

    results = hybrid.recommend_for_user(user_id=user_id, top_n=top_n)

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No recommendations found for user {user_id}."
        )

    return {
        "user_id": user_id,
        "recommendations": results
    }




















'''
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


@router.get("/cf/user/{user_id}")
def recommend_cf(user_id: str, top_n: int = 5):
    recommender = get_cf_recommender()

    results = recommender.recommend_for_user(user_id=user_id, top_n=top_n)

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No recommendations found for user {user_id}."
        )

    return {
        "user_id": user_id,
        "recommendations": results
    }

'''

















@router.get("/popular")
def recommend_popular(top_n: int = 5):
    recommender = get_popularity_recommender()
    results = recommender.recommend(top_n=top_n)

    return {
        "recommendations": results
    }