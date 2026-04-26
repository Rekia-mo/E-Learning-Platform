
# collaborative.py
#uses dictionary to present the data
# Uses user-course matrix and cosine_similarity for collaborative filtering





import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


class CollaborativeRecommender:
    def __init__(self, enrollments_df, courses_df, categories_df, teachers_df):
        self.enrollments_df = enrollments_df
        self.courses_df = courses_df
        self.categories_df = categories_df
        self.teachers_df = teachers_df

        self.user_course_matrix = None
        self.user_similarity = None

        self.course_dict = {}
        self.category_dict = {}
        self.teacher_dict = {}

    def build_model(self):
        # User-course matrix
        self.user_course_matrix = self.enrollments_df.pivot_table(
            index="user_id",
            columns="course_id",
            aggfunc=lambda x: 1,
            fill_value=0
        )

        # User similarity (cosine)
        self.user_similarity = cosine_similarity(self.user_course_matrix)
        self.user_similarity = pd.DataFrame(
            self.user_similarity,
            index=self.user_course_matrix.index,
            columns=self.user_course_matrix.index
        )

        # Lookups
        self.course_dict = self.courses_df.set_index("id").to_dict("index")
        self.category_dict = self.categories_df.set_index("id")["name"].to_dict()
        self.teacher_dict = self.teachers_df.set_index("id")["name"].to_dict()

    def recommend_for_user(self, user_id, top_n=5):
        if self.user_similarity is None:
            raise Exception("Model not built yet.")

        if user_id not in self.user_course_matrix.index:
            return []

        sim_scores = self.user_similarity[user_id].drop(user_id)
        sim_scores = sim_scores.sort_values(ascending=False).head(10)

        enrolled_courses = set(
            self.user_course_matrix.loc[user_id][
                self.user_course_matrix.loc[user_id] == 1
            ].index
        )

        scores = {}

        for other_user, sim_score in sim_scores.items():
            if sim_score < 0.1:
                continue

            other_courses = set(
                self.user_course_matrix.loc[other_user][
                    self.user_course_matrix.loc[other_user] == 1
                ].index
            )

            new_courses = other_courses - enrolled_courses

            for course_id in new_courses:
                scores[course_id] = scores.get(course_id, 0) + sim_score

        max_score = max(scores.values()) if scores else 1
        scores = {k: v / max_score for k, v in scores.items()}

        sorted_courses = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top_courses = sorted_courses[:top_n]

        results = []

        for course_id, score in top_courses:
            if course_id in self.course_dict:
                course = self.course_dict[course_id]

                results.append({
                    "id": course_id,
                    "title": course.get("title"),
                    "score": round(score, 3),

                    "categorie_id": course.get("categorie_id"),
                    "categorie_name": self.category_dict.get(course.get("categorie_id")),

                    "teacher_id": course.get("teacher_id"),
                    "teacher_name": self.teacher_dict.get(course.get("teacher_id")),
                })

        return results