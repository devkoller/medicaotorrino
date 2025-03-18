import { PatientClinicType } from '@/types'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput, FormSwitch, FormCombobox } from '@/components/Form'
import { usePost, useFetch } from "@/hooks"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from 'react'

interface ClinicHistoryProps {
  clinic?: PatientClinicType | null
  idPatient: number
  updatePatient: () => void
}

const formSchema = z.object({
  oral: z.boolean().nullable(),
  oral_description: z.string().optional().nullable(),
  nose: z.boolean().nullable(),
  nose_description: z.string().optional().nullable(),
  earing_left: z.boolean().nullable(),
  earing_left_description: z.string().optional().nullable(),
  earing_right: z.boolean().nullable(),
  earing_right_description: z.string().optional().nullable(),
  face: z.boolean().nullable(),
  face_description: z.string().optional().nullable(),
  idx: z.string().optional().nullable(),
  plan: z.string().optional().nullable(),
  evolution: z.string().optional().nullable(),
  mc: z.string().optional().nullable(),
  medications: z
    .array(
      z.object({
        id_medicine: z.number({
          message: "Selecciona un medicamento.",
        }),
        frequency: z.string().min(1, {
          message: "La frecuencia del medicamento es requerida.",
        }),
        duration: z.string().min(1, {
          message: "La duración del tratamiento es requerida.",
        }),
      }),
    )
    .min(1, {
      message: "Carga al menos un medicamento.",
    }),
})

export const FormClinicHistory = ({ clinic, idPatient, updatePatient }: ClinicHistoryProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const [medications, setMedications] = useState([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oral: clinic?.oral || false,
      oral_description: clinic?.oral_description || "",
      nose: clinic?.nose || false,
      nose_description: clinic?.nose_description || "",
      earing_left: clinic?.earing_left || false,
      earing_left_description: clinic?.earing_left_description || "",
      earing_right: clinic?.earing_right || false,
      earing_right_description: clinic?.earing_right_description || "",
      face: clinic?.face || false,
      face_description: clinic?.face_description || "",
      idx: clinic?.idx || "",
      evolution: clinic?.evolution || "",
      mc: clinic?.mc || "",
      medications: [
        {
          id_medicine: 0,
          frequency: "",
          duration: "",
        },
      ],
    },
  })

  const { response: medicationsData } = useFetch({
    url: "/medications/list",
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let body = {
      ...values,
      idPatient,
      id: clinic?.id,
    }

    let url = clinic ? `/patient/update-clinic-history` : "/patient/create-clinic-history"
    let method = clinic ? "put" : "post"

    execute({
      url,
      method,
      body: body,
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "",
          description: "Los antecedentes patológicos han sido guardados correctamente",
        })
        form.reset()
        updatePatient()
      }
    })
  }


  const oral = form.watch('oral')
  const nose = form.watch('nose')
  const earing_left = form.watch('earing_left')
  const earing_right = form.watch('earing_right')
  const face = form.watch('face')

  useEffect(() => {
    if (medicationsData) {
      const medi = medicationsData.data.map((med: any) => {
        return { label: `${med.brand} - ${med.name} - ${med.presentation}`, value: med.id }
      })
      setMedications(medi)
    }
  }, [medicationsData])


  return (
    <div className=''>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormInput
            label="Motivo de consulta"
            type='textarea'
            name="mc"
            control={form.control}
          />

          <FormInput
            label="Evolución del padecimiento"
            type='textarea'
            name="evolution"
            control={form.control}
          />

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12'>
              <FormSwitch
                label="Cavidad oral y Laringe"
                name="oral"
                control={form.control}
              />
            </div>
            {oral && (
              <div className='col-span-12'>
                <FormInput
                  label="Cavidad oral y Laringe"
                  type='textarea'
                  name="oral_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12'>
              <FormSwitch
                label="Nariz y SPN"
                name="nose"
                control={form.control}
              />
            </div>
            {nose && (
              <div className='col-span-12'>
                <FormInput
                  label="Nariz y SPN"
                  type='textarea'
                  name="nose_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12'>
              <FormSwitch
                label="Oído izquierdo"
                name="earing_left"
                control={form.control}
              />
            </div>
            {earing_left && (
              <div className='col-span-12'>
                <FormInput
                  label="Oído izquierdo"
                  type='textarea'
                  name="earing_left_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12'>
              <FormSwitch
                label="Oído derecho"
                name="earing_right"
                control={form.control}
              />
            </div>
            {earing_right && (
              <div className='col-span-12'>
                <FormInput
                  label="Oído derecho"
                  type='textarea'
                  name="earing_right_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-12'>
              <FormSwitch
                label="Cara y cuello"
                name="face"
                control={form.control}
              />
            </div>
            {face && (
              <div className='col-span-12'>
                <FormInput
                  label="Cara y cuello"
                  type='textarea'
                  name="face_description"
                  control={form.control}
                />
              </div>
            )}
          </div>

          <FormInput
            label="Diagnostico"
            type='textarea'
            name="idx"
            control={form.control}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Medicamentos</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentMedications = form.getValues("medications")
                  form.setValue("medications", [
                    ...currentMedications,
                    { id_medicine: 0, frequency: "", duration: "" },
                  ])
                }}
              >
                Agregar medicamento
              </Button>
            </div>

            {form.watch("medications").map((_, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Medicamento #{index + 1}</h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentMedications = form.getValues("medications")
                        form.setValue(
                          "medications",
                          currentMedications.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      Quitar medicamento
                    </Button>
                  )}
                </div>

                <FormCombobox
                  label="Medicamento"
                  control={form.control}
                  name={`medications.${index}.id_medicine`}
                  option={medications}
                  setValue={form.setValue}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormInput
                    label="Frecuencia"
                    name={`medications.${index}.frequency`}
                    control={form.control}
                  />

                  <FormInput
                    label="Durante"
                    name={`medications.${index}.duration`}
                    control={form.control}
                  />
                </div>

              </Card>
            ))}

            {form.formState.errors.medications && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.medications.message}</p>
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
