from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from datetime import datetime, timezone # Changed to timezone for UTC
import uuid

# Assuming UserInDB, get_current_admin_user, Problem, Competition, CompetitionCreate, CompetitionUpdate
# problems_collection, competitions_collection are in backend.server or a shared models/db file.
from backend.server import (
    UserInDB,
    get_current_admin_user,
    Problem, # This is the main Problem model from server.py
    problems_collection,
    Competition, # This is the main Competition model from server.py
    CompetitionCreate, # From server.py
    CompetitionUpdate, # From server.py
    competitions_collection
)
# PyMongo's ReturnDocument for find_one_and_update
from pymongo import ReturnDocument


admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin Management"],
    dependencies=[Depends(get_current_admin_user)] # Apply admin protection to all routes
)

# --- Pydantic Models for Problem (Create/Update) ---
# These models define the shape of data for creating and updating problems
# specifically for the admin interface.

class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str
    category: str
    domain: str
    company: Optional[str] = None
    time_limit: Optional[int] = 60
    sample_framework: Optional[str] = None

class ProblemCreate(ProblemBase):
    pass # Inherits all fields from ProblemBase

class ProblemUpdate(BaseModel): # All fields optional for PATCH-like behavior
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    domain: Optional[str] = None
    company: Optional[str] = None
    time_limit: Optional[int] = None
    sample_framework: Optional[str] = None
    # updated_at will be set automatically by the server logic

# Helper to ensure 'id' field from MongoDB document (which might be 'id' or '_id')
# is correctly represented in the Pydantic model.
# Since we are consistently using a string 'id' field in DB documents,
# this mainly ensures the model is built correctly if there are any discrepancies.
def map_db_doc_to_model(db_doc: dict, model: type):
    if "_id" in db_doc and "id" not in db_doc : # If Mongo's _id is present and string 'id' is not
        db_doc["id"] = str(db_doc["_id"])
    # If 'id' is already a string field (as we intend), this won't hurt.
    return model(**db_doc)

# --- Problem Management Endpoints ---

@admin_router.post("/problems", response_model=Problem, status_code=status.HTTP_201_CREATED)
async def create_problem_endpoint(problem_data: ProblemCreate):
    now = datetime.now(timezone.utc) # Use timezone-aware UTC
    problem_id = str(uuid.uuid4())   # Standard UUID format

    problem_doc = problem_data.dict()
    problem_doc["id"] = problem_id
    problem_doc["created_at"] = now
    problem_doc["updated_at"] = now

    await problems_collection.insert_one(problem_doc)
    # Fetch the inserted document to ensure it's what we expect, matching the Problem model
    created_db_doc = await problems_collection.find_one({"id": problem_id})
    if not created_db_doc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create problem")
    return map_db_doc_to_model(created_db_doc, Problem)

@admin_router.get("/problems", response_model=List[Problem])
async def list_problems_endpoint(skip: int = 0, limit: int = 100):
    cursor = problems_collection.find().skip(skip).limit(limit)
    return [map_db_doc_to_model(doc, Problem) async for doc in cursor]

@admin_router.get("/problems/{problem_id}", response_model=Problem)
async def get_problem_endpoint(problem_id: str):
    db_doc = await problems_collection.find_one({"id": problem_id})
    if not db_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return map_db_doc_to_model(db_doc, Problem)

@admin_router.put("/problems/{problem_id}", response_model=Problem)
async def update_problem_endpoint(problem_id: str, problem_data: ProblemUpdate):
    update_values = problem_data.dict(exclude_unset=True)
    if not update_values:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update data provided")

    update_values["updated_at"] = datetime.now(timezone.utc)

    updated_db_doc = await problems_collection.find_one_and_update(
        {"id": problem_id},
        {"$set": update_values},
        return_document=ReturnDocument.AFTER # Use PyMongo's ReturnDocument
    )

    if not updated_db_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found or not updated")
    return map_db_doc_to_model(updated_db_doc, Problem)

@admin_router.delete("/problems/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_problem_endpoint(problem_id: str):
    delete_result = await problems_collection.delete_one({"id": problem_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    # No content to return for 204

# --- Competition Management Endpoints ---

@admin_router.post("/competitions", response_model=Competition, status_code=status.HTTP_201_CREATED)
async def create_competition_endpoint(competition_data: CompetitionCreate):
    now = datetime.now(timezone.utc)
    competition_id = str(uuid.uuid4().hex) # As per Competition model default in server.py

    competition_doc = competition_data.dict()
    competition_doc["id"] = competition_id
    competition_doc["created_at"] = now
    competition_doc["updated_at"] = now
    # is_active is part of CompetitionCreate via CompetitionBase

    await competitions_collection.insert_one(competition_doc)
    created_db_doc = await competitions_collection.find_one({"id": competition_id})
    if not created_db_doc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create competition")
    return map_db_doc_to_model(created_db_doc, Competition)

@admin_router.get("/competitions", response_model=List[Competition])
async def list_competitions_endpoint(skip: int = 0, limit: int = 100):
    cursor = competitions_collection.find().skip(skip).limit(limit)
    return [map_db_doc_to_model(doc, Competition) async for doc in cursor]

@admin_router.get("/competitions/{competition_id}", response_model=Competition)
async def get_competition_endpoint(competition_id: str):
    db_doc = await competitions_collection.find_one({"id": competition_id})
    if not db_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Competition not found")
    return map_db_doc_to_model(db_doc, Competition)

@admin_router.put("/competitions/{competition_id}", response_model=Competition)
async def update_competition_endpoint(competition_id: str, competition_data: CompetitionUpdate):
    update_values = competition_data.dict(exclude_unset=True)
    if not update_values:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update data provided")

    # CompetitionUpdate model from server.py already sets updated_at.
    # We can rely on that or override here for explicitness.
    update_values["updated_at"] = datetime.now(timezone.utc)

    updated_db_doc = await competitions_collection.find_one_and_update(
        {"id": competition_id},
        {"$set": update_values},
        return_document=ReturnDocument.AFTER
    )

    if not updated_db_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Competition not found or not updated")
    return map_db_doc_to_model(updated_db_doc, Competition)

@admin_router.delete("/competitions/{competition_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_competition_endpoint(competition_id: str):
    delete_result = await competitions_collection.delete_one({"id": competition_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Competition not found")
    # No content for 204
