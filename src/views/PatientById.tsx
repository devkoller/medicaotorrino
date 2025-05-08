
import { useState, useEffect } from "react"
import { Layout } from "@/components/auth"
import { useParams } from "react-router-dom"
import { useFetch, usePost } from "@/hooks"
import { useNavigate } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { PatientType, PatientClinicType, AppointmentType } from "@/types"


//tabs
import { Patient } from '@/components/patients/ById/Patient'
import { FormClinicHistory } from '@/components/patients/ById/FormClinicHistory'


interface StateTypeof {
  patient: PatientType | null
  clinicHistory: PatientClinicType | null
  appointment: AppointmentType | null
}


export const PatientById = () => {
  const { id } = useParams()
  const { execute } = usePost()
  const navigate = useNavigate()
  const [viewingMedicalHistory, setViewingMedicalHistory] = useState(false)
  const [Data, setData] = useState<StateTypeof>({
    patient: null,
    clinicHistory: null,
    appointment: null,
  })

  const { response: patientData, loading } = useFetch({
    url: `/patient/get/${id}`,
  })

  const setClinicHistory = (clinicHistory: AppointmentType | null) => {
    setData(prev => ({
      ...prev,
      clinicHistory: clinicHistory ? {
        mc: clinicHistory.reason,
      } as PatientClinicType : clinicHistory,
      appointment: clinicHistory,
    }))
  }

  const updatePatient = () => {
    execute({
      url: `/patient/get/${id}`,
      method: 'get',
    }).then((res: any) => {
      if (res.status === 200) {
        setData(e => ({ ...e, patient: res.data }))
      }
    })
  }

  useEffect(() => {
    if (patientData) {
      setData(e => ({ ...e, patient: patientData.data }))
    }
  }, [patientData])


  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  if (!Data.patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <div>Paciente no encontrado</div>
          <Button onClick={() => navigate("/admin-pacientes")}>Regresar</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {viewingMedicalHistory ? (
        <FormClinicHistory
          clinic={Data.clinicHistory}
          idPatient={Data.patient?.id || 0}
          updatePatient={updatePatient}
          appointment={Data.appointment}
          onBack={() => setViewingMedicalHistory(false)}
          patient={Data.patient}
        />
      ) : (
        <Patient
          patient={Data.patient}
          idPatient={Data.patient?.id || 0}
          updatePatient={updatePatient}
          onViewHistory={() => setViewingMedicalHistory(true)}
          setClinicHistory={setClinicHistory}
        />
      )}
    </Layout>
  )
}
