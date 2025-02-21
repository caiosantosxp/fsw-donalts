import { db } from "@/lib/prisma"

export const getOrderByCpf = async (cpf: string) => {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc"
    },
    where: {
      customerCpf: cpf,
    },
    include: {
      restaurant: {
        select:{
          name: true,
          avatarImageUrl: true,
        }
      },
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  })

  return orders
}