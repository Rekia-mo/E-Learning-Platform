
 # main.py

from fastapi import FastAPI
from courses.routes import router as courses_router

app = FastAPI()

app.include_router(courses_router)

# Route principale (home)
@app.get("/")
def home():
    return {"msg": "Hello world"}