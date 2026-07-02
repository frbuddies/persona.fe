
const BASE_URL = import.meta.env.VITE_BE_URL?.replace(/\/+$/, '') || '';
const PERSONA_API_URL = BASE_URL + '/persona';
const USER_API_URL = BASE_URL + '/users';

export async function sendResultsToBackend(data) {
  try {
    const response = await fetch(PERSONA_API_URL, {
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
    const url = query ? `${PERSONA_API_URL}?${query}` : PERSONA_API_URL;
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
    const response = await fetch(`${USER_API_URL}/login`, {
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

export async function setUserPassword(client_id, password) {
  try {
    const response = await fetch(`${USER_API_URL}/set_password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error setting password:', error);
    return { success: false, message: error.message };
  }
}
