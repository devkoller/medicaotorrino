import { PatientType } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Cigarette,
  Wine,
  Glasses,
  Rabbit,
  Bed,
} from "lucide-react"

interface NonPathologicalCardProps {
  patient: PatientType | null
  handleDialog?: (index: number) => void
  setOpenDialog?: (open: boolean) => void
}

export const NonPathologicalCard = ({ patient, handleDialog, setOpenDialog }: NonPathologicalCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-base">Antecedentes no patológicos</CardTitle>
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
        {!patient?.history && (
          <p className="text-sm text-muted-foreground">No se han registrados antecedentes no patológicos</p>
        )}

        {patient?.history && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {patient?.history?.tabaquism && (
                <div>
                  <div className="flex items-center">
                    <Cigarette className="h-4 w-4 mr-2 text-primary" />
                    <span>Tabaquismo</span>
                  </div>
                  <p>{patient?.history?.tabaquism_description}</p>
                </div>
              )}

              {patient?.history?.alcoholism && (
                <div>
                  <div className="flex items-center">
                    <Wine className="h-4 w-4 mr-2 text-primary" />
                    <span>Alcoholismo</span>
                  </div>
                  <p>{patient?.history?.alcoholism_description}</p>
                </div>
              )}

              {patient?.history?.use_glasses && (
                <div>
                  <div className="flex items-center">
                    <Glasses className="h-4 w-4 mr-2 text-primary" />
                    <span>Usa lentes</span>
                  </div>
                  <p>{patient?.history?.use_glasses_description}</p>
                </div>
              )}

              {patient?.history?.animals && (
                <div>
                  <div className="flex items-center">
                    <Rabbit className="h-4 w-4 mr-2 text-primary" />
                    <span>Convive con animales</span>
                  </div>
                  <p>{patient?.history?.animals_description}</p>
                </div>
              )}

              {patient?.history?.sleep_habits && (
                <div>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Hábitos de sueño</h3>
                  </div>
                  <p>{patient?.history?.sleep_habits_description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
