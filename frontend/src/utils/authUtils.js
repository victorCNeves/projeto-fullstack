export const logout = async () => {
  const token = getToken();

  if (!token) {
    localStorage.removeItem('token');
    return;
  }

  try {
    await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Falha ao comunicar logout ao backend:', error.message);
  } finally {
    localStorage.removeItem('token');
  }
};

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const login = async (username, password) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || 'Login falhou. Verifique suas credenciais.'
      );
    }

    const { token } = await res.json();
    setToken(token);
  } catch (error) {
    console.error('Erro na autenticação:', error.message);
    throw error;
  }
};

export const validate = async () => {
  const token = getToken();

  if (!token) return false;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_AUTH_SERVICE_URL}/validate`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      await logout();
      return false;
    }

    const { id } = await res.json();
    return id;
  } catch (error) {
    console.error('Erro ao validar o token:', error.message);
    return false;
  }
};
