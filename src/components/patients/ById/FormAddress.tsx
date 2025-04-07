import { PatientAddressType } from '@/types'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput } from '@/components/Form'
import { usePost } from "@/hooks"
import { useToast } from "@/hooks/use-toast"
interface AddressProps {
  add?: PatientAddressType | null
  idPatient: number
  updatePatient: () => void
  closeDialog: () => void
}

const formSchema = z.object({
  street: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  zip_code: z.string().optional().nullable(),
})

export const Address = ({ add, idPatient, updatePatient, closeDialog }: AddressProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: add?.street || "",
      neighborhood: add?.neighborhood || "",
      city: add?.city || "",
      state: add?.state || "",
      country: add?.country || "",
      zip_code: add?.zip_code || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let body = {
      ...values,
      idPatient,
      id: add?.id,
    }
    let url = add ? `/patient/update-address` : "/patient/create-address"
    let method = add ? "patch" : "post"

    execute({
      url,
      method,
      body: body,
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Dirección del paciente guardada",
          description: "La dirección del paciente ha sido guardada correctamente",
        })
        updatePatient()
        closeDialog()
      }
    })
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormInput
            label="Calle y número"
            name="street"
            control={form.control}
            required
          />
          <FormInput
            label="Colonia"
            name="neighborhood"
            control={form.control}
            required
          />
          <FormInput
            label="Ciudad"
            name="city"
            control={form.control}
            required
          />
          <FormInput
            label="Estado"
            name="state"
            control={form.control}
            required
          />
          <FormInput
            label="País"
            name="country"
            control={form.control}
            required
          />
          <FormInput
            label="Código postal"
            name="zip_code"
            control={form.control}
            required
          />

          <div className="flex">
            <Button type="submit" disabled={loading}>
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
