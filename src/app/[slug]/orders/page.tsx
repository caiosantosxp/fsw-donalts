import { getOrderByCpf } from "@/data/get-order-by-cpf";
import { isValidCpf } from "@/helpers/cpf";

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

  const orders = await getOrderByCpf(cpf);

  return (
    <OrderList orders={orders} />
  );
};

export default OrdersPage;