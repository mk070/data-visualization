import pandas as pd
import mysql.connector
from mysql.connector import Error
import google.generativeai as genai
import logging

# Initialize Google Generative AI
genai.configure(api_key="AIzaSyDETaemf56DFjmm4CABsmqo-_1YuWftbSo")
model = genai.GenerativeModel('gemini-1.5-flash')

from difflib import get_close_matches


import logging
from difflib import get_close_matches

def map_query_to_table(nl_query):
    """Map the natural language query to the appropriate table."""
    
    # Comprehensive mappings with synonyms for each table
    table_mappings = {
        "categories": ['category', 'categories', 'CategoryName', 'Description'],
        "suppliers": ['supplier', 'suppliers', 'company', 'CompanyName', 'ContactName', 'vendor', 'ContactTitle', 'Address'],
        "customers": ['customer', 'customers', 'client', 'CustomerID', 'CompanyName', 'ContactName', 'ContactTitle', 'Address'],
        "employees": ['employee', 'employees', 'staff', 'EmployeeID', 'LastName', 'FirstName', 'Title', 'worker', 'team'],
        "EmployeeTerritories": ['employee', 'territory', 'territories'],
        "OrderDetails": ['order', 'details', 'product', 'order details', 'ProductID', 'UnitPrice', 'Quantity'],
        "orders": ['order','months', 'orders', 'sales', 'customer', 'EmployeeID', 'order details', 'ShipVia', 'Freight', 'OrderDate', 'ShippedDate', 'RequiredDate', 'ship'],
        "Products": ['product', 'products', 'ProductName', 'CategoryID', 'SupplierID', 'item'],
        "Region": ['region', 'region details', 'RegionDescription', 'area'],
        "Shippers": ['shipper', 'shippers', 'shipping', 'delivery', 'CompanyName'],
        "Territories": ['territory', 'territories', 'RegionID', 'area', 'TerritoryDescription'],
        # Add more mappings for any other tables if necessary
    }
    
    # Preprocess the query by converting it to lowercase for comparison
    nl_query_lower = nl_query.lower()

    # Step 1: Direct keyword matching
    for table, keywords in table_mappings.items():
        for keyword in keywords:
            if keyword.lower() in nl_query_lower:
                logging.info(f"Matched table: {table} using keyword: {keyword}")
                return table

    # Step 2: Fuzzy matching for partial matches and typos
    all_keywords = [keyword.lower() for keywords in table_mappings.values() for keyword in keywords]
    fuzzy_matches = get_close_matches(nl_query_lower, all_keywords, n=1, cutoff=0.4)  # Adjust cutoff if necessary
    if fuzzy_matches:
        # Find which table the matched keyword belongs to
        for table, keywords in table_mappings.items():
            if fuzzy_matches[0] in [kw.lower() for kw in keywords]:
                logging.info(f"Fuzzy matched table: {table} using keyword: {fuzzy_matches[0]}")
                return table

    # Step 3: Time-based keywords handling
    time_keywords = ['month', 'months', 'year', 'years', 'date', 'dates']
    for keyword in time_keywords:
        if keyword in nl_query_lower:
            logging.info(f"Matched time-based query with table: 'orders' (based on time-related keywords).")
            return "orders"  # Assuming orders table has time-related data like OrderDate, ShippedDate, etc.

    # If no match is found, return a default table or handle error appropriately
    logging.warning(f"No matching table found for query: {nl_query}. Defaulting to 'data'.")
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
        Convert the following natural language prompt into a valid SQL query for a MySQL database:

        User's analysis request: "{nl_query}"

        The SQL query should be based on the table "{table_name}" with the following columns:
        {', '.join([str(col) for col in table_schema])}

        Consider the following key guidelines:
        1. Use MySQL-compatible functions (e.g., DATE_FORMAT for date formatting, DATE_SUB for date subtraction).
        2. Ensure that all column references and table names match those provided in the schema and do not introduce unnecessary changes.
        3. If the query involves date-related operations, ensure compatibility with MySQL functions (e.g., CURDATE(), NOW()).
        4. If the query involves text operations, ensure compatibility with MySQL (e.g., use CONCAT instead of || for string concatenation).
        5. Always ensure the correct usage of SQL aggregation functions (e.g., SUM, COUNT, AVG) based on the user's request.
        6. Handle GROUP BY, ORDER BY, and WHERE clauses correctly.
        7. Provide only the SQL query, without any additional text or explanation.
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
            database='test6'
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
