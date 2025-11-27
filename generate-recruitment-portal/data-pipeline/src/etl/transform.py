# transform data

from fastapi import FastAPI
import pandas as pd

app = FastAPI()

@app.post ("/api/etl/run/transform")
def transform_Data():
    return {"message": "Data Transformed"}

def clean_applications(applications):
    # Remove duplicates
    df = df.drop_duplicates(subset=["email"])

    # validate emails
    df = df[df["email"].str.contains("@")]

def get_branch_queues(df):
    return df.groupby("branch")

def find_incompleted(df):
    return df[df["experience"].isna()]..

def find_unreviewed(df, reviewed_ids):
    return df[~df['id'].isin(reviewed_ids)]