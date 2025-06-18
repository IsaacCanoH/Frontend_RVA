const API_URL = "https://backend-node-mjpn.onrender.com";

export const login = async (usuario, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, contrasena: password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.payload))
      return { success: true, usuario: data.payload }
    }
    else {
      return { success: false, error: data.error || "Algo salió mal" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
