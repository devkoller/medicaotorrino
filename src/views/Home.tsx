import { Layout } from '@/components/auth'
import { useFetch } from '@/hooks'
import { useState, useEffect } from "react"
import { addMonths, subMonths, isSameDay, parseISO, } from "date-fns"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { Spinner } from "@/components/ui/spinner"
import { Calendar, FormAppointment, InfoAppointment, AppointmentsToday } from "@/components/home"
import { UserType, AppointmentType } from '@/types'

interface StateTypeof {
  doctors: UserType[]
  appointments: AppointmentType[]
  currentMonth: Date
  selectedDate: Date
  selectedAppointment: AppointmentType | null
  newAppointment: AppointmentType | null
}

export const Home = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [isViewAppointmentOpen, setIsViewAppointmentOpen] = useState(false)

  const [Data, setData] = useState<StateTypeof>({
    doctors: [],
    appointments: [],
    currentMonth: new Date(),
    selectedDate: new Date(),
    selectedAppointment: null,
    newAppointment: null,
  })

  const { response: doctorsData, loading: loadingDoctors } = useFetch({
    url: "/user/list-doctors"
  })

  const { response: appointmentData, loading: loadingAppointment } = useFetch({
    url: "/patient/appointment/get-all"
  })


  // Handle month navigation
  const prevMonth = () => setData(prev => ({
    ...prev,
    currentMonth: subMonths(prev.currentMonth, 1),
  }))
  const nextMonth = () => setData(prev => ({
    ...prev,
    currentMonth: addMonths(prev.currentMonth, 1),
  }))

  const setCurrentMonth = (date: Date) => {
    setData(prev => ({
      ...prev,
      currentMonth: date,
    }))
  }

  // Filter appointments by doctor
  const filteredAppointments =
    selectedDoctor === "all"
      ? Data.appointments
      : Data.appointments.filter((appointment) => appointment.idUser.toString() === selectedDoctor)

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    return filteredAppointments.filter((appointment) => isSameDay(parseISO(`${appointment.dateAppointment}T${appointment.startTime}:00`), date))
  }


  // Handle day selection
  const handleDayClick = (date: Date) => {
    setData(prev => ({
      ...prev,
      selectedAppointment: {
        dateAppointment: date,
      } as unknown as AppointmentType,
    }))
    setIsNewAppointmentOpen(true)
  }

  // Handle appointment click
  const handleAppointmentClick = (appointment: AppointmentType) => {
    setData(prev => ({
      ...prev,
      selectedAppointment: appointment,
    }))
    setIsViewAppointmentOpen(true)
  }

  useEffect(() => {
    if (doctorsData) {
      const doctorsList = doctorsData.data.map((doctor: UserType) => {
        return {
          ...doctor,
          name: `${doctor.academic || ""} ${doctor.name} ${doctor.lastname1} ${doctor.lastname2}`,
        }
      })

      setData(prev => ({
        ...prev,
        doctors: doctorsList
      }))
    }
  }, [doctorsData])


  useEffect(() => {
    if (appointmentData) {
      setData(prev => ({
        ...prev,
        appointments: appointmentData.data
      }))
    }
  }, [appointmentData])



  if (loadingDoctors || loadingAppointment) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Calendario citas</h1>
          <Button
            onClick={() => {
              setData(prev => ({
                ...prev,
                selectedAppointment: null,
              }))
              setIsNewAppointmentOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva cita
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Medico</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger id="doctor">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los medicos</SelectItem>
                        {Data.doctors.map((doctor: UserType) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AppointmentsToday
              getAppointmentsForDay={getAppointmentsForDay}
              handleAppointmentClick={handleAppointmentClick}
            />

          </div>

          <div className="space-y-6">
            <Calendar
              prevMonth={prevMonth}
              nextMonth={nextMonth}
              currentMonth={Data.currentMonth}
              setCurrentMonth={setCurrentMonth}
              getAppointmentsForDay={getAppointmentsForDay}
              handleDayClick={handleDayClick}
              handleAppointmentClick={handleAppointmentClick}
            />
          </div>
        </div>
      </main>

      {/* New Appointment Dialog */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <FormAppointment setIsNewAppointmentOpen={setIsNewAppointmentOpen} selectedAppointment={Data.selectedAppointment} />
      </Dialog>

      {/* View Appointment Dialog */}
      {Data.selectedAppointment && (
        <Dialog open={isViewAppointmentOpen} onOpenChange={setIsViewAppointmentOpen}>
          <InfoAppointment selectedAppointment={Data.selectedAppointment} />
        </Dialog>
      )}
    </Layout>
  )
}
