'use client'

import { Product } from "@prisma/client";
import { createContext, useState } from "react";

export interface CartProduct 
  extends Pick<Product, 'id' | 'name' | 'price' | 'imageUrl'> {
  quantity: number;
}

export interface ICartContext {
  isOpen: boolean;
  products: CartProduct[]
  toggleCart: () => void;
  addProduct: (product: CartProduct) => void;
  decreaseProductQuantity: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
  decreaseProductQuantity: () => {}
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts ] = useState<CartProduct[]>([]);

  const toggleCart = () => setIsOpen(!isOpen);

  const addProduct = (product: CartProduct) => {
    const productIsAlreadyInCart = products.some((prevProduct) => prevProduct.id === product.id);
  
    if (!productIsAlreadyInCart) {
      return setProducts((prev) => [...prev, product]);
    }
  

    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        if (prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity,
          };
        }
        return prevProduct;
      });
    });
  };

  const decreaseProductQuantity = (productId: string) => {
    setProducts(prevProducts => {
      return prevProducts.map((prevProduct) => {
        if(prevProduct.id === productId && prevProduct.quantity > 1) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity - 1
          }
        }
        return prevProduct;
      })
    })

  } 

  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
        decreaseProductQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}