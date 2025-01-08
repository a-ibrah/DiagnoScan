import os
import json
import base64
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv
from googleapiclient.errors import HttpError

# Load environment variables
load_dotenv()
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_KEY_BASE64 = os.getenv('SERVICE_ACCOUNT_KEY_BASE64')
PARENT_FOLD_ID = os.getenv('GOOGLE_DRIVE_FOLDER_ID')

def authenticate():
    """Authenticate with Google Drive using service account credentials."""
    key_data = json.loads(base64.b64decode(SERVICE_ACCOUNT_KEY_BASE64).decode('utf-8'))
    return Credentials.from_service_account_info(key_data, scopes=SCOPES)

def upload_photo(file_path):
    """Upload a file to Google Drive."""
    try:
        creds = authenticate()
        drive_service = build('drive', 'v3', credentials=creds)
        metadata = {'name': os.path.basename(file_path), 'parents': [PARENT_FOLD_ID]}
        media = MediaFileUpload(file_path, resumable=True)
        file = drive_service.files().create(body=metadata, media_body=media, fields='id').execute()
        return {"status": "success", "file_id": file.get('id')}
    except HttpError as e:
        return {"status": "error", "message": str(e)}