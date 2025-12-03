import os
import glob
from dotenv import load_dotenv
from rag import ChatHandler

load_dotenv()

DATA_DIR = "data"

def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in .env")
        return

    handler = ChatHandler(api_key)
    
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Created {DATA_DIR} directory. Place .txt or .md files here.")
        return

    files = glob.glob(f"{DATA_DIR}/*.txt") + glob.glob(f"{DATA_DIR}/*.md")
    
    if not files:
        print("No files found in data/ directory.")
        return

    print(f"Found {len(files)} files. Ingesting...")
    
    for filepath in files:
        print(f"Processing {filepath}...")
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                text = f.read()
                handler.ingest_text(text, {"source": os.path.basename(filepath)})
        except Exception as e:
            print(f"Failed to process {filepath}: {e}")

    print("Ingestion complete!")

if __name__ == "__main__":
    main()

