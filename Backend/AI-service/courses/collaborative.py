import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class CourseRecommender:

    def __init__(self, courses_df):
        self.df = courses_df
        self.similarity_matrix = None

    def preprocess(self):
        self.df["content"] = self.df["category"] + " " + self.df["description"]

    def build_model(self):
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df["content"])
        self.similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

    def recommend(self, course_id, top_n=5):
        idx = self.df[self.df["id"] == course_id].index[0]
        scores = list(enumerate(self.similarity_matrix[idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)
        top_courses = scores[1:top_n+1]
        return [self.df.iloc[i[0]]["id"] for i in top_courses]