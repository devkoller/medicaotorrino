import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput, FormCombobox } from '@/components/Form'
import { PatientType, UserType } from "@/types"
import { usePost, useFetch } from "@/hooks"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"
import { format } from "date-fns"
import { AppointmentType } from "@/types"

const durationOptions = [
  { value: 15, label: "15 minutos" },
  { value: 30, label: "30 minutos" },
  { value: 45, label: "45 minutos" },
  { value: 60, label: "60 minutos" },
]

const formSchema = z.object({
  patientId: z.number({
    message: "El paciente es requerido",
  }),
  idUser: z.number({
    message: "El doctor es requerido",
  }),
  duration: z.number({
    message: "La duración es requerida",
  }),
  dateAppointment: z.string({
    message: "La fecha es requerida",
  }),
  startTime: z.string({
    message: "La hora es requerida",
  }),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

interface FormAppointmentProps {
  setIsNewAppointmentOpen: (open: boolean) => void
  selectedAppointment?: AppointmentType | null
}

export const FormAppointment = ({ setIsNewAppointmentOpen, selectedAppointment }: FormAppointmentProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const [Data, setData] = useState({
    patients: [],
    doctors: [],
  })

  const { response: patientsData, loading: loadingPatients } = useFetch({
    url: "/patient/get-all",
  })

  const { response: doctorsData, loading: loadingDoctors } = useFetch({
    url: "/user/list-doctors"
  })


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: 0,
      idUser: 0,
      duration: 30,
      dateAppointment: format(new Date(), "yyyy-MM-dd"),
      startTime: "",
      reason: '',
      notes: '',
    },
  })



  function onSubmit(values: z.infer<typeof formSchema>) {
    execute({
      url: '/patient/appointment/create',
      body: values,
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Cita guardada",
          description: "La cita ha sido guardada correctamente",
        })
        form.reset()
        setIsNewAppointmentOpen(false)
      }
    })
  }

  useEffect(() => {
    if (selectedAppointment) {
      form.reset({
        ...selectedAppointment,
        dateAppointment: format(new Date(selectedAppointment.dateAppointment), "yyyy-MM-dd"),
      })
    }
  }, [selectedAppointment])

  useEffect(() => {
    if (patientsData) {
      let patient = patientsData.data.map((e: PatientType) => {
        return {
          value: e.id,
          label: `${e.name} ${e.lastname1} ${e.lastname2}`,
        }
      })

      setData(e => ({ ...e, patients: patient }))
    }
  }, [patientsData])

  useEffect(() => {
    if (doctorsData) {
      const doctorsList = doctorsData.data.map((doctor: UserType) => {
        return {
          value: doctor.id,
          label: `${doctor.academic || ""} ${doctor.name} ${doctor.lastname1} ${doctor.lastname2}`,
        }

      })
      setData({
        ...Data,
        doctors: doctorsList,
      })
    }
  }, [doctorsData])

  if (loadingPatients || loadingDoctors) {
    return (
      <DialogContent className="flex items-center justify-center h-full">
        <Spinner />
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          Agendar nueva cita
        </DialogTitle>
        <DialogDescription>
          Ingresa los datos del paciente y la cita a continuación.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormCombobox
            label="Paciente"
            control={form.control}
            name='patientId'
            option={Data.patients}
            setValue={form.setValue}
          />


          <div className="grid grid-cols-2 gap-4">
            <FormCombobox
              label="Doctor"
              control={form.control}
              name='idUser'
              option={Data.doctors}
              setValue={form.setValue}
            />

            <FormCombobox
              label="Duración"
              control={form.control}
              name='duration'
              option={durationOptions}
              setValue={form.setValue}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Día de la cita"
              name="dateAppointment"
              type="date"
              control={form.control}
              required
            />
            <FormInput
              label="Hora"
              name="startTime"
              type="time"
              control={form.control}
              required
            />
          </div>

          <FormInput
            label="Razón de la cita"
            name="reason"
            control={form.control}
          />

          <FormInput
            label="Notas adicionales"
            name="notes"
            control={form.control}
          />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>Agendar cita</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
