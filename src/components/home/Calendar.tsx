import { Card, CardContent, CardHeader, } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, getDay, getDaysInMonth, isSameDay, parseISO, startOfMonth, } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { AppointmentType } from "@/types"


interface CalendarType {
  prevMonth: () => void
  nextMonth: () => void
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  getAppointmentsForDay: (date: Date) => AppointmentType[]
  handleDayClick: (date: Date) => void
  handleAppointmentClick: (appointment: any) => void
}

export const Calendar = ({ prevMonth, nextMonth, currentMonth, setCurrentMonth, getAppointmentsForDay, handleDayClick, handleAppointmentClick }: CalendarType) => {





  // Generate calendar days
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const daysInMonth = getDaysInMonth(currentMonth)
    const startDay = getDay(monthStart)

    const days = []

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border bg-muted/20"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dayAppointments = getAppointmentsForDay(date)
      const isToday = isSameDay(date, new Date())

      days.push(
        <div
          key={day}
          className={`h-24 border border-border p-1 relative ${isToday ? "bg-primary/10" : ""}`}
          onClick={() => handleDayClick(date)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
            {dayAppointments.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {dayAppointments.length}
              </Badge>
            )}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
            {dayAppointments.slice(0, 2).map((appointment) => {
              // const doctor = doctors.find((d) => d.id === appointment.doctorId)
              return (
                <div
                  key={appointment.id}
                  className="text-xs p-1 rounded bg-primary/20 cursor-pointer truncate"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAppointmentClick(appointment)
                  }}
                >
                  {format(parseISO(appointment.date || ''), "HH:mm")} - {appointment.patientName}
                </div>
              )
            })}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-muted-foreground text-center">+{dayAppointments.length - 2} more</div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Hoy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0">
          {["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((day) => (
            <div key={day} className="h-10 flex items-center justify-center font-medium text-sm">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </CardContent>
    </Card>
  )
}
