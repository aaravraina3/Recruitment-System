import gspread
import json
import os
from oauth2client.service_account import ServiceAccountCredentials

# Constants
SCOPE = ["https://spreadsheets.google.com/feeds", 'https://www.googleapis.com/auth/spreadsheets',
         "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]

SERVICE_ACCOUNT_FILE = "service_account.json"

# File IDs provided
ONBOARDING_FORM_FILE_ID = "1jiuA01J66Lpn1dEYnpYflFOxfRi_B1GI8Ybks0_or6I"
NETWORKING_DASHBOARD_FILE_ID = "1WuGxXXPdvcgqGQcnxJhYwdvVnZN8GLdpyAgETNcZLdg"

def fetch_roster_from_sheets():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print("Service account file not found.")
        return []

    try:
        gc = gspread.service_account(filename=SERVICE_ACCOUNT_FILE)
        
        # Try Networking Dashboard first
        try:
            sh = gc.open_by_key(NETWORKING_DASHBOARD_FILE_ID)
            # Look for a sheet named "Roster" or "Members" or just take the first one
            worksheet = None
            try:
                worksheet = sh.worksheet("Roster")
            except:
                try:
                    worksheet = sh.worksheet("Members")
                except:
                    worksheet = sh.get_worksheet(0) # Default to first
            
            print(f"Reading from Sheet: {sh.title} - {worksheet.title}")
            records = worksheet.get_all_records()
            
        except Exception as e:
            print(f"Failed to open Networking Dashboard: {e}")
            return []

        roster = []
        for row in records:
            # Normalize keys (handle case sensitivity)
            # We expect: Name, Branch, Role Title (or Role)
            # Check keys
            keys = {k.lower(): k for k in row.keys()}
            
            name_key = keys.get("name")
            branch_key = keys.get("branch")
            role_key = keys.get("role title") or keys.get("role")
            email_key = keys.get("email") or keys.get("email address")

            if not name_key or not row[name_key]:
                continue

            name = str(row[name_key]).strip()
            branch = str(row.get(branch_key, "")).strip()
            role_title = str(row.get(role_key, "")).strip()
            email = str(row.get(email_key, "")).strip()

            # Generate email if missing
            if not email or "@" not in email:
                 parts = name.split()
                 if len(parts) >= 2:
                     email = f"{parts[0].lower()}.{parts[-1].lower()}@generatenu.com"
                 else:
                     email = f"{name.lower()}@generatenu.com"

            # Hierarchy Level
            level = "Member"
            rt_lower = role_title.lower()
            if "director" in rt_lower: level = "Director"
            elif "chief" in rt_lower: level = "Chief"
            elif "lead" in rt_lower: level = "Lead"

            roster.append({
                "name": name,
                "email": email,
                "branch": branch,
                "role": role_title,
                "level": level
            })
            
        # Save to local cache
        with open("data/roster.json", "w") as f:
            json.dump(roster, f, indent=2)
            
        return roster

    except Exception as e:
        print(f"Error fetching from Google Sheets: {e}")
        return []

if __name__ == "__main__":
    roster = fetch_roster_from_sheets()
    print(f"Fetched {len(roster)} members.")

