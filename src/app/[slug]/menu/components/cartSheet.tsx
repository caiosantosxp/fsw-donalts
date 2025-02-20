import { useContext } from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { CartContext } from "../context/cart"

const CartSheet = () => {
  const { isOpen, toggleCart } = useContext(CartContext)

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetHeader></SheetHeader>
      <SheetTitle></SheetTitle>
      <SheetContent></SheetContent>
    </Sheet>
  )
}

export default CartSheet