import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput, FormCombobox } from '@/components/Form'
import { PatientType } from "@/types"
import { usePost, useFetch } from "@/hooks"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  lastname1: z.string().min(1, {
    message: "El primer apellido es requerido",
  }),
  lastname2: z.string().min(1, {
    message: "El segundo apellido es requerido",
  }),
  email: z.string().email({
    message: "Correo no válido",
  }).optional().nullable(),
  phone: z.string().optional().nullable(),
  birthdate: z.string().min(1, {
    message: "La fecha de nacimiento es requerida",
  }),
  workIn: z.string().optional().nullable(),
  gender: z.number().optional().nullable(),
})

type FormPatientProps = {
  selectedPatient: PatientType | null
  updatePatient: () => void
  closeDialog: () => void
}

export const FormPatientModify = ({ selectedPatient, updatePatient, closeDialog }: FormPatientProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const [genders, setGenders] = useState([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedPatient?.name || '',
      lastname1: selectedPatient?.lastname1 || '',
      lastname2: selectedPatient?.lastname2 || '',
      email: selectedPatient?.email || '',
      phone: selectedPatient?.phone || '',
      birthdate: selectedPatient?.birthdate || '',
      workIn: selectedPatient?.workIn || '',
      gender: selectedPatient?.gender || 0,
    },
  })

  const { response: genderData } = useFetch({
    url: "/data/genders"
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let url = selectedPatient ? `/patient/update` : "/patient/create"
    let method = selectedPatient ? "put" : "post"

    execute({
      url,
      method,
      body: {
        ...values,
        id: selectedPatient?.id,
      },
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Paciente guardado",
          description: "Paciente guardado correctamente",
        })
        updatePatient()
        closeDialog()
      }
    })
  }

  useEffect(() => {
    if (genderData) {
      const gen = genderData.data.map((g: any) => ({
        value: g.id,
        label: g.name,
      }))
      setGenders(gen)
    }
  }, [genderData])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormInput
            label="Nombre"
            name="name"
            control={form.control}
            required
          />
          <FormInput
            label="Primer Apellido"
            name="lastname1"
            control={form.control}
            required
          />
          <FormInput
            label="Segundo Apellido"
            name="lastname2"
            control={form.control}
            required
          />
          <FormInput
            label="Fecha de nacimiento"
            type="date"
            name="birthdate"
            control={form.control}
            required
          />

          <FormCombobox
            label="Género"
            control={form.control}
            name='gender'
            option={genders}
            setValue={form.setValue}
          />

          <FormInput
            label="Correo"
            name="email"
            control={form.control}
          />
          <FormInput
            label="Teléfono"
            name="phone"
            control={form.control}
          />

          <FormInput
            label="Ocupación"
            name="workIn"
            control={form.control}
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
