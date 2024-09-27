# recommendation.py

def recommend_chart_type(query_text, columns, data):
    """
    Recommend chart type based on user query, data type, and schema.
    
    :param query_text: The natural language query from the user
    :param columns: The list of columns (schema) of the selected table
    :param data: A sample of the actual data (can be used to infer types)
    :return: A recommended chart type
    """

    # Convert query to lowercase for easier analysis
    query_text = query_text.lower()

    # Example rule-based checks for chart type recommendation
    if "compare" in query_text or "difference" in query_text:
        # Comparison question (e.g., comparing GPA across departments)
        return "bar"

    elif "trend" in query_text or "over time" in query_text:
        # Time-based trends usually need a line chart
        return "line"

    elif "distribution" in query_text or "histogram" in query_text:
        # Distribution-related queries suggest histograms
        return "histogram"

    elif "correlation" in query_text or "relationship" in query_text:
        # Relationship between two variables suggests scatter plot
        return "scatter"

    elif "proportion" in query_text or "percentage" in query_text:
        # Proportions are best represented with pie charts
        return "pie"

    # Fallback to bar chart if no clear match
    return "bar"

def analyze_data_types(columns, data):
    """
    Analyze data types from the schema and sample data to aid in chart selection.
    
    :param columns: List of columns (table schema)
    :param data: A sample of the actual data
    :return: A dictionary mapping column names to data types
    """
    column_types = {}
    
    for col in columns:
        # Check the first few rows of data to infer type
        sample_value = data[col].iloc[0]

        # Infer basic types (can be extended)
        if isinstance(sample_value, (int, float)):
            column_types[col] = 'numerical'
        elif isinstance(sample_value, str):
            column_types[col] = 'categorical'
        elif isinstance(sample_value, pd.Timestamp):
            column_types[col] = 'datetime'
        else:
            column_types[col] = 'unknown'

    return column_types
