import pandas as pd
import sqlite3
from google.generativeai import GenerativeModel
import google.generativeai as genai

# Initialize Google Generative AI
genai.configure(api_key="AIzaSyDETaemf56DFjmm4CABsmqo-_1YuWftbSo")
model = genai.GenerativeModel('gemini-1.5-flash')

def create_sqlite_db(df, db_name="db.sqlite3"):
    """Creates an SQLite database from a DataFrame."""
    conn = sqlite3.connect(db_name)
    df.to_sql("data", conn, if_exists="replace", index=False)
    return conn

def generate_sql_query(nl_query, table_schema):
    """Convert natural language query to SQL query using the Gemini API."""
    
    # Prepare the prompt for generating the SQL query
    prompt = f"""
    Convert the following natural language prompt into a valid SQL query:

    User's analysis request: "{nl_query}"

    The SQL query should be based on the following table schema:
    {', '.join([str(col) for col in table_schema])}

    Ensure the query references the table as "data" since that's the table name in the SQLite database.
    Provide only the SQL query, without any additional text or explanation.
    """

    # Call the correct method to generate the SQL query
    try:
        response = model.generate_content(prompt)
        sql_query = response.text.strip()
        # Clean up the response
        sql_query = sql_query.replace("```", "").replace("sql", "").strip()
        print('response : ',sql_query)  # Use generate_content instead of generate_query
        return sql_query
    except Exception as e:
        raise Exception(f"Error generating SQL query: {e}")


def execute_sql_query(conn, query):
    """Executes the given SQL query on the SQLite database."""
    try:
        result = pd.read_sql_query(query, conn)
        print("sql-result : ",result)
        return result
    except Exception as e:
        return str(e)

