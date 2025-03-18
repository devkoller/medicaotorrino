
import { useState, useEffect } from "react"
import { Layout } from "@/components/auth"
import { useParams } from "react-router-dom"
import { useFetch, usePost } from "@/hooks"
import { useNavigate } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { PatientType } from "@/types"


//tabs
import { Patient } from '@/components/patients/ById/Patient'
import { PatientMedicalHistory } from '@/components/patients'


interface StateTypeof {
  patient: PatientType | null
}


export const PatientById = () => {
  const { id } = useParams()
  const { execute } = usePost()
  const navigate = useNavigate()
  const [viewingMedicalHistory, setViewingMedicalHistory] = useState(false)
  const [Data, setData] = useState<StateTypeof>({
    patient: null,
  })

  const { response: patientData, loading } = useFetch({
    url: `/patient/get/${id}`,
  })

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
        <PatientMedicalHistory
          patient={Data.patient}
          onBack={() => setViewingMedicalHistory(false)}
        />
      ) : (
        <Patient patient={Data.patient} idPatient={Data.patient?.id || 0} updatePatient={updatePatient} onViewHistory={() => setViewingMedicalHistory(true)} />
      )}



    </Layout>
  )
}
