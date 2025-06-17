const API_URL = "https://backend-node-s5yk.onrender.com";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Aquí le dices al backend: contrasena = password del frontend
      body: JSON.stringify({ email, contrasena: password }), 
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      return { success: true, usuario: data.payload }; // ← otro fix aquí
    } else {
      return { success: false, error: data.error || "Algo salió mal" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
