import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("highest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [maxBid, setMaxBid] = useState("");

  useEffect(() => {
    setProducts([
        {
          id: 1,
          name: "Product 1",
          price: 30,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          description: "This is a detailed description of Product 1. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 2,
          name: "Product 2",
          price: 30,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 2. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 3,
          name: "Product 3",
          price: 30,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 3. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 4,
          name: "Product 4",
          price: 30,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 4. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 5,
          name: "Product 5",
          price: 30,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 5. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 6,
          name: "Product 6",
          price: 30,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 6. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 7,
          name: "Product 7",
          price: 60,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 7. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 8,
          name: "Product 8",
          price: 50,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 8. It includes all the necessary information about the product's features, benefits, and specifications."
        },
        {
          id: 9,
          name: "Product 9",
          price: 40,
          imageUrl: "https://cdnb.artstation.com/p/assets/images/images/011/331/877/large/alexandre-grynagier-ima10-beecopter-des03-validmarvel-by-mrprops-d724zaj.jpg?1529020192",
          rating: 4.6,
          ratingCount: 107210,
          boughtLastMonth: 40000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          description: "This is a detailed description of Product 9. It includes all the necessary information about the product's features, benefits, and specifications."
        } 
    ]);
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "highest") {
      return b.price - a.price;
    } else if (sortOption === "lowest") {
      return a.price - b.price;
    }
    return 0;
  });

  const formatNumber = (num) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num;
  };

  const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(endTime));
      }, 1000);

      return () => clearInterval(timer);
    }, [endTime]);

    function calculateTimeLeft(endTime) {
      const difference = +new Date(endTime) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    }

    const addLeadingZero = (num) => {
      return num < 10 ? `0${num}` : num;
    };

    return (
      <div className="countdown-timer">
        Ends in: {addLeadingZero(timeLeft.days)}:{addLeadingZero(timeLeft.hours)}:
        {addLeadingZero(timeLeft.minutes)}:{addLeadingZero(timeLeft.seconds)}
      </div>
    );
  };

  const ProductModal = ({ product, onClose }) => {
    if (!product) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{product.name}</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <img src={product.imageUrl} alt={product.name} className="modal-image" />
            <p className="modal-price">${product.price}</p>
            <div className="modal-rating">
              <span className="stars">{product.rating} ★★★★☆</span>
              <span className="rating-count">({formatNumber(product.ratingCount)} ratings)</span>
            </div>
            <p className="modal-bought">{formatNumber(product.boughtLastMonth)}+ bought in past month</p>
            <div className="modal-countdown">
              <CountdownTimer endTime={product.endTime} />
            </div>
            <p className="modal-description">{product.description}</p>
          </div>
          <div className="modal-footer">
            <div className="button-container">
              <button className="action-button" onClick={(e) => {
                e.stopPropagation();
                setShowBidModal(true);
              }}>Bid</button>
              <button className="action-button">+ Cart</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BidModal = ({ onClose }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>How much do you want to bid?</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <p>We will automatically bid $1 until we reach your max bid below</p>
            <input 
              type="number" 
              value={maxBid} 
              onChange={(e) => setMaxBid(e.target.value)}
              placeholder="Enter your max bid"
              className="bid-input"
            />
          </div>
          <div className="modal-footer">
            <button className="action-button" onClick={() => {
              console.log("Max bid submitted:", maxBid);
              setMaxBid("");
              onClose();
            }}>Submit</button>
          </div>
        </div>
      </div>
    );
  };

  const AdvancedFilterModal = ({ onClose }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Advanced Filter Search</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="filter-option">
              <label>Price Range:</label>
              <input type="number" placeholder="Min" className="filter-input" />
              <input type="number" placeholder="Max" className="filter-input" />
            </div>
            <div className="filter-option">
              <label>Category:</label>
              <select className="filter-select">
                <option>All</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Home & Garden</option>
              </select>
            </div>
            <div className="filter-option">
              <label>Rating:</label>
              <select className="filter-select">
                <option>All</option>
                <option>4+ Stars</option>
                <option>3+ Stars</option>
                <option>2+ Stars</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="action-button" onClick={onClose}>Apply Filters</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="shop-container">
      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <h1>ANY PRODUCT, ANY SERVICE AT THE HIGHEST VALUE GUARANTEE!!!</h1>
      <div className="filter-container">
        <label htmlFor="sort-options" className="filter-label">
          Sort By:
        </label>
        <select
          id="sort-options"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="highest">Price: Highest to Lowest</option>
          <option value="lowest">Price: Lowest to Highest</option>
        </select>
        <button className="advanced-filter-btn" onClick={() => setShowFilterModal(true)}>Advanced Filter Search</button>
        <Link to="/">
          <button className="advanced-filter-btn">Sell</button>
        </Link>
        <Link to="/">
          <button className="cart-btn">Request</button>
        </Link>
        <button className="cart-btn">Cart</button>
      </div>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price}</p>
            <div className="product-rating">
              <span className="stars">{product.rating} ★★★★☆</span>
              <span className="rating-count">({formatNumber(product.ratingCount)})</span>
            </div>
            <p className="product-bought">
              {formatNumber(product.boughtLastMonth)}+ bought in past month
            </p>
            <CountdownTimer endTime={product.endTime} />
            <div className="button-container">
              <button className="action-button" onClick={(e) => {
                e.stopPropagation();
                setShowBidModal(true);
              }}>Bid</button>
              <button className="action-button">+ Cart</button>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {showBidModal && <BidModal onClose={() => setShowBidModal(false)} />}
      {showFilterModal && <AdvancedFilterModal onClose={() => setShowFilterModal(false)} />}
    </div>
  );
};
export default Product; 
