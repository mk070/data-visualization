import pandas as pd
import mysql.connector
from mysql.connector import Error
import google.generativeai as genai
import logging

# Initialize Google Generative AI
genai.configure(api_key="AIzaSyDETaemf56DFjmm4CABsmqo-_1YuWftbSo")
model = genai.GenerativeModel('gemini-1.5-flash')

def map_query_to_table(nl_query):
    """Map the natural language query to the appropriate table."""
    table_mappings = {
        "flipkart_dataset": ["products", "price", "discount", "ratings"],
        "college_student": ["student", "GPA", "age", "grade"],
        "suppliers" : ['SupplierID','CompanyName','ContactName','ContactTitle','Address','City','Region','PostalCode','Country','Phone','Fax','HomePage']
        # Add more table mappings here as needed
    }

    for table, keywords in table_mappings.items():
        for keyword in keywords:
            if keyword.lower() in nl_query.lower():
                return table

    return "data"

def generate_sql_query(nl_query, table_schemas):
    """Convert natural language query to SQL query using the AI model."""
    
    # Map the query to the relevant table
    table_name = map_query_to_table(nl_query)
    
    # Prepare the schema for the identified table
    table_schema = table_schemas.get(table_name, [])
    
    if not table_schema:
        raise Exception(f"Table '{table_name}' does not exist or schema is empty.")

    prompt = f"""
    Convert the following natural language prompt into a valid SQL query:

    User's analysis request: "{nl_query}"

    The SQL query should be based on the table "{table_name}" with the following columns:
    {', '.join([str(col) for col in table_schema])}

    Ensure the query references the table as "{table_name}" since that's the correct table in the database.
    Provide only the SQL query, without any additional text or explanation.
    """

    try:
        response = model.generate_content(prompt)
        sql_query = response.text.strip()
        sql_query = sql_query.replace("```", "").replace("sql", "").strip()
        logging.info(f"Generated SQL query: {sql_query}")
        return sql_query
    except Exception as e:
        raise Exception(f"Error generating SQL query: {e}")


def recommend_chart():
    """Convert natural language query to SQL query using the AI model."""
    
  
    prompt = f"""
    Convert the following natural language prompt into a valid SQL query:

    User's analysis request: "{nl_query}"

    The SQL query should be based on the table "{table_name}" with the following columns:
    {', '.join([str(col) for col in table_schema])}

    Ensure the query references the table as "{table_name}" since that's the correct table in the database.
    Provide only the SQL query, without any additional text or explanation.
    """

    try:
        response = model.generate_content(prompt)
        sql_query = response.text.strip()
        sql_query = sql_query.replace("```", "").replace("sql", "").strip()
        logging.info(f"Generated SQL query: {sql_query}")
        return sql_query
    except Exception as e:
        raise Exception(f"Error generating SQL query: {e}")


def execute_sql_query(query):
    """Executes the given SQL query on the MySQL database."""
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='data-visual'
        )

        if conn.is_connected():
            logging.info("Connected to MySQL database")

        df = pd.read_sql(query, conn)
        conn.close()
        logging.info(f"SQL Result: {df.shape} rows")
        return df

    except Error as e:
        logging.error(f"Error while connecting to MySQL: {e}")
        return str(e)
