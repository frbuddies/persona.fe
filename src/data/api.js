const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://persona-be-y9g7.onrender.com/persona';
const API_BASE = import.meta.env.VITE_API_URL?.replace('/persona', '') || 'https://persona-be-y9g7.onrender.com';

export async function sendResultsToBackend(data) {
  try {
    const response = await fetch(`${BACKEND_URL}/persona`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

export async function fetchAllResults(query = '') {
  try {
    const url = query ? `${BACKEND_URL}/persona?${query}` : BACKEND_URL;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching results:', error);
    return { success: false, message: error.message };
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: error.message };
  }
}
