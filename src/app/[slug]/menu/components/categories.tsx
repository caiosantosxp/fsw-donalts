'use client'

import {  Prisma } from "@prisma/client"
import { ClockIcon, Star } from "lucide-react"
import Image from "next/image"
import { useContext, useState } from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/helpers/format-currency"

import { CartContext } from "../context/cart"
import CartSheet from "./cartSheet"
import RestaurantProducts from "./products"

interface RestaurantCategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        include: {
          products: true
        }
      }
    }
  }>
}

type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<{
  include: {
    products: true
  }
}>

const RestaurantCategories = ({ restaurant }: RestaurantCategoriesProps) => {
  const [ 
    selectedCategory, 
    setSelectedCategory 
  ] = useState<MenuCategoryWithProducts>(restaurant.menuCategories[0])

  const { products, total, toggleCart, totalQuantity } = useContext(CartContext)

  const handleCategoryClick = (category: MenuCategoryWithProducts) => {
    setSelectedCategory(category)
  }

  const getCategoryButtonVariant = (category: MenuCategoryWithProducts) => {
    return category.id === selectedCategory.id ? 'default' : 'outline'
  }

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white ">
      <div className="p-5">
        <div className="flex items-center gap-3 w-full">
          <Image 
            src={restaurant.avatarImageUrl} 
            alt={restaurant.name} 
            width={45} 
            height={45}  
          />
          <div>
            <h2 className="text-lg font-semibold">
              {restaurant.name}
            </h2>
            <p className="text-xs opacity-55">{restaurant.description}</p>
          </div>

          <div className="ml-auto flex gap-2 border rounded-full px-2 py-1 items-center">
            <Star size={16} fill='yellow'  color="yellow" />
            <strong className="font-semibold">5.0</strong>
          </div>
        </div>
        <div className="flex mt-3 items-center gap-1 text-xs text-green-500">
          <ClockIcon size={12} />
          <p>Aberto!</p>
        </div>
      </div>

      <ScrollArea className="w-full ">
        <div className="flex w-max space-x-4 p-4 pt-0">
          {restaurant.menuCategories.map((category) => (
            <Button 
              onClick={() => handleCategoryClick(category)} 
              key={category.id} 
              variant={getCategoryButtonVariant(category)} 
              size={'sm'} 
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      <h3 className="px-5 pt-2 font-semibold">
        {selectedCategory.name}
      </h3>
      <RestaurantProducts products={selectedCategory.products} />
      {products.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 flex w-full item-center justify-between bg-white p-5 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total dos pedidos</p>
            <p 
              className="text.sm font-semibold"
            >
              {formatCurrency(total)}
              <span 
                className="text-muted-foreground text-xs font-normal"
              >
                / {totalQuantity}
                   {' '}{totalQuantity > 1 ? 'itens' : 'item'}
              </span>
            </p>
          </div>
          <Button onClick={toggleCart}>Ver Sacola</Button>
          <CartSheet />
        </div>
      )}
    </div>
  )
}

export default RestaurantCategories