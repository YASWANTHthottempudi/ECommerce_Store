import { Fragment, useEffect } from "react";
import "../Style/CheckOut.css";

function CheckOut() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const submitHandler = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to proceed with checkout");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:3003/cart/checkout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert("Your order has been placed successfully!");
        window.location.href = "/";
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          alert("Session expired. Please login again");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          alert(errorData.message || "Error during checkout");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during checkout");
    }
  };
  
  


  return (
    <Fragment>
      <div className="wrapper">
        <div className="spaceto">
          <div className="containers">
            <div className="title">Checkout Form</div>

            <div className="input-form">
              <div className="section-1">
                <div className="items">
                  <label className="label">card number</label>
                  <input
                    type="text"
                    className="input"
                    maxLength={10}
                    data-mask="0000 0000 0000 0000"
                    placeholder="1234 1234 1234 1234"
                  />
                </div>
              </div>
              <div className="section-2">
                <div className="items">
                  <label className="label">card holder</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Coding Market"
                  />
                </div>
              </div>
              <div className="section-3">
                <div className="items">
                  <label className="label">Expire date</label>
                  <input
                    type="text"
                    className="input"
                    data-mask="00 / 00"
                    placeholder="MM / YY"
                  />
                </div>
                <div className="items">
                  <div className="cvc">
                    <label className="label">cvc code</label>
                    <div className="tooltip">
                      ?
                      <div className="cvc-img">
                        <img src="https://i.imgur.com/r8oXtry.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="input"
                    data-mask="0000"
                    placeholder="0000"
                  />
                </div>
              </div>
            </div>

            <button className="bat" onClick={submitHandler} type="button">proceed</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default CheckOut;
