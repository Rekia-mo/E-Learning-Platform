# test_content_based.py





from courses.contentbased import CourseRecommender
from utils import get_courses_df  # your function to load courses

def test_content_based():
    # 1️⃣Load courses from DB
    courses_df = get_courses_df()
    print("Courses loaded from DB:\n", courses_df)

    # 2️⃣ Initialize recommender
    rec = CourseRecommender(courses_df)
    rec.preprocess()
    rec.build_model()

    # 3️⃣ Pick a course to test
    course_id = courses_df.iloc[0]["id"]  # first course
    print(f"\nRecommendations for course: {courses_df.iloc[0]['description']}")

    # 4️⃣ Get recommended course IDs
    recommended_ids = rec.recommend(course_id, top_n=5)

    # 5️⃣ Convert IDs to course descriptions or names
    recommended_courses = courses_df[courses_df["id"].isin(recommended_ids)]["description"].tolist()

    print("Recommended courses (names):", recommended_courses)

if __name__ == "__main__":
    test_content_based()