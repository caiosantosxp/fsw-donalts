'use server'

import { ConsumptionMethod } from '@prisma/client'
import { redirect } from 'next/navigation'

import { removeCpfPunctuation } from '@/helpers/cpf'
import { db } from '@/lib/prisma'

interface CreateOrderInput{
  customerName: string
  customerCpf: string
  products: Array<{
    id: string
    quantity: number
  }>
  consumptionMethod: ConsumptionMethod
  slug: string
}

export const createOrder = async ( input : CreateOrderInput) => {
  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map(product => product.id)
      }
    }
  })

  const productsWithPriceAndQuantities = input.products.map(product => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find(productWithPrice => productWithPrice.id === product.id)!.price
  }))

  const restaurant = await db.restaurant.findFirst({
    where: {
      slug: input.slug
    },
  })

  if(!restaurant) {
    throw new Error('Restaurant not found')
  }
  

  await db.order.create({
    data: {
      status: 'PENDING',
      customerName: input.customerName,
      customerCpf: removeCpfPunctuation(input.customerCpf),
      orderProducts: {
        createMany: {
          data: input.products.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            price: productsWithPrices.find(productWithPrice => productWithPrice.id === product.id)!.price
          }))
        }
      },
      total: productsWithPriceAndQuantities.reduce((acc, product) => acc + (product.price * product.quantity), 0),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id
    }
  })

  redirect(`/${input.slug}/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`)
}