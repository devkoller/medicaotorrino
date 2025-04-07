
import { format, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AppointmentType } from "@/types"
import { Clock, CalendarIcon } from "lucide-react"


interface InfoAppointmentProps {
  selectedAppointment: AppointmentType | null
}

export const InfoAppointment = ({ selectedAppointment }: InfoAppointmentProps) => {
  if (!selectedAppointment) {
    return null
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Detalles de la cita</DialogTitle>
        <DialogDescription>
          Aquí puedes ver los detalles de la cita seleccionada.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar>

            {selectedAppointment.patientName && (
              <AvatarFallback>{selectedAppointment.patientName.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">{selectedAppointment.patientName}</h3>
            <p className="text-sm text-muted-foreground">{selectedAppointment.patientPhone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Fecha y hora</p>
            <p className="font-medium flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {selectedAppointment.date && (
                <>
                  {format(parseISO(selectedAppointment.date), "MMMM d, yyyy")}
                </>
              )}
            </p>
            <p className="font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              {selectedAppointment.date && (
                <>
                  {format(parseISO(selectedAppointment.date), "h:mm a")}({selectedAppointment.duration} min)
                </>
              )}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Doctor</p>
            <p className="font-medium">{selectedAppointment.doctorName}</p>
            <p className="text-sm text-muted-foreground">
              {selectedAppointment.doctorSpecialty || ''}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Razón de la visita</p>
          <p>{selectedAppointment.reason}</p>
        </div>

        {selectedAppointment.notes && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Notas</p>
            <p className="text-sm">{selectedAppointment.notes}</p>
          </div>
        )}

        <div className="pt-4 flex justify-between">
          <Badge variant={selectedAppointment.status === 1 ? "outline" : "secondary"}>
            {selectedAppointment.statusLabel}
          </Badge>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Editar
            </Button>
            <Button variant="destructive" size="sm">
              Cancelar cita
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
