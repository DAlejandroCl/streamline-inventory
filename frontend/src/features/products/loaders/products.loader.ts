export async function productsLoader() {
  try {
    const res = await fetch("http://localhost:4000/api/products");

    if (!res.ok) {
      throw new Response("Failed to fetch products", { status: res.status });
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Response("Error loading products", { status: 500 });
  }
}
