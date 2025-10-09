export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
};
