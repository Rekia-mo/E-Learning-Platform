from utils import (
    get_courses_df,
    get_enrollments_df,
    get_categories_df,
    get_teachers_df
)

from courses.collaborative import CollaborativeRecommender

_recommender: CollaborativeRecommender | None = None
_enrollments_df = None


def get_cf_recommender() -> CollaborativeRecommender:
    global _recommender, _enrollments_df

    if _recommender is None:
        courses_df = get_courses_df()
        enrollments_df = get_enrollments_df()
        categories_df = get_categories_df()
        teachers_df = get_teachers_df()

        _enrollments_df = enrollments_df

        _recommender = CollaborativeRecommender(
            enrollments_df,
            courses_df,
            categories_df,
            teachers_df
        )

        _recommender.build_model()

    return _recommender


def get_cf_enrollments():
    get_cf_recommender()
    return _enrollments_df