import React, { useEffect, useMemo, useState } from "react";
import "../Stylesheets/CP24Broadcast.css";
import amazon from "../Images/amazon.png" 

export default function CP24Broadcast() {
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [qty, setQty] = useState(1);
  const [dealLeft, setDealLeft] = useState(60 * 18 + 42); // 18:42
  const [screen, setScreen] = useState("product"); // product | checkout
  const [autoFired, setAutoFired] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setDealLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(id);
  }, [toast]);

  // Auto-animate to checkout after a couple seconds (reel-friendly)
  useEffect(() => {
    if (autoFired) return;
    const id = setTimeout(() => {
      setScreen("checkout");
      setAutoFired(true);
    }, 50200);
    return () => clearTimeout(id);
  }, [autoFired]);

  const dealStr = useMemo(() => {
    const m = Math.floor(dealLeft / 60);
    const s = dealLeft % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [dealLeft]);

  const addToCart = () => {
    setCartCount((c) => c + qty);
    setToast(`Added ${qty} to cart`);
    setTimeout(() => setScreen("checkout"), 500);
  };

  const reserve = () => {
    setToast("Reserved (checkout)");
    setTimeout(() => setScreen("checkout"), 450);
  };

  const placeOrder = () => {
    setToast("Order placed • DM “WOMENS” to confirm");
  };

  return (
    <div className="cp24-wrap" aria-label="Amazon-style bright item listing promo">
      <div className="cp24-frame az-frame az-bright">
        {/* Top nav */}
        <div className="az-topbar">
         <img className='az-logo' src={amazon}/>

          <div className="az-search">
            <div className="az-searchIcon" aria-hidden="true" />
            <div className="az-searchText">Search “women’s bjj class”</div>
          </div>

          <button className="az-cart" type="button" aria-label="Cart">
            <span className="az-cartIcon" aria-hidden="true" />
            <span className="az-cartCount" aria-label={`${cartCount} items in cart`}>
              {cartCount}
            </span>
          </button>
        </div>

        {/* Deal bar */}
        <div className="az-dealBar" aria-label="Limited-time deal">
          <span className="az-dealTag">Limited-time deal</span>
          <span className="az-dealText">Ends in</span>
          <span className="az-dealTimer">{dealStr}</span>
          <span className="az-dealSub">• Free entry</span>
        </div>

        {/* Sliding screens */}
        <div className={`az-screens ${screen === "checkout" ? "is-checkout" : ""}`}>
          {/* PRODUCT SCREEN */}
          <div className="az-screen az-product" aria-label="Product screen">
            <div className="az-media">
              <div className="az-image" role="img" aria-label="Event product image">
                <div className="az-imageBadge">FREE</div>
                <div className="az-imageShine" aria-hidden="true" />
                <div className="az-imageTitle">WOMEN’S BJJ CLASS</div>
                <div className="az-imageSub">SAT • DEC 20 • 2025</div>
              </div>

              <div className="az-thumbs" aria-hidden="true">
                <div className="az-thumb az-thumbOn" />
                <div className="az-thumb" />
                <div className="az-thumb" />
                <div className="az-thumb" />
              </div>
            </div>

            <div className="az-content">
              <div className="az-title">
               FREE Women’s Brazilian Jiu-Jitsu Class 
              </div>

              <div className="az-metaRow">
                <div className="az-rating" aria-label="5.0 stars">
                  <span className="az-stars" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span className="az-ratingNum">5.0</span>
                  <span className="az-ratingCount">(128)</span>
                </div>

                <div className="az-choice" aria-label="Top pick">
                  <span className="az-choiceTag">Amazon’s Pick</span>
                  <span className="az-choiceText">for first-time BJJ</span>
                </div>
              </div>

              <div className="az-priceBox">
                <div className="az-priceLine">
                  <span className="az-priceLabel">Price:</span>
                  <span className="az-price">
                    <span className="az-currency">$</span>
                    <span className="az-dollars">0</span>
                    <span className="az-cents">.00</span>
                  </span>
                  <span className="az-was">Was $25.00</span>
                </div>

                <div className="az-shipping">
                  <span className="az-primeChip">FAST</span>
                  <span>Delivery:</span>
                  <strong>Sat, Dec 20</strong>
                  <span className="az-muted">• Arrive 10 min early</span>
                </div>

                <div className="az-stock">
                  <span className="az-stockDot" aria-hidden="true" />
                  In Stock. <span className="az-muted">Limited spots.</span>
                </div>
              </div>

              <div className="az-bullets" aria-label="Highlights">
                <div className="az-bullet">
                  <span className="az-bulletKey">Led by:</span>
                  <span className="az-bulletVal">Nabiha Shaikh &amp; Jessica Chaberski</span>
                </div>
                <div className="az-bullet">
                  <span className="az-bulletKey">Date:</span>
                  <span className="az-bulletVal">Saturday, December 20, 2025</span>
                </div>
                <div className="az-bullet">
                  <span className="az-bulletKey">Open to:</span>
                  <span className="az-bulletVal">Everyone (all skill levels)</span>
                </div>
                <div className="az-bullet">
                  <span className="az-bulletKey">Location:</span>
                  <span className="az-bulletVal">Maple Jiu-Jitsu Academy</span>
                </div>
              </div>

              <div className="az-buybox" aria-label="Buy box">
                <div className="az-qtyRow">
                  <span className="az-qtyLabel">Qty:</span>
                  <div className="az-qtyControl">
                    <button
                      className="az-qtyBtn"
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="az-qtyNum" aria-label={`Quantity ${qty}`}>
                      {qty}
                    </div>
                    <button
                      className="az-qtyBtn"
                      type="button"
                      onClick={() => setQty((q) => Math.min(6, q + 1))}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="az-qtyHint az-muted">Max 6</span>
                </div>

                <button className="az-btn az-btnCart" type="button" onClick={addToCart}>
                  Add to Cart
                </button>

                <button className="az-btn az-btnBuy" type="button" onClick={reserve}>
                  Reserve Spot
                </button>

                <div className="az-small">
                  Sold by <strong>Maple Jiu-Jitsu Academy</strong>
                </div>

                <div className="az-note">
                  Tip: DM <strong>“WOMENS”</strong> on Instagram to confirm your spot.
                </div>
              </div>
            </div>
          </div>

          {/* CHECKOUT SCREEN */}
          <div className="az-screen az-checkout" aria-label="Checkout screen">
            <div className="az-checkHeader">
              <div className="az-checkTitle">Checkout</div>
              <div className="az-checkSub">Review your order</div>
            </div>

            <div className="az-checkCard">
              <div className="az-checkRowTop">
                <div className="az-checkMiniThumb" aria-hidden="true" />
                <div className="az-checkInfo">
                  <div className="az-checkName">Women’s BJJ Class (Free Entry)</div>
                  <div className="az-checkBy">by Maple Jiu-Jitsu Academy</div>
                  <div className="az-checkMeta">
                    <span className="az-checkChip">SAT, DEC 20, 2025</span>
             
                  </div>
                </div>
              </div>

              <div className="az-summary">
                <div className="az-sumRow">
                  <span>Items ({Math.max(1, cartCount || qty)}):</span>
                  <strong>$0.00</strong>
                </div>
                <div className="az-sumRow">
                  <span>Delivery:</span>
                  <strong>$0.00</strong>
                </div>
                <div className="az-sumRow az-sumTotal">
                  <span>Order total:</span>
                  <strong>$0.00</strong>
                </div>
              </div>

              <div className="az-checkActions">
                <button className="az-btn az-btnPlace" type="button" onClick={placeOrder}>
                  Place order
                </button>
                <button className="az-btn az-btnBack" type="button" onClick={() => setScreen("product")}>
                  Back to item
                </button>
              </div>

       
            </div>

            <div className="az-checkFooter">
              <div className="az-finePrint">
                Free entry • Limited spots • Arrive early • Bring water 
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div className={`az-toast ${toast ? "is-on" : ""}`} role="status" aria-live="polite">
          <div className="az-toastInner">
            <span className="az-toastDot" aria-hidden="true" />
            {toast || ""}
          </div>
        </div>
      </div>
    </div>
  );
}
