# content_based.py
# Content-Based Recommender: uses course descriptions + categories
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class CourseRecommender:
    def __init__(self, courses_df):
        """
        courses_df: pandas DataFrame with columns: ['id', 'category', 'description']
        """
        self.df = courses_df.copy()
        self.similarity_matrix = None

    def preprocess(self):
        # Combine category + description into a single text column
        self.df["content"] = self.df["category_name"].astype(str) + " " + self.df["description"].astype(str)

    def build_model(self):
        # TF-IDF vectorization + cosine similarity
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df["content"])
        self.similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

    def recommend(self, course_id, top_n=5):
        """
        Recommend top_n courses similar to the given course_id
        """
        if self.similarity_matrix is None:
            raise Exception("Model not built yet. Call build_model() first.")
        try:
            idx = self.df[self.df["id"] == course_id].index[0]
        except IndexError:
            raise Exception(f"Course ID {course_id} not found.")
        
        scores = list(enumerate(self.similarity_matrix[idx]))
        # Sort by similarity descending
        scores = sorted(scores, key=lambda x: x[1], reverse=True)
        top_courses = scores[1:top_n+1]  # skip the course itself
        return [self.df.iloc[i[0]]["id"] for i in top_courses]

# Example usage:
# df = get_courses_df()  # from utils.py
# rec = CourseRecommender(df)
# rec.preprocess()
# rec.build_model()
# rec.recommend(course_id=1)