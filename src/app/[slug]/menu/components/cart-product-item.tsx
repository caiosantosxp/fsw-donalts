import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext, CartProduct } from "../context/cart";

interface CartItemProps {
  product: CartProduct;
}

const CartProductItem = ({ product }: CartItemProps) => {
  const { 
    decreaseProductQuantity, 
    increaseProductQuantity,
    removeProduct
  } =  useContext(CartContext)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
          {/* Esquerda */}
        <div className="relative h-20 w-20 bg-gray-100 rounded-xl p-5">
          <Image 
            src={product.imageUrl}
            alt={product.name}
            fill
          />
        </div>

        {/* Nome, Preço e Quantidade */}
        <div className="space-y-1 ">
          <p className="text-xs max-w-[90%] truncate text-ellipsis">{product.name}</p>
          <p className="text-sm font-semibold">R$ {formatCurrency(product.price)}</p>

          {/* Quantidade */}
          <div className="flex items-center gap-1">
            <Button 
              onClick={() => decreaseProductQuantity(product.id)}  
              variant={'outline'} 
              className="size-7 rounded-lg"
            >
              <ChevronLeftIcon />
            </Button>

            <p className="w-7 text-xs text-center">{product.quantity}</p>

            <Button 
              onClick={() => increaseProductQuantity(product.id)}  
              variant={'destructive'} 
              className="size-8 rounded-lg"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
      <Button 
        onClick={() => removeProduct(product.id)}
        className="size-7 rounded-lg" 
        variant={'outline'}
      >
        <TrashIcon />
      </Button>


    </div>
  )
}

export default CartProductItem;