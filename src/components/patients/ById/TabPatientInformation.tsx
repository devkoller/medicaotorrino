import { PatientType } from "@/types"
import { utils } from "@/utils"
import { Button } from "@/components/ui/button"
import { AppointmentType } from "@/types"
import {
  Phone,
  MapPin,
  User,
  Mail,
  Wrench
} from "lucide-react"

interface TabPatientInformationProps {
  patient: PatientType | null
  handleDialog: (index: number) => void
  setOpenDialog: (open: boolean) => void
  setClinicHistory: (clinicHistory: AppointmentType | null) => void
}



export const TabPatientInformation = ({
  patient,
  handleDialog,
  setOpenDialog,
}: TabPatientInformationProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Genero</h3>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              <span>{utils.formatGender(patient?.gender || 0)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Teléfono</h3>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              <span>{patient?.phone || 'Sin teléfono registrado'}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Correo</h3>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <span>{patient?.email || 'Sin correo registrado'}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Dirección</h3>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
            {!patient?.patient_address && (
              <span className="text-muted-foreground">
                No se ha registrado una dirección
              </span>
            )}
            {patient?.patient_address && (
              <div>
                <p className="whitespace-pre-wrap">{patient.patient_address.street}</p>
                <p className="whitespace-pre-wrap">{patient.patient_address.city}, {patient.patient_address.state}</p>
                <p className="whitespace-pre-wrap">{patient.patient_address.country}</p>
                <p className="whitespace-pre-wrap">{patient.patient_address.zip_code}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Ocupación</h3>
          <div className="flex items-center">
            <Wrench className="h-4 w-4 mr-2 text-primary" />
            <span>{patient?.workIn || 'Sin ocupación registrada'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-2">
        <Button variant="outline" onClick={() => {
          handleDialog(5)
          setOpenDialog(true)
        }}>Editar paciente</Button>
        <Button variant="outline" onClick={() => {
          handleDialog(4)
          setOpenDialog(true)
        }}>Editar dirección</Button>
      </div>
    </>
  )
}
