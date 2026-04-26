# CB_recommender_service.py
from utils import get_courses_df, get_enrollments_df, get_categories_df, get_teachers_df
from courses.contentbased import CourseRecommender

# Singleton: built once when the app starts
_recommender: CourseRecommender | None = None
_enrollments_df = None


def get_recommender() -> CourseRecommender:
    global _recommender, _enrollments_df

    if _recommender is None:
        courses_df = get_courses_df()
        _enrollments_df = get_enrollments_df()
        categories_df = get_categories_df()
        teachers_df = get_teachers_df()

        _recommender = CourseRecommender(courses_df, categories_df, teachers_df)
        _recommender.preprocess()
        _recommender.build_model()

    return _recommender


def get_enrollments():
    get_recommender()
    return _enrollments_df