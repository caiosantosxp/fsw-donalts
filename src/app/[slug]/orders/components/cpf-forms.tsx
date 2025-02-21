'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { PatternFormat } from "react-number-format"
import { z } from "zod"

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { isValidCpf, removeCpfPunctuation } from "@/helpers/cpf"


const formSchema = z.object({
  cpf: z.string().trim().min(1, 'Cpf é obrigatório').refine((value) => isValidCpf(value), {
    message: 'CPF inválido'
  })
})

const CpfForms = () => {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: ''
    }
  })

  type FormSchema = z.infer<typeof formSchema>

  const onSubmit = (data: FormSchema) => {
    console.log(data)
    router.replace(`${pathname}?cpf=${removeCpfPunctuation(data.cpf)}`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <Drawer open>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Visualizar Pedidos</DrawerTitle>
          <DrawerDescription>Insira seu cpf abaixo para visualizar seus pedidos.</DrawerDescription>
        </DrawerHeader>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem className="px-4">
                      <FormLabel>Seu Cpf</FormLabel>
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
                  <Button variant={'destructive'} className="w-full rounded-full" type="submit">Confirmar</Button>
                  <DrawerClose asChild>
                    <Button onClick={handleCancel} variant="secondary" className="w-full rounded-full">Cancelar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
      </DrawerContent>
    </Drawer>
  )
}

export default CpfForms