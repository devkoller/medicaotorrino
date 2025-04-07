import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO, } from "date-fns"

import { AppointmentType } from "@/types"

interface AppointmentsTodayProps {
  getAppointmentsForDay: (date: Date) => AppointmentType[]
  handleAppointmentClick: (appointment: AppointmentType) => void
}

export const AppointmentsToday = ({ getAppointmentsForDay, handleAppointmentClick }: AppointmentsTodayProps) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citas para hoy</CardTitle>
        <CardDescription>{format(new Date(), "EEEE, MMMM d, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {getAppointmentsForDay(new Date()).length > 0 ? (
            getAppointmentsForDay(new Date()).map((appointment) => {
              return (
                <div
                  key={appointment.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-accent"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(`${appointment.dateAppointment}T${appointment.startTime}:00`), "h:mm a")} ({appointment.duration} min)
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    {/* <User className="mr-1 h-3 w-3" /> */}
                    {appointment.doctorName}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground">No hay citas agendadas para hoy.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
