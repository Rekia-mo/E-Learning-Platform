# utils.py
# use this to activate the virtual environment: ..\venv\Scripts\activate


#this file contains utility functions to interact with the database and load data into pandas DataFrames for the recommenders. It uses SQLAlchemy to connect to a MySQL database and fetch course information.


import pandas as pd
from sqlalchemy import create_engine

# Update this with your actual DB credentials
DB_USER = "root"
DB_PASSWORD = "slougui12"
DB_HOST = "localhost"
DB_NAME = "ei"

# Create SQLAlchemy engine
engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}")

def get_courses_df():
    """
    Fetch all courses from the database as a Pandas DataFrame.
    Returns id, description, and category name (instead of categorie_id).
    """
    query = """
    SELECT c.id, c.description, cat.name AS category_name
    FROM Course c
    JOIN Categorie cat ON c.categorie_id = cat.id;
    """
    df = pd.read_sql(query, engine)
    return df