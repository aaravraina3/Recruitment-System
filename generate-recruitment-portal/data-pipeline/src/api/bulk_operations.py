# bulk operations

from fastapi import FastAPI

app = FastAPI()
print("FastAPI import succeeded")

@app.post ("/api/review/bulk/assign")
def bulk_assign():
    return {"message": "Bulk Assign"}

@app.post ("/api/review/bulk/advance")
def bulk_advance():
    return {"message": "Bulk Advance"}

@app.post ("/api/review/bulk/decision")
def bulk_decision():
    return {"message": "Bulk Decision"}