import { addCommaToPrice } from "../util.js";
import { fetchProduct } from "../api.js";

export default function ProductDetailPage({ $app }) {
  const initialState = { products: [] };
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "CartPage";
  $app.appendChild(this.$target);

  this.onSubmit = () => {
    alert("주문되었습니다");
    localStorage.removeItem("products_cart");
    location.href = "/web";
  };

  this.getProductsInfo = (products) => {
    const productsInfo = products.map(async (product) => {
      const { productId, optionId, quantity } = product;
      const productInfo = await fetchProduct(productId);
      const { name, imageUrl, price, productOptions } = productInfo;
      const option = productOptions.find((v) => v.id === optionId);
      return {
        imageUrl,
        name,
        optionName: option.name,
        quantity,
        price: price + option.price,
      };
    });
    return Promise.all(productsInfo);
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = async () => {
    const productsInfo = await this.getProductsInfo(this.state.products);
    const priceSum = productsInfo.reduce((acc, { price, quantity }) => {
      return acc + price * quantity;
    }, 0);
    this.$target.innerHTML = `
    <h1>장바구니</h1>
    <div class="Cart">
      <ul>
        ${productsInfo.map(
          ({ imageUrl, name, optionName, quantity, price }) => `
            <li class="Cart__item">
                <img
                src="${imageUrl}"
                />
                <div class="Cart__itemDesription">
                <div>${name} ${optionName} ${quantity}개</div>
                <div>${addCommaToPrice(price * quantity)}원</div>
                </div>
            </li>`
        )}
      </ul>
      <div class="Cart__totalPrice">총 상품가격 ${addCommaToPrice(
        priceSum
      )}원</div>
      <button class="OrderButton">주문하기</button>
    </div>
    `;
  };

  this.$target.addEventListener("click", (e) => {
    const $orderButton = e.target.closest(".OrderButton");
    if (!$orderButton) return;
    this.onSubmit();
  });

  this.init = () => {
    const productsOnCart = JSON.parse(localStorage.getItem("products_cart"));
    if (!productsOnCart?.length) {
      alert("장바구니가 비어 있습니다");
      location.href = "/web";
      return;
    }
    this.setState({ products: productsOnCart });
  };

  this.init();
}
