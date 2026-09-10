import sys
from pathlib import Path
from sqlalchemy import text, inspect

from app.core.database import engine, Base
import app.models as smodels

print("Connecting to database...")
with engine.connect() as conn:
    if engine.name != 'sqlite':
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);"))
        conn.execute(text("UPDATE users SET username = split_part(email, '@', 1) WHERE username IS NULL;"))
        conn.commit()
        print("Updated users table in PostgreSQL.")

print("Running Base.metadata.create_all...")
Base.metadata.create_all(bind=engine)

inspector = inspect(engine)
tables = ['users', 'projects', 'assessments', 'findings', 'assets', 'reports', 'sentina_reports', 'scan_jobs', 'correlated_risks', 'audit_logs']
for table in tables:
    if inspector.has_table(table):
        cols = [c['name'] for c in inspector.get_columns(table)]
        print(f"Table {table}: {cols}")
    else:
        print(f"Table {table}: NOT FOUND")
