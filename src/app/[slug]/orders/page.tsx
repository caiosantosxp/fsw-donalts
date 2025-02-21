import { isValidCpf } from "@/helpers/cpf";
import { db } from "@/lib/prisma";

import CpfForms from "./components/cpf-forms";
import OrderList from "./components/order-list";

interface OrdersPageProps {
  searchParams: Promise<{ cpf: string }>
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { cpf } = await searchParams;

  if(!cpf || !isValidCpf(cpf)) {
    return <CpfForms />
  }

  const orders = await db.order.findMany({
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

  return (
    <OrderList orders={orders} />
  );
};

export default OrdersPage;