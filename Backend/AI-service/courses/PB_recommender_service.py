# PB_recommender_service.py
from utils import get_courses_df, get_enrollments_df, get_categories_df, get_teachers_df
from courses.popularity import PopularityRecommender

# Singleton: built once when the app starts
_recommender: PopularityRecommender | None = None


def get_popularity_recommender() -> PopularityRecommender:
    global _recommender

    if _recommender is None:
        courses_df = get_courses_df()
        enrollments_df = get_enrollments_df()
        categories_df = get_categories_df()
        teachers_df = get_teachers_df()


        _recommender = PopularityRecommender(enrollments_df, courses_df, categories_df, teachers_df)

    return _recommender