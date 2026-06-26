const BACKEND_URL = 'http://localhost:5000/persona';

export async function sendResultsToBackend(data) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

export async function fetchAllResults() {
  try {
    const response = await fetch(BACKEND_URL);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching results:', error);
    return { success: false, message: error.message };
  }
}
