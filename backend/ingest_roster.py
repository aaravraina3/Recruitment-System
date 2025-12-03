import csv
import json
import os

CSV_PATH = "../../F25 Member Roster - Members.csv"
JSON_PATH = "data/roster.json"

def parse_roster():
    if not os.path.exists(CSV_PATH):
        print(f"Error: Could not find {CSV_PATH}")
        return

    roster = []
    
    try:
        with open(CSV_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row.get("Name", "").strip()
                if not name: continue
                
                branch = row.get("Branch", "").strip()
                role_title = row.get("Role Title", "").strip()
                
                # Generate email placeholder
                # format: firstname.lastname@generatenu.com
                parts = name.split()
                if len(parts) >= 2:
                    email = f"{parts[0].lower()}.{parts[-1].lower()}@generatenu.com"
                else:
                    email = f"{name.lower()}@generatenu.com"
                
                # Normalize Role for Hierarchy
                # We store the actual title for display, but helpful to tag the 'level'
                level = "Member"
                rt_lower = role_title.lower()
                if "director" in rt_lower:
                    level = "Director"
                elif "chief" in rt_lower:
                    level = "Chief"
                elif "lead" in rt_lower:
                    level = "Lead"
                
                roster.append({
                    "name": name,
                    "email": email,
                    "branch": branch,
                    "role": role_title,
                    "level": level
                })
                
    except Exception as e:
        print(f"Error parsing CSV: {e}")
        return

    # Ensure data directory exists
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    
    with open(JSON_PATH, "w") as f:
        json.dump(roster, f, indent=2)
        
    print(f"Successfully converted {len(roster)} rows to {JSON_PATH}")
    print("NOTE: Emails were auto-generated. Please manually verify roster.json matches actual Clerk emails.")

if __name__ == "__main__":
    parse_roster()

