import { PatientPathologicalHistoryType } from '@/types'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput, FormSwitch } from '@/components/Form'
import { usePost } from "@/hooks"
import { useToast } from "@/hooks/use-toast"

interface PathologicalHistoryProps {
  pathological?: PatientPathologicalHistoryType | null
  idPatient: number
  updatePatient: () => void
}

const formSchema = z.object({
  surgery: z.boolean().nullable(),
  surgery_description: z.string().optional().nullable(),
  allergies: z.boolean().optional(),
  allergies_description: z.string().optional().nullable(),
  asthma: z.boolean().optional(),
  dm: z.boolean().optional(),
  has: z.boolean().optional(),
  other_diseases: z.boolean().optional(),
  other_diseases_description: z.string().optional().nullable(),
})


export const PathologicalHistory = ({ pathological, idPatient, updatePatient }: PathologicalHistoryProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surgery: pathological?.surgery || false,
      surgery_description: pathological?.surgery_description || "",
      allergies: pathological?.allergies || false,
      allergies_description: pathological?.allergies_description || "",
      asthma: pathological?.asthma || false,
      dm: pathological?.dm || false,
      has: pathological?.has || false,
      other_diseases: pathological?.other_diseases || false,
      other_diseases_description: pathological?.other_diseases_description || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let body = {
      ...values,
      idPatient,
      id: pathological?.id,
    }

    let url = pathological ? `/patient/update-pathological-history` : "/patient/create-pathological-history"
    let method = pathological ? "put" : "post"

    execute({
      url,
      method,
      body: body,
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Antecedentes patológicos guardados",
          description: "Los antecedentes patológicos han sido guardados correctamente",
        })
        updatePatient()
      }
    })
  }

  const surgery = form.watch('surgery')
  const allergies = form.watch('allergies')
  const other = form.watch('other_diseases')


  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12 md:col-span-2'>
              <FormSwitch
                label="Tiene cirugías?"
                name="surgery"
                control={form.control}
              />
            </div>
            {surgery && (
              <div className='col-span-12 md:col-span-12'>
                <FormInput
                  label="Cuales?"
                  type='textarea'
                  name="surgery_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12 md:col-span-2'>
              <FormSwitch
                label="Tiene cirugías?"
                name="allergies"
                control={form.control}
              />
            </div>
            {allergies && (
              <div className='col-span-12 md:col-span-12'>
                <FormInput
                  label="A que?"
                  type='textarea'
                  name="allergies_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <FormSwitch
            label="Asma"
            name="asthma"
            control={form.control}
          />
          <FormSwitch
            label="Diabetes Mellitus"
            name="dm"
            control={form.control}
          />
          <FormSwitch
            label="Hipertensión Arterial"
            name="has"
            control={form.control}
          />

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12 md:col-span-2 mb-2'>
              <FormSwitch
                label="Otras?"
                name="other_diseases"
                control={form.control}
              />
            </div>
            {other && (
              <div className='col-span-12 md:col-span-12'>
                <FormInput
                  type='textarea'
                  name="other_diseases_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

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
