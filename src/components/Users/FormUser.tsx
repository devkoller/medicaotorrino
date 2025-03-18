import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput } from '@/components/Form'
import { UserType } from "@/types"
import { usePost, } from "@/hooks"
import { useToast } from "@/hooks/use-toast"




const formSchema = z.object({
  name: z.string().min(2, {
    message: "El usuario debe tener al menos 2 caracteres",
  }).max(50, {
    message: "El usuario debe tener menos de 50 caracteres",
  }),
  lastname1: z.string(),
  lastname2: z.string(),
  email: z.string().email({
    message: "Correo no válido",
  }),
  phone: z.string().min(9, {
    message: "El teléfono debe tener al menos 10 caracteres",
  }).max(15, {
    message: "El teléfono debe tener menos de 15 caracteres",
  }),
})

type FormUserProps = {
  selectedUser: UserType | null
  update: () => void
  closeSheet: () => void
}

export const FormUser = ({ selectedUser, update, closeSheet }: FormUserProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedUser?.name || "",
      lastname1: selectedUser?.lastname1 || "",
      lastname2: selectedUser?.lastname2 || "",
      email: selectedUser?.email || "",
      phone: selectedUser?.phone || "",

    },
  })



  function onSubmit(values: z.infer<typeof formSchema>) {

    let url = selectedUser ? `/user/update-user` : "/user/create"
    let method = selectedUser ? "patch" : "post"

    execute({
      url,
      method,
      body: {
        ...values,
        id: selectedUser?.id,
      },
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Usuario guardado",
          description: "El usuario ha sido guardado correctamente",
        })
        update()
        closeSheet()
      }
    })
  }


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormInput
            label="Nombre"
            name="name"
            control={form.control}
            required
          />
          <FormInput
            label="Primer apellido"
            name="lastname1"
            control={form.control}
            required
          />
          <FormInput
            label="Segundo apellido"
            name="lastname2"
            control={form.control}
          />
          <FormInput
            label="Correo"
            name="email"
            control={form.control}
            required
          />
          <FormInput
            label="Teléfono"
            name="phone"
            control={form.control}
            required
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
