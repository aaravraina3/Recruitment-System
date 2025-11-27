# validate data

def valid_email(email:str):
    if "@northeastern.edu" in email:
        return True
    else:
        return False