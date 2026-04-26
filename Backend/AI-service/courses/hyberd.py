# hybrid.py
# Hybrid Recommender: combines CB + CF modes
# Final score = (CB score × 0.5) + (CF score × 0.5)

class HybridRecommender:
    def __init__(self, cb_recommender, cf_recommender, enrollments_df):
        self.cb_recommender = cb_recommender
        self.cf_recommender = cf_recommender
        self.enrollments_df = enrollments_df

    def recommend_for_user(self, user_id, top_n=5):
        # Get CB recommendations
        cb_results = self.cb_recommender.recommend_for_user(
            user_id=user_id,
            enrollments_df=self.enrollments_df,
            top_n=20  # get more than needed for merging
        )

        # Get CF recommendations
        cf_results = self.cf_recommender.recommend_for_user(
            user_id=user_id,
            top_n=20  # get more than needed for merging
        )

        # Convert to dictionaries for easy lookup {course_id: data}
        cb_dict = {r["id"]: r for r in cb_results}
        cf_dict = {r["id"]: r for r in cf_results}

        # Get all unique course ids from both modes
        all_course_ids = set(cb_dict.keys()) | set(cf_dict.keys())

        # Combine scores
        hybrid_scores = {}
        for course_id in all_course_ids:
            cb_score = cb_dict[course_id]["score"] if course_id in cb_dict else 0
            cf_score = cf_dict[course_id]["score"] if course_id in cf_dict else 0

            hybrid_scores[course_id] = (cb_score * 0.5) + (cf_score * 0.5)

        # Sort by hybrid score
        sorted_courses = sorted(
            hybrid_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:top_n]

        # Build final result
        results = []
        for course_id, score in sorted_courses:
            # Get course data from CB or CF
            course_data = cb_dict.get(course_id) or cf_dict.get(course_id)

            results.append({
                "id": course_id,
                "title": course_data["title"],
                "score": round(score, 3),
                "categorie_id": course_data.get("categorie_id"),
                "categorie_name": course_data.get("categorie_name"),
                "teacher_id": course_data.get("teacher_id"),
                "teacher_name": course_data.get("teacher_name"),
            })

        return results