from flask import Blueprint, request, jsonify
import pandas as pd
from .utils import create_sqlite_db, execute_sql_query, generate_sql_query
from .db_setup import create_dynamic_table
import sqlite3


main = Blueprint('main', __name__)

@main.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify({'error': 'Invalid file type'}), 400

    df = pd.read_excel(file)
    conn = sqlite3.connect('db.sqlite3')

    # Create or update the table dynamically
    table_name = "data"
    create_dynamic_table(conn, table_name, df.columns)

    # Insert data into the table
    df.to_sql(table_name, conn, if_exists='replace', index=False)

    conn.close()
    return jsonify({'message': 'File uploaded and stored in the database successfully'})

@main.route('/query', methods=['POST'])
def query_data():
    query_text = request.json.get('query')
    if not query_text:
        return jsonify({'error': 'No query provided'}), 400

    conn = sqlite3.connect('db.sqlite3')
    
    # Fetch the table schema (columns) to pass into the query generation
    df = pd.read_sql_query("SELECT * FROM data LIMIT 1", conn)
    table_schema = df.columns.tolist()

    try:
        # Generate SQL query based on natural language query and table schema
        sql_query = generate_sql_query(query_text, table_schema)
        result_df = execute_sql_query(conn, sql_query)
        conn.close()
        return jsonify(result_df.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
