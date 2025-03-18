import { useState } from "react"
import { PatientType } from "@/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { PathologicalHistory } from './PathologicalHistory'
import { History } from './History'
import { FamilyHistory } from './FamilyHistory'
import { Button } from "@/components/ui/button"
import { utils } from "@/utils"
import { ClinicHistory } from '@/components/patients/ById/ClinicHistory'
import { useNavigate } from "react-router-dom"
import { Address } from "./Address"
import { FormPatientModify } from "../FormPatientModify"
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
  Phone,
  MapPin,
  User,
  Users,
  PillBottle,
  Cigarette,
  Wine,
  Glasses,
  Rabbit,
  Bed,
  Mail,
  Wrench
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
  onViewHistory: () => void
}

interface StateTypeof {
  patient: PatientType | null
  dialogTile: string
  dialogType: number
}

export const Patient = ({ patient, updatePatient, onViewHistory }: PatientProps) => {
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
          Regresar a lista de usuarios
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
                  {format(`${patient?.birthdate}T00:00:00`, "MMMM d, yyyy")} ({utils.calculateAge(new Date(`${patient?.birthdate}T00:00:00`))} years)
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="w-fit">
              Paciente ID: {patient?.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Información personal</TabsTrigger>
              <TabsTrigger value="medical">Historial medico</TabsTrigger>
            </TabsList>



            <TabsContent value="personal" className="pt-6">
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
                <Button onClick={onViewHistory}>
                  Ver historial completo
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="pt-6">
              <ClinicHistory clinic={patient?.clinic_histories} idPatient={patient?.id || 0} updatePatient={updatePatient} />
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-base">Antecedentes patológicos</CardTitle>
              <Button onClick={() => {
                handleDialog(1)
                setOpenDialog(true)
              }}>
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!patient?.pathological_history && (
              <p className="text-sm text-muted-foreground">No se han registrados antecedentes patológicos</p>
            )}

            {patient?.pathological_history && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {patient?.pathological_history?.asthma && (
                    <div className="flex items-center">
                      <span>Asma</span>
                    </div>

                  )}

                  {patient?.pathological_history?.dm && (
                    <div className="flex items-center">
                      <span>Diabetes Mellitus</span>
                    </div>

                  )}

                  {patient?.pathological_history?.has && (
                    <div className="flex items-center">
                      <span>Hipertensión Arterial</span>
                    </div>
                  )}

                  {patient?.pathological_history?.surgery && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Cirugías</h3>
                      <div className="flex items-center">
                        <span>{patient?.pathological_history?.surgery_description}</span>
                      </div>
                    </div>
                  )}

                  {patient?.pathological_history?.allergies && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Alergias</h3>
                      <div className="flex items-center">
                        <span>{patient?.pathological_history?.allergies_description}</span>
                      </div>
                    </div>
                  )}

                </div>
                {patient?.pathological_history?.other_diseases && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Otras enfermedades</h3>
                    <div className="flex items-center">
                      <span>{patient?.pathological_history?.other_diseases_description}</span>
                    </div>
                  </div>
                )}

              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-base">Antecedentes no patológicos</CardTitle>
              <Button onClick={() => {
                handleDialog(2)
                setOpenDialog(true)
              }}>
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!patient?.history && (
              <p className="text-sm text-muted-foreground">No se han registrados antecedentes no patológicos</p>
            )}

            {patient?.history && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {patient?.history?.tabaquism && (
                    <div className="flex items-center">
                      <Cigarette className="h-4 w-4 mr-2 text-primary" />
                      <span>Tabaquismo</span>
                    </div>
                  )}

                  {patient?.history?.alcoholism && (
                    <div className="flex items-center">
                      <Wine className="h-4 w-4 mr-2 text-primary" />
                      <span>Alcoholismo</span>
                    </div>
                  )}

                  {patient?.history?.use_glasses && (
                    <div className="flex items-center">
                      <Glasses className="h-4 w-4 mr-2 text-primary" />
                      <span>Usa lentes</span>
                    </div>
                  )}

                  {patient?.history?.animals && (
                    <div className="flex items-center">
                      <Rabbit className="h-4 w-4 mr-2 text-primary" />
                      <span>Convive con animales</span>
                    </div>
                  )}

                  {patient?.history?.sleep_habits && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Hábitos de sueño</h3>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-2 text-primary" />
                        <span>{patient?.history?.sleep_habits_description}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-base">Antecedentes familiares</CardTitle>
              <Button onClick={() => {
                handleDialog(3)
                setOpenDialog(true)
              }}>
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!patient?.family_history && (
              <p className="text-sm text-muted-foreground">No se han registrados antecedentes familiares</p>
            )}
            {patient?.family_history && (
              <div className="space-y-4">

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Antecedentes familiares</h3>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{patient?.family_history?.family_history}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Otros medicamentos</h3>
                  <div className="flex items-center">
                    <PillBottle className="h-4 w-4 mr-2 text-primary" />
                    <span>{patient?.family_history?.other_medications}</span>
                  </div>
                </div>

              </div>
            )}
          </CardContent>
        </Card>
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
