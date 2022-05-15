import { addCommaToPrice } from "../util.js";
import { fetchProducts } from "../api.js";

export default function ProductListPage({ $app }) {
  const initialState = { products: [] };
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "ProductListPage";
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `
    <h1>상품목록</h1>
    <ul>
    ${this.state.products.map(
      ({ id, name, imageUrl, price }) => `
            <li data-id="${id}" class="Product">
                <img src="${imageUrl}"/>
                <div class="Product__info">
                <div>${name}</div>
                <div>${addCommaToPrice(price)}원~</div>
                </div>
            </li>
    `
    )}
    </ul>
    `;
  };

  this.$target.addEventListener("click", (e) => {
    const $li = e.target.closest("li.Product");
    if (!$li) return;
    const { id } = $li.dataset;
    location.href = `/web/products/${id}`;
  });

  this.init = async () => {
    const products = await fetchProducts();
    this.setState({ products });
  };

  this.init();
}
