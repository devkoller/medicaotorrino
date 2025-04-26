import { PatientType } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

interface PathologicalCardProps {
  patient: PatientType | null
  handleDialog?: (index: number) => void
  setOpenDialog?: (open: boolean) => void
}

export const PathologicalCard = ({ patient, handleDialog, setOpenDialog }: PathologicalCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-base">Antecedentes patológicos</CardTitle>
          {handleDialog && setOpenDialog && (
            <Button onClick={() => {
              handleDialog(1)
              setOpenDialog(true)
            }}>
              Editar
            </Button>
          )}
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
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Asma</h3>
                  <span>{patient?.pathological_history?.asthma_description}</span>
                </div>

              )}

              {patient?.pathological_history?.dm && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Diabetes Mellitus</h3>
                  <span>{patient?.pathological_history?.dm_description}</span>
                </div>

              )}

              {patient?.pathological_history?.has && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Hipertensión Arterial</h3>
                  <span>{patient?.pathological_history?.has_description}</span>
                </div>
              )}

              {patient?.pathological_history?.surgery && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Cirugías</h3>
                  <span>{patient?.pathological_history?.surgery_description}</span>
                </div>
              )}

              {patient?.pathological_history?.allergies && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Alergias</h3>
                  <span>{patient?.pathological_history?.allergies_description}</span>
                </div>
              )}

            </div>
            {patient?.pathological_history?.other_diseases && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Otras enfermedades</h3>
                <span>{patient?.pathological_history?.other_diseases_description}</span>
              </div>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  )
}
