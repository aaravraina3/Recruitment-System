# ETL Pipeline

from fastapi import FastAPI
import pandas as pd
from googleapiclient.discovery import build

from .extract import sheet_to_df
from .transform import clean_applications, get_branch_queues, find_incompleted, find_unreviewed
from .load import update_review_queues, trigger_incomplete_emails, update_dashboard_metrics

app = FastAPI()

@app.post ("/api/etl/run")
def run_etl():
    return {"message": "Run ETL"}

def daily_etl_pipeline():
    # EXTRACT - Get data from Google Sheets
    sheet_name = "Sheet Name"
    data = sheet_to_df(sheet_name, "A:Z")
    
    # TRANSFORM - Clean and process
    # Remove duplicates/validate emails
    data = data.clean_applications()
    
    # Categorize by branch (i do this in the api kinda)
    branch_queues = data.groupby('branch')
    
    # Find incomplete (missing required fields)
    incomplete = find_incompleted(data)
    
    # Find unreviewed
    reviewed_ids = set(decisions['application_id'])
    unreviewed = data[~data['id'].isin(reviewed_ids)]
    
    # LOAD - Update systems
    update_review_queues(branch_queues)
    trigger_incomplete_emails(incomplete)
    update_dashboard_metrics(apps_df)