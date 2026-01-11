import "../Style/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Fragment, useState, useEffect } from "react";

function ProductInfo() {
  const [inputValue, setInputValue] = useState({});
  const productID = localStorage.getItem("productID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!productID) {
          console.error("Product ID not found");
          return;
        }
        const response = await fetch(`http://localhost:3002/products/${productID}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setInputValue(data);
        } else {
          console.error("Failed to fetch product");
          alert("Product not found");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching product details");
      }
    };

    fetchData();
  }, [productID]);

  const onSubmithandler = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      window.location.href = "/login";
      return;
    }

    if (!productID) {
      alert("Product ID not found");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/cart/${productID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Product added to cart successfully");
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          alert("Session expired. Please login again");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          alert(errorData.message || "Failed to add product to cart");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding product to cart");
    }
  };

  return (
    <Fragment>
      <div className="widt">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-content">
              <div className="row">
                <div className="col-lg-12">
                  <div className="main-profile ">
                    <div className="row">
                      <div className="col-lg-4">
                        <img src={inputValue.image} alt="" />
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <div className="main-info header-text">
                          <h4>{inputValue.name}</h4>
                          <p>{inputValue.description}</p>
                          <div className="main-button">
                            <button className="searchButton" type="button" onClick={onSubmithandler}>
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <ul>
                          <li>
                            Game Category <span>{inputValue.category}</span>
                          </li>
                          <li>
                            Price <span>{inputValue.price}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductInfo;
