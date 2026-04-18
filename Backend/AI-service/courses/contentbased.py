# contentbased.py
# Professional Content-Based Recommender
# this content-based recommender uses a simple ML technique (TF-IDF) for text representation, but it does not learn from user behavior over time. So it’s partly machine learning (for text similarity) but not an adaptive, learning-from-data system.
# Uses course titles, categories, and descriptions
# Weights title more, category medium, description less(manually set weights)
#The system primarily recommends courses to users based on their enrollments. Additionally, a course-based recommendation function is implemented for extensibility (so there is 2 functions: recommend(course_id) and recommend_for_user(user_id)).

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class CourseRecommender:
    def __init__(self, courses_df):
        self.df = courses_df.copy()

        # Similarity matrices
        self.sim_title = None
        self.sim_category = None
        self.sim_description = None
        self.final_similarity = None

    def preprocess(self):
        # Clean -> convert to string and lowercase
        self.df["title"] = self.df["title"].astype(str).str.lower()
        self.df["category_name"] = self.df["category_name"].astype(str).str.lower()
        self.df["description"] = self.df["description"].astype(str).str.lower()

    def build_model(self):
        # TF-IDF for each field
        tfidf = TfidfVectorizer(stop_words='english')

        title_matrix = tfidf.fit_transform(self.df["title"])
        category_matrix = tfidf.fit_transform(self.df["category_name"])
        description_matrix = tfidf.fit_transform(self.df["description"])

        # Compute similarities
        self.sim_title = cosine_similarity(title_matrix)
        self.sim_category = cosine_similarity(category_matrix)
        self.sim_description = cosine_similarity(description_matrix)

        # Weighted combination
        self.final_similarity = (
            0.5 * self.sim_title +
            0.3 * self.sim_category +
            0.2 * self.sim_description
        )

    def recommend(self, course_id, top_n=5):
        if self.final_similarity is None:
            raise Exception("Model not built yet. Call build_model() first.")

        try:
            idx = self.df[self.df["id"] == course_id].index[0]
        except IndexError:
            raise Exception(f"Course ID {course_id} not found.")

        scores = list(enumerate(self.final_similarity[idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)

        top_courses = scores[1:top_n+1]

        return [
            {
                "id": self.df.iloc[i[0]]["id"],
                "title": self.df.iloc[i[0]]["title"],
                "score": round(i[1], 3)
            }
            for i in top_courses
        ]

    # 🔥 NEW FEATURE: USER-BASED RECOMMENDATION
    def recommend_for_user(self, user_id, enrollments_df, top_n=5):
        if self.final_similarity is None:
            raise Exception("Model not built yet. Call build_model() first.")

        # 🔹 Get courses enrolled by user
        user_courses = enrollments_df[
            enrollments_df["user_id"] == user_id
        ]["course_id"].tolist()

        # 🔹 If user has no enrollments
        if not user_courses:
            return []

        scores = {}

        # 🔹 Loop over each enrolled course
        for course_id in user_courses:
            try:
                idx = self.df[self.df["id"] == course_id].index[0]
            except IndexError:
                continue  # skip if course not found

            sim_scores = list(enumerate(self.final_similarity[idx]))

            for i, score in sim_scores:
                course_i_id = self.df.iloc[i]["id"]

                # Skip already enrolled courses
                if course_i_id in user_courses:
                    continue

                if course_i_id not in scores:
                    scores[course_i_id] = 0

                # 🔥 Aggregate similarity scores
                scores[course_i_id] += score

        # 🔹 Sort by aggregated score
        sorted_courses = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        # 🔹 Take top N
        top_courses = sorted_courses[:top_n]

        # 🔹 Return structured result
        return [
            {
                "id": course_id,
                "title": self.df[self.df["id"] == course_id]["title"].values[0],
                "score": round(score, 3)
            }
            for course_id, score in top_courses
        ]





















'''
# contentbased.py
# Professional Content-Based Recommender
# this content-based recommender uses a simple ML technique (TF-IDF) for text representation, but it does not learn from user behavior over time. So it’s partly machine learning (for text similarity) but not an adaptive, learning-from-data system.
# Uses course titles, categories, and descriptions
# Weights title more, category medium, description less(manually set weights)



import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class CourseRecommender:
    def __init__(self, courses_df):
        self.df = courses_df.copy()

        # Similarity matrices
        self.sim_title = None
        self.sim_category = None
        self.sim_description = None
        self.final_similarity = None

    def preprocess(self):
        # Clean ->  convert to string and lowercase for each column(field)
        self.df["title"] = self.df["title"].astype(str).str.lower()
        self.df["category_name"] = self.df["category_name"].astype(str).str.lower()
        self.df["description"] = self.df["description"].astype(str).str.lower()

    def build_model(self):
        # TF-IDF for each field
        tfidf = TfidfVectorizer(stop_words='english')

        title_matrix = tfidf.fit_transform(self.df["title"])
        category_matrix = tfidf.fit_transform(self.df["category_name"])
        description_matrix = tfidf.fit_transform(self.df["description"])

        # Compute similarities
        self.sim_title = cosine_similarity(title_matrix)
        self.sim_category = cosine_similarity(category_matrix)
        self.sim_description = cosine_similarity(description_matrix)

        # 🔥 Weighted combination
        self.final_similarity = (
            0.5 * self.sim_title +
            0.3 * self.sim_category +
            0.2 * self.sim_description
        )

    def recommend(self, course_id, top_n=5):
        if self.final_similarity is None:
            raise Exception("Model not built yet. Call build_model() first.")

        try:
            idx = self.df[self.df["id"] == course_id].index[0]
        except IndexError:
            raise Exception(f"Course ID {course_id} not found.")

        scores = list(enumerate(self.final_similarity[idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)

        top_courses = scores[1:top_n+1]

        return [
            {
                "id": self.df.iloc[i[0]]["id"],
                "title": self.df.iloc[i[0]]["title"],
                "score": round(i[1], 3)
            }
            for i in top_courses
        ]




#✅ Features now:

#Weighted content (title > category > description)[manually set weights]
#Returns course names for readability
#Professional text cleaning + TF-IDF
#Handles errors gracefully



'''











































































'''
# content_based.py
# Your content-based recommender uses a simple ML technique (TF-IDF) for text representation, but it does not learn from user behavior over time. So it’s partly machine learning (for text similarity) but not an adaptive, learning-from-data system.
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


    # preprocess fait le travail de concatener la description et la categorie pour chaque cours, afin d'avoir une representation textuelle plus riche pour le TF-IDF. Cela permet au modèle de capturer à la fois les informations de la description et de la catégorie lors du calcul des similarités.
    def preprocess(self):

        # Combine category + description into a single text column
        self.df["content"] = self.df["category_name"].astype(str) + " " + self.df["description"].astype(str)


    # build_model crée la matrice de similarité en utilisant TF-IDF pour vectoriser le contenu textuel des cours, puis calcule la similarité cosinus entre les vecteurs. Cette matrice de similarité est ensuite utilisée pour recommander des cours similaires.
    def build_model(self):
        # TF-IDF vectorization + cosine similarity
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df["content"])
        self.similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)



     #recommend prend un course_id et retourne les IDs des cours les plus similaires en se basant sur la matrice de similarité calculée. Il trie les scores de similarité et retourne les top_n cours les plus similaires, en excluant le cours lui-même.
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
'''