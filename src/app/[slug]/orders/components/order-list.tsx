'use client'

import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";

interface OrderListProps {
  orders: Prisma.OrderGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
          avatarImageUrl: true;
        };
      },
      orderProducts: {
        include: {
          product: true
        }
      }
    };
  }>[]
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.FINISHED:
      return 'Finalizado'
    case OrderStatus.IN_PREPARATION:
      return 'Em preparo'
    case OrderStatus.PENDING:
      return 'Pendente'
  }
}

const OrderList = ({ orders }: OrderListProps) => {
  const router = useRouter()

  const handleBackClick = () => router.back()
  
  return (
    <div className="space-y-6 p-6">
      <Button onClick={handleBackClick} size={'icon'} variant={'secondary'} className="rounded-full">
        <ChevronLeftIcon />
      </Button>
      <div className="flex items-center gap-3">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Meus Pedidos</h2>
      </div>
      {orders.map(order => (
        <Card key={order.id}>
          <CardContent className="p-5 space-y-4">
            <div className={`w-fit  py-1 rounded-full px-2 text-xs font-semibold
                ${order.status === OrderStatus.PENDING && 'bg-gray-200 text-gray-500'}
                ${order.status === OrderStatus.IN_PREPARATION && 'bg-yellow-100 text-amber-500'}
                ${order.status === OrderStatus.FINISHED && 'bg-emerald-500 text-white'}
              `}>
              {getStatusLabel(order.status)}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image 
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  className="rounded-lg"
                  fill
                />
              </div>
              <p className="font-semibold text-sm">
                {order.restaurant.name}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              {order.orderProducts.map(orderProduct => (
                <div key={orderProduct.id} className="flex items-center gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full text-white bg-gray-200 text-xs font-semibold">
                    {orderProduct.quantity}
                  </div>
                  <p className="text-sm">{orderProduct.product.name}</p>
                </div>
              ))}
            </div>
            <Separator />
            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default OrderList;