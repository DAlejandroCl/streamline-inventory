const API_URL = import.meta.env.VITE_API_URL;

export async function productsLoader() {
  try {
    const res = await fetch(`${API_URL}/api/products`);

    if (!res.ok) {
      throw new Response("Failed to fetch products", {
        status: res.status,
      });
    }

    return await res.json();
  } catch {
    throw new Response("Server connection error", {
      status: 500,
    });
  }
}