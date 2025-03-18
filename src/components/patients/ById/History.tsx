import { PatientHistoryType } from '@/types'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput, FormSwitch } from '@/components/Form'
import { usePost } from "@/hooks"
import { useToast } from "@/hooks/use-toast"

interface HistoryProps {
  nonPathological?: PatientHistoryType | null
  idPatient: number
  updatePatient: () => void
  closeDialog: () => void
}

const formSchema = z.object({
  tabaquism: z.boolean().nullable(),
  alcoholism: z.boolean().optional(),
  use_glasses: z.boolean().optional(),
  sleep_habits: z.boolean().optional(),
  sleep_habits_description: z.string().optional().nullable(),
  animals: z.boolean().optional(),
})

export const History = ({ nonPathological, idPatient, updatePatient, closeDialog }: HistoryProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tabaquism: nonPathological?.tabaquism || false,
      alcoholism: nonPathological?.alcoholism || false,
      use_glasses: nonPathological?.use_glasses || false,
      sleep_habits: nonPathological?.sleep_habits || false,
      sleep_habits_description: nonPathological?.sleep_habits_description || "",
      animals: nonPathological?.animals || false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let body = {
      ...values,
      idPatient,
      id: nonPathological?.id,
    }

    let url = nonPathological ? `/patient/update-history` : "/patient/create-history"
    let method = nonPathological ? "put" : "post"

    execute({
      url,
      method,
      body: body,
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Antecedentes no patológicos guardados",
          description: "Los antecedentes no patológicos han sido guardados correctamente",
        })
        updatePatient()
        closeDialog()
      }
    })
  }

  const sleeps = form.watch('sleep_habits')


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12 md:col-span-2'>
              <FormSwitch
                label="Tabaquismo"
                name="tabaquism"
                control={form.control}
              />
            </div>
          </div>
          <FormSwitch
            label="Alcoholismo"
            name="alcoholism"
            control={form.control}
          />

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12 md:col-span-2 mb-2'>
              <FormSwitch
                label="Hábitos de sueño"
                name="sleep_habits"
                control={form.control}
              />
            </div>
            {sleeps && (
              <div className='col-span-12 md:col-span-12'>
                <FormInput
                  label="Cuales?"
                  type='textarea'
                  name="sleep_habits_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <FormSwitch
            label="Usa lentes?"
            name="use_glasses"
            control={form.control}
          />

          <FormSwitch
            label="Convive con animales?"
            name="animals"
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
