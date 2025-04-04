import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  loading: false,
  paymentLoading:false,
};

const calculateTotal = (cart) => {
  return cart.reduce((total, item) => {
    const price = item.selectedWeight ? item.selectedWeight.price : item.price;
    return total + price * item.quantity;
  }, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
      state.total = calculateTotal(state.cart);
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    addToCart(state, action) {
      const item = action.payload;
      console.log("item", item);
      if (item.pricePerWeight) {
        // Product
        const existingItem = state.cart.find(
          (cartItem) =>
            item._id === cartItem._id &&
            cartItem.selectedOption === item.selectedOption
        );
        if (existingItem) {
          if (!item.quantity) item.quantity = 1;
          existingItem.quantity += item.quantity; // Update quantity based on payload
        } else {
          if (!item.quantity)
            state.cart.push({ ...item, quantity: 1 });
          else
            state.cart.push({ ...item, quantity: item.quantity });
        }
      } else if (!item.pricePerWeight) {
        // Combo Product
        const existingItem = state.cart.find(
          (cartItem) => item._id === cartItem._id
        );
        if (existingItem) {
          if (!item.quantity) item.quantity = 1;
          existingItem.quantity += item.quantity; // Update quantity based on payload
        } else {
          if (!item.quantity)
            state.cart.push({ ...item, quantity: 1 });
          else
            state.cart.push({ ...item, quantity: item.quantity });
        }
      }

      state.total = calculateTotal(state.cart);
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
  },
});

export const { setCart, setLoading, addToCart,setPaymentLoading } = cartSlice.actions;
export default cartSlice.reducer;
