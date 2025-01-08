import sqlite3
from datetime import datetime
import uuid

def save_metadata(user_id, file_name, google_drive_id, patient_name="John Doe"):
    """Save metadata into the SQLite database."""
    conn = sqlite3.connect('metadata.db')
    cursor = conn.cursor()
    current_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        '''
        INSERT INTO files (user_id, file_name, google_drive_id, patient_name, upload_timestamp)
        VALUES (?, ?, ?, ?, ?)
        ''',
        (user_id, file_name, google_drive_id, patient_name, current_timestamp)
    )
    conn.commit()
    conn.close()

def fetch_data(draw, start, length, search_value, patient_search, timestamp_search, order_column, order_dir, filter_status):
    """Fetch data from the SQLite database with filtering and pagination."""
    conn = sqlite3.connect('metadata.db')
    cursor = conn.cursor()

    column_map = ['id', 'patient_name', 'upload_timestamp', 'status', 'classification', 'google_drive_id']
    order_column_name = column_map[order_column]

    query = """
        SELECT id, patient_name, upload_timestamp, status, classification, google_drive_id
        FROM files WHERE 1=1
    """
    params = []

    if filter_status:
        if filter_status == 'pending':
            query += " AND status = ?"
            params.append('pending review')
        elif filter_status == 'completed':
            query += " AND status != ?"
            params.append('pending review')

    if search_value:
        query += " AND (patient_name LIKE ? OR status LIKE ? OR classification LIKE ?)"
        params.extend([f'%{search_value}%', f'%{search_value}%', f'%{search_value}%'])

    if patient_search:
        query += " AND patient_name LIKE ?"
        params.append(f'%{patient_search}%')

    if timestamp_search:
        query += " AND upload_timestamp LIKE ?"
        params.append(f'%{timestamp_search}%')

    query += f" ORDER BY {order_column_name} {order_dir} LIMIT ? OFFSET ?"
    params.extend([length, start])

    cursor.execute(query, params)
    rows = cursor.fetchall()

    cursor.execute("SELECT COUNT(*) FROM files")
    total_records = cursor.fetchone()[0]

    conn.close()

    return rows, total_records

def generate_user_id():
    """Generate a unique user ID."""
    return f"IMG-{uuid.uuid4().hex[:8].upper()}"

def update_metadata(slide_id, classification):
    """Update metadata for a specific file in the SQLite database."""
    conn = sqlite3.connect('metadata.db')
    cursor = conn.cursor()
    status = f"{classification}"
    cursor.execute(
        """
        UPDATE files
        SET classification = ?, status = ?
        WHERE id = ?
        """,
        (classification, status, slide_id),
    )
    conn.commit()
    conn.close()