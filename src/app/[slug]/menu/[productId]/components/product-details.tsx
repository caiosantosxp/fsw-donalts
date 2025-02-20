'use client'

import { Prisma } from "@prisma/client"
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/helpers/format-currency"

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true
        }
      }
    }
  }>
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState<number>(1)

  const handleDecreaseQuantity = () => {
    if (quantity >= 2) {
      setQuantity((prev: number) => prev - 1)
    }
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev: number) => prev + 1)
  }

  return (
    <div className="relative flex flex-col z-50 flex-auto rounded-t-3xl p-5 mt-[-1.5rem]">
      <div className="flex-auto">
          {/* Restaurante */}
          <div className="flex items-center gap-1">
            <Image 
              src={product.restaurant.avatarImageUrl}
              alt={product.restaurant.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <p className="text-sx text-muted-foreground">{product.restaurant.name}</p>
          </div>

          {/* Nome do Produto */}
          <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>
          
          {/* Preço e Quantidade */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {formatCurrency(product.price * quantity)}
            </h3>

            <div className="flex items-center gap-3 text-center">
              <Button onClick={handleDecreaseQuantity} variant={'outline'} className="size-8 rounded-xl">
                <ChevronLeftIcon />
              </Button>

              <p className="w-4">{quantity}</p>

              <Button onClick={handleIncreaseQuantity} variant={'destructive'} className="size-8 rounded-xl">
                <ChevronRightIcon />
              </Button>
            </div>
          </div>

          {/* Descrição */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Sobre</h4>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

          {/* Ingredientes */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-1">
              <ChefHatIcon size={18} />
              <h4 className="font-semibold">Ingredientes</h4>
            </div>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

        </div>
        <Button className="rounded-full  w-full mt-6">Adicionar à sacola</Button>
    </div>
  )
}
export default ProductDetails