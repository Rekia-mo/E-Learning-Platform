# courses/recommender_service.py
from utils import get_courses_df, get_enrollments_df
from courses.contentbased import CourseRecommender

# Singleton: built once when the app starts
_recommender: CourseRecommender | None = None
_enrollments_df = None


def get_recommender() -> CourseRecommender:
    global _recommender, _enrollments_df

    if _recommender is None:
        courses_df = get_courses_df()
        _enrollments_df = get_enrollments_df()

        _recommender = CourseRecommender(courses_df)
        _recommender.preprocess()
        _recommender.build_model()

    return _recommender


def get_enrollments():
    get_recommender()  # ensure it's initialised
    return _enrollments_df