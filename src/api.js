const API_END_POINT =
  "https://uikt6pohhh.execute-api.ap-northeast-2.amazonaws.com/dev";

export const request = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("요청 실패");
  }

  return await res.json();
};

export const fetchProducts = async () => request(`${API_END_POINT}/products`);

export const fetchProduct = async (productId) =>
  request(`${API_END_POINT}/products/${productId}`);
