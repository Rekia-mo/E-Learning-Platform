
# cf_based.py
# Memory-Based Collaborative Filtering: uses user-course interactions
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

class CollaborativeRecommender:
    def __init__(self, interactions_df):
        """
        interactions_df: pandas DataFrame with columns: ['user_id', 'course_id', 'rating']
        """
        self.df = interactions_df.copy()
        self.user_item_matrix = None

    def build_matrix(self):
        # Pivot to create user-item matrix, missing ratings filled with 0
        self.user_item_matrix = self.df.pivot_table(
            index='user_id',
            columns='course_id',
            values='rating'
        ).fillna(0)

    def recommend(self, user_id, top_n=5):
        """
        Recommend top_n courses for a given user_id
        """
        if self.user_item_matrix is None:
            raise Exception("Matrix not built yet. Call build_matrix() first.")
        if user_id not in self.user_item_matrix.index:
            raise Exception(f"User ID {user_id} not found.")
        
        user_vector = self.user_item_matrix.loc[user_id].values.reshape(1, -1)
        similarities = cosine_similarity(user_vector, self.user_item_matrix)[0]
        similar_users = self.user_item_matrix.index[similarities.argsort()[::-1][1:]]  # skip self
        
        recommended = {}
        for sim_user in similar_users:
            for course, rating in self.user_item_matrix.loc[sim_user].items():
                if self.user_item_matrix.loc[user_id, course] == 0 and rating > 0:
                    recommended[course] = recommended.get(course, 0) + rating
        
        # Sort by aggregated score
        top_courses = sorted(recommended, key=recommended.get, reverse=True)[:top_n]
        return top_courses

# Example usage:
# df = get_interactions_df()  # from utils.py
# cf = CollaborativeRecommender(df)
# cf.build_matrix()
# cf.recommend(user_id=1)