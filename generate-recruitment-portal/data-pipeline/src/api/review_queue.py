# review queue

from fastapi import FastAPI
import pandas as pd
from pydantic import BaseModel

class DecisionInput(BaseModel):
    decision: str
    reviewer: str

data = pd.read_csv("Fillout Data Member App results.csv", dtype={"NUID": str})
data = data.fillna(value="")

app = FastAPI()
print("FastAPI import succeeded")

# branches of generate, subject to change with new org chart updates
branches = ["management", "hardware", 
            "software", "data", "finance", 
            "marketing", "community"]

@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI."}

# add additional columns
for column in ['status', 'decision', 'reviewer', 'history']:
    if column == "status":
        if column not in data.columns:
            data[column] = 'Unreviewed'
    if column == "history":
        if column not in data.columns:
            data[column] = [[] for _ in range(len(data))]
    if column not in data.columns:
        data[column] = ''

# retrieve unreviewed applications
# @app.get ("/api/review/queue")
# def get_unreviewed_apps():
#     # find all applications with unreviewed stuats
#     unreviewed = data[data['status'] == 'unreviewed']
#     return {
#         "message": "Unreviewed Applications Retrieved", 
       
#         # Print first and last name of unreviewed apps
#         "data": unreviewed['First Name'] + " " + unreviewed['Last Name']
#         }

# create branch specific end points
for branch in branches:
    @app.get ("/api/review/queue/{branch}")
    # standardize branch name with capital first letter
    def get_branch_app(branch: str):
        # make sure branch name is valid
        if branch not in branches:
            return {"error": "Invalid branch"}

        branch_name = branch[0].upper() + branch[1:].lower

        # TODO: need to create branch column for dataset to organize by branch
        branch_apps = data[data["branch"] == branch]
        
        # find branch's unreviewed applications
        unreviewed = branch_apps[branch_apps['status'] == 'unreviewed']
        names = (unreviewed['First Name'] + " " + unreviewed['Last Name']).tolist()

        return {
            "message": f"Unreviewed Applications Retrieved for {branch_name}", 
            
            # get count of unreviewed applications
            "count": len(unreviewed),

            # Print first and last name of unreviewed apps
            "data": names
            }

    # find app summary by branch    
    @app.get ("/api/review/queue/{branch}/summary")
    def get_branch_app_summary(branch: str):
        # ensure branch name is valid
        if branch not in branches:
            return {"error": "Invalid branch"}
        
        # standardize name formatting
        branch_name = branch[0].upper() + branch[1:].lower

        # find all branch applications and unreviewed branch apps
        branch_apps = data[data["branch"] == branch]
        unreviewed = branch_apps[branch_apps["status"] == "unreviewed"]

        # calculate total applications and num reviewed and unreviewed
        return {"message": f"{branch_name} Apps Summary",
                "Total Applications": len(branch_apps),
                "Reviewed Applications": len(branch_apps) - len(unreviewed),
                "Unreviewed Applications:": len(unreviewed)
                }
    
@app.post ("/api/review/claim/{NUID}")
def claim_app(NUID: str, review = DecisionInput):
    # search for applications based on NUID
    app = data[data["NUID"] == NUID]

    # ensure NUID is valid/was used to apply
    if app.empty:
        return {"error": "Application not found"}
    
    if app['status'] == "Unreviewed":
        # change app status to "in review"
        data.at[app.index[0], "reviewer"] = review.reviewer
        
        data.at[app.index[0], "status"] = "In Review"

        app = app.iloc[0].to_dict()
        return {"message": "Application: In Review",
            "Application": app}
    
    # if application not in unreviewed stage, report current stage and reviewer
    else:
        return {"message": "Application is already in review/has been reviewed",
                "Reviewer": app['reviewer'],
                "Status": app['status'],
                "Application": app}

@app.post ("/api/review/release/{NUID}")
def release_app(NUID: str):
    # search for applications based on NUID
    app = data[data["NUID"] == NUID]

    # ensure NUID is valid/was used to apply
    if app.empty:
        return {"error": "Application not found"}
    
    if app['status'] == "In Review":
        # change app status to "reviewed"
        data.at[app.index[0], "status"] = "Reviewed"

        app = app.iloc[0].to_dict()
        return {"message": "Application: Reviewed",
            "application": app}

    # if application not in review, report current status
    else:
        return {"message": "This application has not been claimed yet/has been reviewed",
                "Status": app['status'],
                "Reviewer": app['reviewer'],
                "Application": app}

@app.post ("/api/review/decision/{NUID}")
def app_decision(NUID: str, review: DecisionInput):
    # search for applications based on NUID
    app = data[data["NUID"] == NUID]

    # ensure NUID is valid/was used to apply
    if app.empty:
        return {"error": "Application not found"}
    
    if review.decision.lower() not in ["accept", "reject", "waitlist"]:
        return {"message": "Invalid Decision"}

    # update decision info
    data.at[app.index[0], "decision"] = review.decision
    
    # update application history
    data.at[app.index[0], "history"].append({
        "decision": review.decision,
        "reviewer": review.reviewer
    })

    app = app.iloc[0].to_dict()
    return {"message": f"Application: {review.decision}",
        "application": app}

@app.get ("/api/review/history/{NUID}")
def app_history(NUID: str):
    app = data[data["NUID"] == NUID]
    
    if app.empty:
        return {"error": "Application not found"}

    # return the history value
    history = app.iloc[0]["history"]

    return {"History": history}

@app.get ("/api/review/stats/reviewer/{name}")
def reviewer_stats(name: str):
    reviewer_apps = data[data["reviewer"] == name]

    acceptances = reviewer_apps[reviewer_apps["decision"] == "accept"]
    waitlists = reviewer_apps[reviewer_apps["decision"] == "waitlist"]
    rejects = reviewer_apps[reviewer_apps["decision"] == "rejects"]

    total_reviews = len(reviewer_apps)
    total_accepts = len(acceptances)
    total_waitlists = len(waitlists)
    total_rejects = len(rejects)

    return {"message": name[0].upper() + name[1:].lower() + " Stats",
            "Number of Reviews": total_reviews,
            "Number of Acceptances": total_accepts,
            "Number of Waitlists": total_waitlists,
            "Number of Rejects": total_rejects}