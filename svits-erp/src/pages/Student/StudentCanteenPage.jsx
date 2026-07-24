import { useState } from 'react'
import { MdFastfood, MdAddShoppingCart, MdAccountBalanceWallet, MdHistory } from 'react-icons/md'
import toast from 'react-hot-toast'
import './StudentCanteenPage.css'

const MENU_ITEMS = [
  { id: 1, name: 'Masala Dosa', price: 40, category: 'Breakfast', veg: true },
  { id: 2, name: 'Veg Meals', price: 60, category: 'Lunch', veg: true },
  { id: 3, name: 'Chicken Biryani', price: 120, category: 'Lunch', veg: false },
  { id: 4, name: 'Samosa (2 pcs)', price: 20, category: 'Snacks', veg: true },
  { id: 5, name: 'Cold Coffee', price: 35, category: 'Beverages', veg: true },
  { id: 6, name: 'Egg Noodles', price: 70, category: 'Snacks', veg: false },
]

export default function StudentCanteenPage() {
  const [cart, setCart] = useState([])
  
  const addToCart = (item) => {
    setCart([...cart, item])
    toast.success(`${item.name} added to cart!`)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    toast.success('Order placed successfully! Please collect from Counter 2 in 15 mins.')
    setCart([])
  }

  const total = cart.reduce((acc, curr) => acc + curr.price, 0)

  return (
    <div className="student-canteen-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> E-Canteen</h1>
          <p className="page-subtitle">Pre-order food and avoid the queues</p>
        </div>
      </div>

      <div className="canteen-grid">
        <div className="canteen-menu-section animate-fade-in delay-1">
          <div className="card">
            <div className="card-header"><h2 className="section-title">Today's Menu</h2></div>
            <div className="card-body">
              <div className="canteen-menu-list">
                {MENU_ITEMS.map(item => (
                  <div key={item.id} className="canteen-menu-item">
                    <div className="canteen-menu-info">
                      <div className={`veg-indicator ${item.veg ? 'veg' : 'non-veg'}`}></div>
                      <div>
                        <h4>{item.name}</h4>
                        <span className="canteen-menu-cat">{item.category}</span>
                      </div>
                    </div>
                    <div className="canteen-menu-action">
                      <div className="canteen-menu-price">₹{item.price}</div>
                      <button className="btn btn-outline btn-sm" onClick={() => addToCart(item)}>
                        <MdAddShoppingCart /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="canteen-sidebar animate-fade-in delay-2">
          <div className="card canteen-wallet-card">
            <div className="canteen-wallet-info">
              <MdAccountBalanceWallet size={24} />
              <div>
                <small>Wallet Balance</small>
                <h3>₹450.00</h3>
              </div>
            </div>
            <button className="btn btn-outline btn-sm">Add Funds</button>
          </div>

          <div className="card canteen-cart-card">
            <div className="card-header"><h2 className="section-title">Your Order</h2></div>
            <div className="card-body">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  <MdFastfood size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="canteen-cart-list">
                  {cart.map((item, idx) => (
                    <div key={idx} className="canteen-cart-item">
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                  <div className="canteen-cart-total">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={handleCheckout}>
                    Checkout & Pay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
