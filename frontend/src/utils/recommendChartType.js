// utils/recommendChartType.js

/**
 * Recommends a chart type based on the user's question.
 * @param {string} question - The user's query.
 * @returns {string} - The recommended chart type.
 */
export const recommendChartType = (question) => {
  console.log('question:', question);

  if (!question || typeof question !== 'string') {
    console.error('Invalid question provided to recommendChartType.');
    return 'bar'; // Default to 'bar' chart if question is invalid
  }

  const lowerCaseQuestion = question.toLowerCase();

  if (lowerCaseQuestion.includes('trend') || lowerCaseQuestion.includes('over time')) {
    return 'line';
  } else if (lowerCaseQuestion.includes('distribution') || lowerCaseQuestion.includes('histogram')) {
    return 'bar';
  } else if (lowerCaseQuestion.includes('proportion') || lowerCaseQuestion.includes('percentage')) {
    return 'pie';
  } else if (lowerCaseQuestion.includes('correlation') || lowerCaseQuestion.includes('relationship')) {
    return 'scatter';
  } else if (
    lowerCaseQuestion.includes('compare') ||
    lowerCaseQuestion.includes('count') ||
    lowerCaseQuestion.includes('number of')
  ) {
    return 'bar';
  } else {
    // Default to bar chart
    return 'bar';
  }
};
