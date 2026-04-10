# courses/test_content.py
# Professional test for Content-Based Recommender (course-based + user-based)

from courses.contentbased import CourseRecommender
from utils import get_courses_df, get_enrollments_df


def test_content_based():
    print("========== CONTENT-BASED RECOMMENDER TEST ==========\n")

    # 🔹 Step 1: Load data
    courses_df = get_courses_df()
    enrollments_df = get_enrollments_df()

    # 🔹 Safety checks
    if courses_df.empty:
        print("❌ No courses found in database.")
        return

    if enrollments_df.empty:
        print("⚠️ No enrollments found. User-based test will be skipped.")

    print("✅ Courses loaded:", len(courses_df))
    print("✅ Enrollments loaded:", len(enrollments_df), "\n")

    # 🔹 Step 2: Initialize recommender
    rec = CourseRecommender(courses_df)
    rec.preprocess()
    rec.build_model()

    # ==================================================
    # 🔥 TEST 1: COURSE-BASED RECOMMENDATION
    # ==================================================
    print("----- Test 1: Course-Based Recommendation -----")

    course_id = courses_df.iloc[0]["id"]
    course_title = courses_df.iloc[0]["title"]

    print(f"\n📌 Base course: {course_title} (ID: {course_id})\n")

    try:
        results = rec.recommend(course_id, top_n=5)

        if not results:
            print("⚠️ No recommendations found.")
        else:
            print("🎯 Recommended courses:")
            for i, course in enumerate(results, start=1):
                print(f"{i}. {course['title']} (score: {course['score']:.3f})")

    except Exception as e:
        print(f"❌ Error in course-based recommendation: {e}")

    # ==================================================
    # 🔥 TEST 2: USER-BASED RECOMMENDATION
    # ==================================================
    print("\n----- Test 2: User-Based Recommendation -----")

    if not enrollments_df.empty:
        user_id = enrollments_df.iloc[0]["user_id"]
        print(f"\n👤 Testing for user ID: {user_id}")

        user_courses = enrollments_df[
            enrollments_df["user_id"] == user_id
        ]["course_id"].tolist()

        print(f"📚 User enrolled courses IDs: {user_courses}\n")

        try:
            results = rec.recommend_for_user(user_id, enrollments_df, top_n=5)

            if not results:
                print("⚠️ No recommendations found for this user.")
            else:
                print("🎯 Recommended courses for user:")
                for i, course in enumerate(results, start=1):
                    print(f"{i}. {course['title']} (score: {course['score']:.3f})")

        except Exception as e:
            print(f"❌ Error in user-based recommendation: {e}")

    else:
        print("⚠️ Skipping user-based test (no enrollments data).")

    print("\n========== TEST FINISHED ==========")


if __name__ == "__main__":
    test_content_based()

















'''
# test_content.py
# Test script for the professional content-based recommender


from courses.contentbased import CourseRecommender
from utils import get_courses_df  # Reads DB credentials from .env

def test_content_based():
    # Step 1: Fetch courses from the database
    courses_df = get_courses_df()
    print("Courses loaded from DB:")
    print(courses_df[["id", "title", "description", "category_name"]])

    # Step 2: Initialize the recommender
    rec = CourseRecommender(courses_df)

    # Step 3: Preprocess the text data (title + category + description)
    rec.preprocess()

    # Step 4: Build the TF-IDF similarity model
    rec.build_model()

    # Step 5: Pick a course ID to test recommendations
    course_id = courses_df.iloc[0]["id"]
    course_name = courses_df.iloc[0]["title"]
    print(f"\nRecommendations for course: {course_name}\n")

    # Step 6: Get recommended courses (list of dicts)
    recommended_courses = rec.recommend(course_id, top_n=5)

    # Step 7: Display in professional readable format
    print("Recommended courses:")
    for i, course in enumerate(recommended_courses, start=1):
        print(f"{i}. {course['title']} (score: {course['score']:.2f})")

if __name__ == "__main__":
    test_content_based()




'''















