import { PatientFamilyHistoryType } from '@/types'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput } from '@/components/Form'
import { usePost } from "@/hooks"
import { useToast } from "@/hooks/use-toast"

interface FamilyHistoryProps {
  family?: PatientFamilyHistoryType | null
  idPatient: number
  updatePatient: () => void
  closeDialog: () => void
}

const formSchema = z.object({
  family_history: z.string().optional().nullable(),
  other_medications: z.string().optional().nullable(),
})

export const FamilyHistory = ({ family, idPatient, updatePatient, closeDialog }: FamilyHistoryProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      family_history: family?.family_history || "",
      other_medications: family?.other_medications || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let body = {
      ...values,
      idPatient,
      id: family?.id,
    }

    let url = family ? `/patient/update-family-history` : "/patient/create-family-history"
    let method = family ? "put" : "post"

    execute({
      url,
      method,
      body: body,
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Antecedentes familiares guardados",
          description: "Los antecedentes familiares han sido guardados correctamente",
        })
        updatePatient()
        closeDialog()
      }
    })
  }


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Antecedentes familiares"
            type='textarea'
            name="family_history"
            control={form.control}
          />

          <FormInput
            label="Otros medicamentos"
            type='textarea'
            name="other_medications"
            control={form.control}
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
