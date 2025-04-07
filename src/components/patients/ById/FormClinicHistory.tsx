import { PatientClinicType, AppointmentType } from '@/types'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput, FormSwitch, FormInputAutoComplete } from '@/components/Form'
import { usePost, useFetch } from "@/hooks"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { Separator } from '@radix-ui/react-separator'
import { FileText } from "lucide-react"


interface ClinicHistoryProps {
  clinic?: PatientClinicType | null
  idPatient: number
  updatePatient: () => void
  onBack: () => void
  appointment: AppointmentType | null
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
        medicine_description: z.string().min(1, {
          message: "El medicamento es requerido.",
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

interface StateTypeof {
  ClinicSaved: PatientClinicType | null
}

export const FormClinicHistory = ({ clinic, idPatient, updatePatient, onBack, appointment }: ClinicHistoryProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const [medications, setMedications] = useState([])
  const [Data, setData] = useState<StateTypeof>({
    ClinicSaved: null,
  })

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
          medicine_description: '',
          frequency: "",
          duration: "",
        },
      ],
    },
  })

  const { response: medicationsData } = useFetch({
    url: "/medications/list",
  })

  const pullRecipe = (id: number, tam: number) => {
    execute({
      url: `/patient/pdf`,
      body: {
        id_clinic: id,
        tam
      }
    }).then((res: any) => {
      if (res.status === 200) {
        const byteCharacters = atob(res.data)
        const byteNumbers = new Uint8Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const blob = new Blob([byteNumbers], { type: "application/pdf" })
        const blobURL = URL.createObjectURL(blob)

        // Abrir en una nueva pestaña
        window.open(blobURL, "_blank")
      }
    })
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    let body = {
      ...values,
      idPatient,
      id: clinic?.id,
      appointment,
    }

    let url = clinic?.id ? `/patient/update-clinic-history` : "/patient/create-clinic-history"
    let method = clinic?.id ? "put" : "post"

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
        setData(e => ({ ...e, ClinicSaved: res.data }))
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
      setMedications(medicationsData.data)
    }
  }, [medicationsData])


  return (
    <div className=''>
      <div className='flex justify-end mb-5'>
        {Data.ClinicSaved && (
          <>
            <Button variant="outline" size="sm" onClick={() => pullRecipe(Data?.ClinicSaved?.id || 0, 1)} disabled={loading}>
              <FileText className="h-4 w-4 mr-1" />
              Ver receta (Media carta)
            </Button>
            <Button size="sm" onClick={() => pullRecipe(Data?.ClinicSaved?.id || 0, 2)} disabled={loading}>
              <FileText className="h-4 w-4 mr-1" />
              Ver receta (Carta)
            </Button>
          </>
        )}
        <Button variant="outline" onClick={onBack}>
          Regresar al perfil del paciente
        </Button>
      </div>
      <Separator className="mb-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6 md:col-span-6 space-y-4'>
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
            </div>


            <div className='col-span-12 md:col-span-6'>
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
                        { medicine_description: "", frequency: "", duration: "" },
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

                    <FormInputAutoComplete
                      label="Medicamento"
                      placeholder="Escribe el medicamento"
                      name={`medications.${index}.medicine_description`}
                      options={medications}
                      setValue={form.setValue}
                      control={form.control}
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
            </div>

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
