import sqlite3

def create_dynamic_table(conn, table_name, columns):
    """Create a table with dynamic columns."""
    column_definitions = ", ".join([f"{col} TEXT" for col in columns])  # Default type TEXT
    create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({column_definitions});"
    conn.execute(create_table_query)

def init_db(app):
    """Initialize the database with the Flask app."""
    app.config.from_object('config.Config')
    conn = sqlite3.connect('db.sqlite3')  # Initialize the SQLite DB connection
    conn.execute("CREATE TABLE IF NOT EXISTS default_table (id INTEGER PRIMARY KEY);")
    conn.close()
