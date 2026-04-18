# utils.py
# use this to activate the virtual environment: .\venv\Scripts\activate from backend folder
# use this to run the FastAPI app: uvicorn AI-service.main:app --reload 
# use this to execute  the test  : python -m courses.test_content fromAI-service
import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load .env file (make sure your .env is in the root of your repo)
load_dotenv()

# Read DB credentials from environment variables
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_DIALECT = os.getenv("DB_DIALECT", "mysql")  # default to mysql

# Create SQLAlchemy engine
engine = create_engine(f"{DB_DIALECT}+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}")


# Utility function to fetch courses from the database
def get_courses_df():
    """
    Fetch all courses from the database as a Pandas DataFrame.
    Returns id, title, description, and category name (instead of categorie_id).
    """
    query = """
    SELECT c.id, c.title, c.description, cat.name AS category_name
    FROM Course c
    JOIN Categorie cat ON c.categorie_id = cat.id;
    """
    df = pd.read_sql(query, engine)
    return df
























