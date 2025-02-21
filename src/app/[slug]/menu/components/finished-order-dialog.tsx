'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { ConsumptionMethod } from "@prisma/client"
import { Loader2Icon } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { useContext, useTransition } from "react"
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from "sonner"
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { isValidCpf } from '@/helpers/cpf'

import { createOrder } from "../actions/create-order"
import { CartContext } from "../context/cart"

const formSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  cpf: z.string().trim().min(1, 'Cpf é obrigatório').refine((value) => isValidCpf(value), {
    message: 'CPF inválido'
  })
})

type FormSchema = z.infer<typeof formSchema>

interface FinishedOrderDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const FinishedOrderDialog = ({ isOpen, onOpenChange}: FinishedOrderDialogProps) => {
  const searchParams = useSearchParams()
  const [ isPending, startTransition ] = useTransition()
  const { slug } = useParams<{ slug: string}>()
  const { products } = useContext(CartContext)
  
  const consumptionMethod = searchParams.get('consumptionMethod') as ConsumptionMethod
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cpf: ''
    },
    shouldUnregister: true
  })

  const onSubmit = (data: FormSchema) => {
    try {
      startTransition(async () => {
        await createOrder({
          consumptionMethod,
          customerCpf: data.cpf,
          customerName: data.name,
          products,
          slug,
        })

        onOpenChange(false)
        toast.success('Pedido finalizado com sucesso!')
      })
      
      
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar Pedido</DrawerTitle>
          <DrawerDescription>Insira sua informações abaixo para finalizar pedido</DrawerDescription>
        </DrawerHeader>
          <div className="p-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu nome</FormLabel>
                      <FormControl>
                        <Input placeholder="seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu cpf</FormLabel>
                      <FormControl>
                        <PatternFormat 
                          placeholder="Digite seu CPF..." 
                          format="###.###.###-##" 
                          customInput={Input} 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DrawerFooter>
                  <Button 
                    type="submit" 
                    variant={'destructive'} 
                    className="rounded-full"
                    disabled={isPending}
                  >
                    {isPending && <Loader2Icon className="animate-spin" />}
                    Finalizar
                  </Button>
                  <DrawerClose asChild>
                    <Button 
                      className="w-full rounded-full" 
                      variant={'secondary'}
                    >
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
      </DrawerContent>
    </Drawer>
  )
}

export default FinishedOrderDialog;