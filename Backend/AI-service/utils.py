#utils.py
#ce fichier :#se connecter à la base de données
             #récupérer des données (cours, inscriptions=enrollments)
             #les transformer en format exploitable (DataFrame)

# use this to activate the virtual environment: .\venv\Scripts\activate from backend folder
# use this to run the FastAPI :   uvicorn main:app --reload  from AI-service folder
# Get-ChildItem -Recurse -Filter __pycache__ | Remove-Item -Recurse -Force     from AI-service folder


import os                            #pour lire les variables d’environnements
import pandas as pd                  #pour manipuler les données (DataFrame)
from sqlalchemy import create_engine #pour créer la connexion à la base de données
from dotenv import load_dotenv       #pour charger les variables du fichier .env

# Load .env file to get DB credentials
load_dotenv()

# Read DB credentials from environment variables
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_DIALECT = os.getenv("DB_DIALECT", "mysql")  # default to mysql

# Create SQLAlchemy engine to connect to the database
engine = create_engine(f"{DB_DIALECT}+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}")


# Utility functions to fetch courses  , enrollements, categories, and teachers from the database
def get_courses_df():
    """
    Fetch all courses from the database as a Pandas DataFrame.
    Returns id, title, description, categorie_id, teacher_id, and category name.
    """
    query = """
    SELECT c.id, c.title, c.description, c.categorie_id, c.teacher_id, cat.name AS category_name
    FROM Course c
    JOIN Categorie cat ON c.categorie_id = cat.id;
    """
    return pd.read_sql(query, engine)



def get_enrollments_df():
    """
    Fetch all enrollments from the database.
    Returns user_id and course_id — exactly what the recommender needs.
    """
    query = """
    SELECT user_id, course_id
    FROM Enrollment;
    """
    return pd.read_sql(query, engine)



def get_categories_df():
    query = """
    SELECT id, name
    FROM Categorie;
    """
    return pd.read_sql(query, engine)



def get_teachers_df():
    query = """
    SELECT t.id, u.name
    FROM Teacher t
    JOIN User u ON t.user_id = u.id;
    """
    return pd.read_sql(query, engine)














