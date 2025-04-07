import { PatientType } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Users,
  PillBottle,
} from "lucide-react"

interface FamilyCardProps {
  patient: PatientType | null
  handleDialog: (index: number) => void
  setOpenDialog: (open: boolean) => void
}

export const FamilyCard = ({
  patient,
  handleDialog,
  setOpenDialog
}: FamilyCardProps) => {
  return (
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
  )
}
