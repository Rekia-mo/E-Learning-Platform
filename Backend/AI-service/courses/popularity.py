# courses/popularity.py
# Popularity-Based Recommender
# Solves the Cold Start Problem: recommends most enrolled courses to new users
# Methods used: SQL aggregation (COUNT, GROUP BY, ORDER BY) + pandas

import pandas as pd


class PopularityRecommender:
    def __init__(self, enrollments_df, courses_df, categories_df, teachers_df):
        self.enrollments_df = enrollments_df
        self.courses_df = courses_df
        self.category_dict = categories_df.set_index("id")["name"].to_dict()
        self.teacher_dict = teachers_df.set_index("id")["name"].to_dict()

    def recommend(self, top_n=5):
        # Count enrollments per course
          
        popularity = (
            self.enrollments_df
            .groupby("course_id")
            .size()
            .reset_index(name="enrollment_count")
            .sort_values("enrollment_count", ascending=False)
            
        )

        # Take top N
        top_courses = popularity.head(top_n)

        # Join with courses to get titles
        result = top_courses.merge(
            self.courses_df[["id", "title", "categorie_id", "teacher_id"]],
            left_on="course_id",
            right_on="id"
        )

        return [
            {
              "id": row["course_id"],
              "title": row["title"],
              "enrollment_count": int(row["enrollment_count"]),
              "categorie_id": row["categorie_id"],
              "categorie_name": self.category_dict.get(row["categorie_id"]),
              "teacher_id": row["teacher_id"],
              "teacher_name": self.teacher_dict.get(row["teacher_id"]),
}          for _, row in result.iterrows()
        ]