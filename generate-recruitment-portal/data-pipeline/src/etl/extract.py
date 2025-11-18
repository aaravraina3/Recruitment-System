# extract data

import pandas as pd
from fastapi import FastAPI
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials

app = FastAPI()

@app.post ("/api/etl/run/extract")
def extract_data():
    return {"message": "Data Extracted"}

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

def fetch_applications_from_sheets():
    '''Get applications from sheets'''
    creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)
    applications = build("sheets", "v4")
    
    return applications.spreadshets().values()

def sheet_to_df(sheet_id, sheet_range):
    values = fetch_applications_from_sheets().get(
        spreadsheetId=sheet_id,
        range=sheet_range
    ).execute()

    rows = values.get("values", [])
    if not rows:
        return pd.DataFrame()

    headers = rows[0]
    data = rows[1:]

    return pd.DataFrame(data, columns=headers)