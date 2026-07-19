import os
import pymysql
from dotenv import load_dotenv

# Load env variables from backend/.env
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', '.env')
load_dotenv(dotenv_path)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_NAME", "guardianx")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")

def run_migration():
    print(f"Connecting to database {DB_NAME} on {DB_HOST}:{DB_PORT}...")
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    try:
        with connection.cursor() as cursor:
            # Check if columns exists
            cursor.execute("DESCRIBE users;")
            columns = [col[0] for col in cursor.fetchall()]
            
            if 'profile_pic' not in columns:
                print("Adding 'profile_pic' column to 'users' table...")
                cursor.execute("ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255) DEFAULT NULL;")
                connection.commit()
                print("Column 'profile_pic' added successfully.")
            else:
                print("Column 'profile_pic' already exists.")
    except Exception as e:
        print(f"Migration error: {e}")
    finally:
        connection.close()

if __name__ == "__main__":
    run_migration()
