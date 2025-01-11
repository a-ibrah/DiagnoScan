import sqlite3

def initialize_database():
    conn = sqlite3.connect('metadata.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,          -- User-visible unique ID
            file_name TEXT NOT NULL,              -- Overwritten file name (e.g., ID.extension)
            google_drive_id TEXT NOT NULL,        -- Google Drive ID
            upload_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending review', -- Status of the file
            classification TEXT DEFAULT NULL,     -- Classification: Benign, Adenocarcinoma, etc.
            patient_name TEXT DEFAULT NULL        -- Patient name associated with the file
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    initialize_database()
    print("Database initialized!")