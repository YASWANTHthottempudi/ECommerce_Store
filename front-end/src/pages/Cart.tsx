import { Fragment, useEffect, useState } from "react";

import "../Style/Cart.css";
import NavBar from "../component/NavBar";
function Cart() {

  const [cartData, setCartData] = useState({ total: 0, Products: [] });

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Check if token exists
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:3003/cart", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartData(data);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again");
          window.location.href = "/login";
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to fetch cart data:", errorData.message);
          alert(errorData.message || "Failed to fetch cart data");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching cart data");
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleRemoveFromCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to remove items from cart");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Product removed from cart");
        // Refresh cart data
        await fetchCartData();
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again");
          window.location.href = "/login";
        } else {
          alert(errorData.message || "Failed to remove product from cart");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while removing product from cart");
    }
  };



  return (
    <Fragment>
      <div className="backgrounds">
        <div className="spacefo2">
          <div className="cart-page">
            <div className="cart-page-container">
              <div className="cart-page-header">
                <h2 className="cart-header-text">Your Games Cart</h2>
              </div>
              <div className="cart-page-table">
                <table className="cart-table-product">
                  <thead>
                    <tr className="cart-table-header">
                      <th className="cart-table-img">Product Image</th>
                      <th className="cart-table-desktop cart-table-payment">
                        Name
                      </th>
                      <th className="cart-table-desktop cart-table-size">
                        Category
                      </th>
                      <th className="cart-table-size right-text-mobile">
                        Price
                      </th>
                      <th className="cart-table-size">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartData.Products.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                          Your cart is empty. <a href="/">Browse products</a> to add items.
                        </td>
                      </tr>
                    ) : (
                      cartData.Products.map((product: any) => (
                        <tr className="cart-table-content" key={product._id}>
                          <td className="cart-table-image-info">
                            <img src={product.image} alt="Product Image"/>
                          </td>
                          <td className="bold-text">{product.name}</td>
                          <td>{product.category}</td>
                          <td>${product.price}</td>
                          <td>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveFromCart(product._id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="cart-table-bill">
                <div className="bill-total bold-text">Total: ${cartData.total}</div>
              </div>
              {cartData.Products.length > 0 && (
                <div className="cart-header-footer">
                  <a href="/checkout">
                    <button className="cart-header-cta red-bg" type="button">
                      Proceed to Checkout
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Cart;
