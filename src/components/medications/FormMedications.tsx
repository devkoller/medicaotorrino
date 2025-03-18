
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput } from '@/components/Form'
import { usePost, } from "@/hooks"
import { MedicationsType } from "@/types"
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre del medicamento es requerido",
  }),
  brand: z.string().min(1, {
    message: "La marca del medicamento es requerida",
  }),
  presentation: z.string().min(1, {
    message: "La presentación del medicamento es requerida",
  }),
})

type FormMedicationsProps = {
  selectedMedicamento: MedicationsType | null
  update: () => void
  closeSheet: () => void
}

export const FormMedications = ({ selectedMedicamento, update, closeSheet }: FormMedicationsProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedMedicamento?.name || "",
      brand: selectedMedicamento?.brand || "",
      presentation: selectedMedicamento?.presentation || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {

    let url = selectedMedicamento ? `/medications/update` : "/medications/create"
    let method = selectedMedicamento ? "patch" : "post"

    execute({
      url,
      method,
      body: {
        ...values,
        id: selectedMedicamento?.id,
      },
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Medicamento guardado",
          description: "El medicamento ha sido guardado correctamente",
        })
        update()
        closeSheet()
      }
    })
  }



  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Marca"
            name="brand"
            control={form.control}
            required
          />
          <FormInput
            label="Nombre"
            name="name"
            control={form.control}
            required
          />
          <FormInput
            label="Presentación"
            name="presentation"
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
