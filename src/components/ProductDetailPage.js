import { addCommaToPrice } from "../util.js";
import { fetchProduct } from "../api.js";

export default function ProductDetailPage({ $app }) {
  const initialState = { product: null, selectedOptions: [] };
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "ProductDetailPage";
  $app.appendChild(this.$target);

  this.onSelect = (optionId) => {
    if (this.state.selectedOptions.find((v) => v.id === optionId)) return;
    const newOption = this.state.product.productOptions.find(
      (v) => v.id === optionId
    );
    this.setState({
      ...this.state,
      selectedOptions: this.state.selectedOptions.concat({
        ...newOption,
        quantity: 1,
      }),
    });
  };

  this.onSubmit = () => {
    const submittedOptions = this.state.selectedOptions.map((option) => ({
      productId: this.state.product.id,
      optionId: option.id,
      quantity: option.quantity,
    }));
    const productsOnCart =
      JSON.parse(localStorage.getItem("products_cart")) || [];
    localStorage.setItem(
      "products_cart",
      JSON.stringify(productsOnCart.concat(submittedOptions))
    );
    location.href = "/web/cart";
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const { name, price, imageUrl, productOptions } = this.state.product;
    this.$target.innerHTML = `
        <h1>커피잔 상품 정보</h1>
        <div class="ProductDetail">
          <img
            src="${imageUrl}"
          />
          <div class="ProductDetail__info">
            <h2>${name}</h2>
            <div class="ProductDetail__price">${addCommaToPrice(price)}원~</div>
            <select>
              <option>선택하세요.</option>
              ${productOptions.map(
                (option) =>
                  `<option value="${option.id}" ${
                    option.stock ? "" : "disabled"
                  }>${option.stock ? "" : "(품절) "}${option.name}${
                    option.stock && option.price
                      ? ` (+${addCommaToPrice(option.price)}원)`
                      : ""
                  }</option>`
              )}
            </select>
            <div class="ProductDetail__selectedOptions">
              <h3>선택된 상품</h3>
              <ul>
                ${this.state.selectedOptions.map(
                  (option) =>
                    `<li>${option.name} ${addCommaToPrice(
                      (price + option.price) * option.quantity
                    )}원<div>
                      <input name="${option.id}" type="number" min="0" max="${
                      option.stock
                    }" value="${option.quantity}" />개
                    </div></li>`
                )}
              </ul>
              <div class="ProductDetail__totalPrice">${addCommaToPrice(
                this.state.selectedOptions.reduce((acc, option) => {
                  return acc + (price + option.price) * option.quantity;
                }, 0)
              )}원</div>
              <button class="OrderButton">주문하기</button>
            </div>
          </div>
        </div>
    `;
  };

  this.$target.addEventListener("click", (e) => {
    const $orderButton = e.target.closest(".OrderButton");
    if (!$orderButton) return;
    this.onSubmit();
  });

  this.$target.addEventListener("input", (e) => {
    const $select = e.target.closest("select");
    if (!$select) return;
    this.onSelect(+$select.value);
  });

  this.$target.addEventListener("input", (e) => {
    const $input = e.target.closest("input");
    if (!$input) return;
    const { name: optionId, value: quantity } = $input;
    const selectedOptions = this.state.selectedOptions.map((option) =>
      option.id === +optionId ? { ...option, quantity: +quantity } : option
    );
    this.setState({
      ...this.state,
      selectedOptions,
    });
  });

  this.init = async () => {
    const productId = +window.location.pathname.split("products/")[1];
    const product = await fetchProduct(productId);
    this.setState({ product, selectedOptions: [] });
  };

  this.init();
}
