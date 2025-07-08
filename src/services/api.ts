
export const loginUser = async (username: string, password: string) => {
  const response = await fetch('https://zadatak.konovo.rs/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.token; 
};
