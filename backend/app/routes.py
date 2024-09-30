from flask import Blueprint, request, jsonify
from flask_cors import CORS  # Import the CORS module
import pandas as pd
from .utils import execute_sql_query, generate_sql_query,map_query_to_table
from .db_setup import create_dynamic_table
from .recommendation import recommend_chart_type  # Import the recommendation module
import mysql.connector
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)

main = Blueprint('main', __name__)
CORS(main)  # Enable CORS for this Blueprint

# Upload file and store in MySQL
@main.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        logging.error("No file provided in request.")
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if not file.filename.endswith(('.xlsx', '.xls')):
        logging.error("Invalid file type.")
        return jsonify({'error': 'Invalid file type'}), 400

    df = pd.read_excel(file)
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='root',
        database='test6'
    )

    # Create or update the table dynamically
    table_name = "data"
    create_dynamic_table(conn, table_name, df.columns)

    # Insert data into MySQL
    df.to_sql(table_name, con=conn, if_exists='replace', index=False)

    conn.close()
    logging.info("File uploaded and data inserted successfully.")
    return jsonify({'message': 'File uploaded and stored in the database successfully'})

# Handle filter query
@main.route('/filter-query', methods=['POST'])
def filter_query():
    query_text = request.json.get('query')
    if not query_text:
        return jsonify({'error': 'No filter query provided'}), 400

    try:
        # Identify the table based on the user's query
        table_name = map_query_to_table(query_text)

        print(f"table_name:{table_name}")
        # Connect to MySQL and fetch the schema for the identified table
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='test6'
        )

        df = pd.read_sql_query(f"SELECT * FROM {table_name} LIMIT 1", conn)
        table_schema = df.columns.tolist()
        conn.close()

        # Generate SQL query based on natural language query and table schema
        sql_query = generate_sql_query(query_text, {table_name: table_schema})
        result_df = execute_sql_query(sql_query)
        
        return jsonify(result_df.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Handle analysis query 
@main.route('/analysis-query', methods=['POST'])
def query_data():
    try:
        # Debugging to print the incoming request data
        print(request.json)  # Ensure this is printed to see the exact input
        
        # Ensure the request body contains 'query' key and it's a dictionary
        if not isinstance(request.json, dict):
            logging.error("Invalid request format: Expected a JSON object.")
            return jsonify({'error': 'Invalid request format: Expected a JSON object.'}), 400

        # Extract the query text from the request
        query_text = request.json.get('query')
        print("query_text:", query_text)

        if not query_text:
            logging.error("No analysis query provided.")
            return jsonify({'error': 'No analysis query provided'}), 400

        # Identify the table based on the user's query
        table_name = map_query_to_table(query_text)
        print(f"Identified table: {table_name}")

        # Connect to MySQL to fetch the schema for the user-specified table
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='test6'
        )

        try:
            # Fetch the table schema (list of columns) and some sample data for analysis
            df = pd.read_sql_query(f"SELECT * FROM {table_name} LIMIT 10", conn)  # Fetch more than 1 row to analyze data types
            table_schema = df.columns.tolist()

            # Ensure the table schema is a list and not empty
            if not table_schema:
                logging.error(f"Schema for table '{table_name}' is empty.")
                return jsonify({'error': f"Schema for table '{table_name}' is empty."}), 400
        except Exception as e:
            logging.error(f"Error fetching table schema: {e}")
            return jsonify({'error': 'Failed to fetch table schema.'}), 500
        finally:
            conn.close()

        print(f"Table schema: {table_schema}")

        # Generate SQL query based on the user question and table schema
        sql_query = generate_sql_query(query_text, {table_name: table_schema})
        logging.info(f"Generated SQL: {sql_query}")

        # Execute the SQL query and return the results
        result_df = execute_sql_query(sql_query)
        logging.info(f"Query Result: {result_df}")

        # Ensure the result is not empty
        if result_df.empty:
            return jsonify({'error': 'No data found for the given query.'}), 404

        # Prepare the columns for frontend
        columns = result_df.columns.tolist()
        result = result_df.to_dict(orient='records')

        # Recommend chart type based on query and data
        recommended_chart = recommend_chart_type(query_text, columns, result_df)
        print(f"recommended_chart: {recommended_chart}")

        return jsonify({
            'result': result,
            'columns': columns,
            'recommendedChart': recommended_chart
        }), 200

    except Exception as e:
        logging.error(f"Error processing analysis query: {e}")
        return jsonify({'error': str(e)}), 500
