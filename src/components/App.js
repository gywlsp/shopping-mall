import ProductListPage from "./ProductListPage.js";
import ProductDetailPage from "./ProductDetailPage/index.js";
import CartPage from "./CartPage.js";

export default function App({ $app }) {
  const { pathname } = window.location;

  if (/\/web\/products\/+/.test(pathname)) {
    new ProductDetailPage({
      $app,
    });

    return;
  }

  if (pathname === "/web/cart") {
    new CartPage({ $app });
    return;
  }

  if (/\/web\/?/.test(pathname)) {
    new ProductListPage({ $app });
  }
}
