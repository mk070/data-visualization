import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re

# Download necessary NLTK data (run this once)
nltk.download('punkt')
nltk.download('stopwords')

# List of potential date-related keywords
date_keywords = ["january", "february", "march", "april", "may", "june", "july",
                  "august", "september", "october", "november", "december", "year",
                  "month", "day", "date", "time", "week"]

def extract_keywords(sentence):
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(sentence.lower())
    keywords = [word for word in word_tokens if word not in stop_words]
    print(f"Extracted Keywords: {keywords}")
    return keywords

def find_relevant_columns(keywords, df):
    relevant_columns = set()
    for col in df.columns:
        for keyword in keywords:
            if keyword in col.lower():
                relevant_columns.add(col)
    for keyword in keywords:
        for col in df.columns:
            if keyword.isdigit():
                if df[col].dtype in ['int64', 'float64'] and int(keyword) in df[col].values:
                    relevant_columns.add(col)
            else:
                if df[col].dtype == 'object' and keyword in df[col].astype(str).str.lower().values:
                    relevant_columns.add(col)
    return list(relevant_columns)

def get_columns_from_sentence(sentence, dataset_path, chart_data_path):
    keywords = extract_keywords(sentence)
    df = pd.read_csv(dataset_path)

    # Automatically detect potential date columns
    date_cols = []
    for col in df.columns:
        if any(keyword in col.lower() for keyword in date_keywords):
            date_cols.append(col)
        else:
            # Try to find date patterns in the first few rows of data
            for i in range(min(5, len(df))):  # Check first 5 rows
                value = str(df[col].iloc[i])
                if re.search(r'\d{2,4}[-/]\d{1,2}[-/]\d{1,2}', value):
                    date_cols.append(col)
                    break

    # Parse dates for detected columns
    if date_cols:
        df[date_cols] = df[date_cols].apply(pd.to_datetime, errors='coerce')

    relevant_columns = find_relevant_columns(keywords, df)

    if relevant_columns:
        print(f"Relevant columns found: {relevant_columns}\n")
        result_df = df[relevant_columns].head(15)
        print(result_df)

        # Analyze data types
        numerical_cols = []
        categorical_cols = []
        time_series_cols = []

        for col in relevant_columns:
            dtype = str(df[col].dtype)
            if dtype == 'datetime64[ns]':
                time_series_cols.append(col)
            elif dtype in ['int64', 'float64']:
                numerical_cols.append(col)
            else:
                categorical_cols.append(col)

        print("\nAnalysis:")
        num_cols = len(numerical_cols)
        cat_cols = len(categorical_cols)
        time_cols = len(time_series_cols)

        print(f"Numerical Columns: {num_cols} ")
        print(f"Categorical Columns: {cat_cols} ")
        print(f"Time series Columns: {time_cols} ")

        # Load chart recommendation dataset
        chart_df = pd.read_csv(chart_data_path)

        # Find matching chart recommendations
        matching_charts = []
        data_type_string = ""

        # 1. Try matching all data types
        if num_cols > 0 or cat_cols > 0 or time_cols > 0:
            if num_cols > 3:
                data_type_string += "More than 3 Numerical Columns"
            elif num_cols > 0:
                data_type_string += f"{num_cols} Numerical"

            if cat_cols > 2:
                data_type_string += " and More than 2 Categorical Columns" if data_type_string else "More than 2 Categorical Columns"
            elif cat_cols > 0:
                data_type_string += " and " + f"{cat_cols} Categorical" if data_type_string else f"{cat_cols} Categorical"

            if time_cols > 0:
                data_type_string += " and Time Series" if data_type_string else "Time Series"

            matching_charts = chart_df[chart_df["Data Type(s)"] == data_type_string]["Recommended Charts"].tolist()

        # 2. If no match, try matching only numerical columns
        if not matching_charts and num_cols > 0:
            data_type_string = "More than 3 Numerical Columns" if num_cols > 3 else f"{num_cols} Numerical"
            matching_charts = chart_df[chart_df["Data Type(s)"] == data_type_string]["Recommended Charts"].tolist()

        # 3. If still no match, try matching only categorical columns
        if not matching_charts and cat_cols > 0:
            data_type_string = "More than 2 Categorical Columns" if cat_cols > 2 else f"{cat_cols} Categorical"
            matching_charts = chart_df[chart_df["Data Type(s)"] == data_type_string]["Recommended Charts"].tolist()

        # 4. If still no match, try matching only time series
        if not matching_charts and time_cols > 0:
            data_type_string = "Time Series"
            matching_charts = chart_df[chart_df["Data Type(s)"] == data_type_string]["Recommended Charts"].tolist()

        if matching_charts:
            print("\nRecommended Charts:")
            for chart_string in matching_charts:
                for chart in chart_string.split(", "):
                    print(f"- {chart}")
        else:
            print("\nNo specific chart recommendations found for this combination of data types.")

        return result_df

    else:
        print("No relevant columns found.")
        return None

# Example usage:
sentence = "Give me a name where the album_id is greater than 6"
dataset_path = r"C:\Users\Aravi\Downloads\SQL projects\music store2\track.csv" 
chart_data_path = r"C:\Users\Aravi\OneDrive\Desktop\visulaisation\chart_recommendation.csv" 
result_df = get_columns_from_sentence(sentence, dataset_path, chart_data_path)