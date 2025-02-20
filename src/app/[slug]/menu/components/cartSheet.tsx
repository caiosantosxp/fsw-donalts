import { useContext } from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { CartContext } from "../context/cart"

const CartSheet = () => {
  const { isOpen, toggleCart, products } = useContext(CartContext)

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Teste</SheetTitle>
        </SheetHeader>
        {products.map(product => (
          <div key={product.id}>
            <p>{product.name}</p>
            <p>{product.quantity}</p>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet