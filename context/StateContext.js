import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [qty, setQty] = useState(1)

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(item => item._id === product._id)

    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity)

    if (checkProductInCart) {

      const updatedCartItems = cartItems.map(cartProduct => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
      })

      setCartItems(updatedCartItems)
    } else {
      product.quantity = quantity;
      
      setCartItems([...cartItems, { ...product }])
    }
    setQty(1)
    toast.success(`${qty} ${product.name} added to the cart`)
  }

  const increaseQuantity = () => {
    setQty((prevQty) => prevQty + 1)
  }

  const decreaseQuantity = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    })
  }

  const increaseCartQuantity = (product) => {
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price)
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
    const updatedCartItems = cartItems.map(cartProduct => {
      if (cartProduct._id === product._id) return {
        ...cartProduct,
        quantity: cartProduct.quantity + 1
      }
    })
    setCartItems(updatedCartItems)
  }

  const decreaseCartQuantity = (product) => {
    setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price)
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
    if(product.quantity > 1) {
      const updatedCartItems = cartItems.map(cartProduct => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity - 1
        }
      })
      setCartItems(updatedCartItems)
    }
    if(product.quantity === 1) {
      const updatedCartItems = cartItems.filter(cartProduct => {
        cartProduct._id === product._id && product.quantity == 1
      })    
      setCartItems(updatedCartItems) 
    }
  }

  const deleteItem = (product) => {
    setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price * product.quantity)
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - product.quantity)
    setCartItems(cartItems.filter(cartProduct => {
      cartProduct._id === product._id
    }))
  }

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        deleteItem,
        increaseCartQuantity,
        decreaseCartQuantity,
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        increaseQuantity,
        decreaseQuantity,
        onAdd,
        setCartItems,
        setTotalPrice,
        setTotalQuantities
      }}>
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)