import { PatientType, AppointmentType } from "@/types"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale";
import {
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

interface TabAppointmentsProps {
  patient: PatientType | null
  handleDialog: (index: number) => void
  setOpenDialog: (open: boolean) => void
  onViewHistory: () => void
  setClinicHistory: (clinicHistory: AppointmentType) => void
}

export const TabAppointments = ({ patient, onViewHistory, setClinicHistory }: TabAppointmentsProps) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historial de citas</h3>
        <Badge variant="outline" className="ml-2">
          {patient?.appointments?.length || 0} Total
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Medico</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patient?.appointments?.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div className="font-medium">{format(parseISO(appointment.date || ''), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}</div>
                <div className="text-sm text-muted-foreground">
                  {format(parseISO(appointment.date || ''), "h:mm a")}
                </div>
              </TableCell>
              <TableCell>{appointment.doctorName}</TableCell>
              <TableCell>{appointment.reason}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    appointment.status === 2
                      ? "secondary"
                      : appointment.status === 1
                        ? "outline"
                        : "default"
                  }
                >
                  {appointment.status === 2
                    ? "Completada"
                    : appointment.status === 1
                      ? "Confirmada"
                      : "Cancelada"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {appointment.status === 1 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // setSelectedAppointment(appointment)
                      // setIsAddNoteOpen(true)
                      onViewHistory()
                      setClinicHistory(appointment)
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generar nota clínica
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm">
                    Completa
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
