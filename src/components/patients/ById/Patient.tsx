import { useState } from "react"
import { PatientType, AppointmentType } from "@/types"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge"
import { PathologicalHistory } from './FormPathologicalHistory'
import { History } from './FormHistory'
import { FamilyHistory } from './FamilyHistory'
import { Button } from "@/components/ui/button"
import { utils } from "@/utils"
import { useNavigate } from "react-router-dom"
import { Address } from "./FormAddress"
import { FormPatientModify } from "../FormPatientModify"
import { PatientMedicalHistory } from "@/components/patients"
import { TabPatientInformation } from './TabPatientInformation'
import { TabAppointments } from './TabAppointments'
import { PathologicalCard } from './PathologicalCard'
import { NonPathologicalCard } from './NonPathologicalCard'
import { FamilyCard } from './FamilyCard'
import { FormClinicHistory } from "@/components/patients/ById/FormClinicHistory"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  CalendarIcon,
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PatientProps {
  patient: PatientType | null
  idPatient: number
  updatePatient: () => void
  setClinicHistory: (clinicHistory: AppointmentType | null) => void
}

interface StateTypeof {
  patient: PatientType | null
  dialogTile: string
  dialogType: number
}

export const Patient = ({ patient, updatePatient, setClinicHistory }: PatientProps) => {
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()
  const [Data, setData] = useState<StateTypeof>({
    patient: null,
    dialogTile: '',
    dialogType: 0
  })

  const handleDialog = (type: number) => {
    const dialogs = {
      1: 'Antecedentes patológicos',
      2: 'Antecedentes no patológicos',
      3: 'Antecedentes familiares',
      4: 'Dirección del paciente',
      5: 'Información personal',
    }

    setData(prev => ({
      ...prev,
      dialogTile: dialogs[type as keyof typeof dialogs],
      dialogType: type
    }))
  }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <Button variant="outline" onClick={() => {
          navigate('/admin-pacientes')
        }}>
          Regresar a lista de pacientes
        </Button>
      </div>
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                {/* <AvatarImage src={patient.profileImage} alt={patient.name} /> */}
                <AvatarFallback className="text-lg">{utils.getInitials(patient?.name || '')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{`${patient?.name} ${patient?.lastname1} ${patient?.lastname2}`}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {format(parseISO(`${patient?.birthdate}T00:00:00`), "d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}, ({utils.calculateAge(new Date(`${patient?.birthdate}T00:00:00`))} años)
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="w-fit">
              Paciente ID: {patient?.id}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="medical" className="w-full">

            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Información personal</TabsTrigger>
              <TabsTrigger value="new">Generar historia clínica</TabsTrigger>
              <TabsTrigger value="medical">Historial medico</TabsTrigger>
              {/* <TabsTrigger value="appointments">Citas</TabsTrigger> */}
            </TabsList>

            <TabsContent value="personal" className="pt-6">
              <TabPatientInformation
                patient={patient}
                handleDialog={handleDialog}
                setOpenDialog={setOpenDialog}
                setClinicHistory={setClinicHistory}
              />
            </TabsContent>

            <TabsContent value="new" className="pt-6">
              <FormClinicHistory
                idPatient={patient?.id || 0}
                updatePatient={updatePatient}
                patient={patient}
              />
            </TabsContent>

            <TabsContent value="appointments" className="pt-6">
              <TabAppointments
                patient={patient}
                handleDialog={handleDialog}
                setOpenDialog={setOpenDialog}
                setClinicHistory={setClinicHistory}
              />
            </TabsContent>

            <TabsContent value="medical" className="pt-6">
              <PatientMedicalHistory patient={patient} />
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <PathologicalCard patient={patient} handleDialog={handleDialog} setOpenDialog={setOpenDialog} />
        <NonPathologicalCard patient={patient} handleDialog={handleDialog} setOpenDialog={setOpenDialog} />
        <FamilyCard patient={patient} handleDialog={handleDialog} setOpenDialog={setOpenDialog} />

      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {Data.dialogTile}
            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          {Data.dialogType === 1 && (
            <PathologicalHistory pathological={patient?.pathological_history} idPatient={patient?.id || 0} updatePatient={updatePatient} closeDialog={() => { setOpenDialog(false) }} />
          )}
          {Data.dialogType === 2 && (
            <History nonPathological={patient?.history} idPatient={patient?.id || 0} updatePatient={updatePatient} closeDialog={() => { setOpenDialog(false) }} />
          )}
          {Data.dialogType === 3 && (
            <FamilyHistory family={patient?.family_history} idPatient={patient?.id || 0} updatePatient={updatePatient} closeDialog={() => { setOpenDialog(false) }} />
          )}
          {Data.dialogType === 4 && (
            <Address add={patient?.patient_address} idPatient={patient?.id || 0} updatePatient={updatePatient} closeDialog={() => { setOpenDialog(false) }} />
          )}
          {Data.dialogType === 5 && (
            <FormPatientModify selectedPatient={patient} updatePatient={updatePatient} closeDialog={() => { setOpenDialog(false) }} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
