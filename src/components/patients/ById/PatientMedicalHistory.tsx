import { PatientType } from "@/types"
import { format } from "date-fns"
import { Calendar, FileText } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { utils } from "@/utils"
import { usePost } from '@/hooks';
import { API_URL } from '@/api/config'


interface PatientMedicalHistoryProps {
  patient: PatientType | null
}

export const PatientMedicalHistory = ({ patient, }: PatientMedicalHistoryProps) => {
  const { execute, loading } = usePost()

  const printHistory = () => {
    if (patient?.clinic_histories?.length === 0) {
      return (
        <div>
          <p>El paciente aún no tiene un historial medico</p>
        </div>
      )
    }

    const pullRecipe = (id: number, tam: number) => {
      execute({
        url: `/patient/pdf`,
        body: {
          id_clinic: id,
          tam
        }
      }).then((res: any) => {
        if (res.status === 200) {
          const byteCharacters = atob(res.data)
          const byteNumbers = new Uint8Array(byteCharacters.length)

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }

          const blob = new Blob([byteNumbers], { type: "application/pdf" })
          const blobURL = URL.createObjectURL(blob)

          // Abrir en una nueva pestaña
          window.open(blobURL, "_blank")
        }
      })
    }

    return patient?.clinic_histories?.map((history, index) => {
      return (
        <div key={index} className="mb-8">
          <div className="absolute -left-[41px] bg-background p-1 rounded-full border-2 border-primary">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground">{format(`${history?.updatedAt}`, "MMMM d, yyyy")}</p>
                <div>
                  <p className="text-muted-foreground">Motivo de consulta</p>
                  <p>{history?.mc}</p>
                </div>
              </div>
              <div className="flex items-center mt-2 md:mt-0">
                {history?.user && (
                  <>
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`${API_URL}/user/get-profile-image/${history?.user.id}`} alt={history?.user.name} />
                      <AvatarFallback>{utils.getInitials(history?.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{`${history?.user.name} ${history?.user.lastname1}`}</p>
                      <p className="text-muted-foreground">Medico</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-muted-foreground">Evolución</p>
              <p>{history?.evolution}</p>
            </div>

            <div className="mb-3">
              <p className="text-muted-foreground">Diagnostico</p>
              <p>{history?.idx}</p>
            </div>

            <div className="mb-3">
              <p className="text-sm font-medium mb-1">Zonas diagnosticadas</p>
              <div className="flex flex-wrap gap-2">
                {history?.oral && (
                  <Badge variant="outline">
                    {history?.oral && "Cavidad oral y Laringe"}
                  </Badge>
                )}
                {history?.nose && (
                  <Badge variant="outline">
                    {history?.nose && "Nariz y SPN"}
                  </Badge>
                )}
                {history?.earing_left && (
                  <Badge variant="outline">
                    {history?.earing_left && "Oído izquierdo"}
                  </Badge>
                )}
                {history?.earing_right && (
                  <Badge variant="outline">
                    {history?.earing_right && "Oído derecho"}
                  </Badge>
                )}
                {history?.face && (
                  <Badge variant="outline">
                    {history?.face && "Cara y cuello"}
                  </Badge>
                )}
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="vitals">
                <AccordionTrigger className="text-sm py-2">Ver detalles clínicos</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {history?.oral && (
                      <div>
                        <p className="text-muted-foreground">Cavidad oral y Laringe</p>
                        <p>{history?.oral_description}</p>
                      </div>
                    )}
                    {history?.nose && (
                      <div>
                        <p className="text-muted-foreground">Nariz y SPN</p>
                        <p>{history?.nose_description}</p>
                      </div>
                    )}
                    {history?.earing_left && (
                      <div>
                        <p className="text-muted-foreground">Oído izquierdo</p>
                        <p>{history?.earing_left_description}</p>
                      </div>
                    )}
                    {history?.earing_right && (
                      <div>
                        <p className="text-muted-foreground">Oído derecho</p>
                        <p>{history?.earing_right_description}</p>
                      </div>
                    )}
                    {history?.face && (
                      <div>
                        <p className="text-muted-foreground">Cara y cuello</p>
                        <p>{history?.face_description}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="vitals">
                <AccordionTrigger className="text-sm py-2">Ver detalles receta medica</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {history?.medical_recipe && (
                      <>
                        {history?.medical_recipe?.medical_recipe_details.map((detail, index) => {
                          return (
                            <div key={index}>
                              <p className="text-muted-foreground">{detail.medicine_description}</p>
                              <p>{detail.frequency}</p>
                              <p>{detail.duration}</p>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-3 mt-2">
              <Button variant="outline" size="sm" onClick={() => pullRecipe(history.id, 1)} disabled={loading}>
                <FileText className="h-4 w-4 mr-1" />
                Ver receta (Media carta)
              </Button>
              <Button size="sm" onClick={() => pullRecipe(history.id, 2)} disabled={loading}>
                <FileText className="h-4 w-4 mr-1" />
                Ver receta (Carta)
              </Button>
            </div>
          </div>
        </div>

      )
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Historial medico</h1>
        </div>
        {/* <Button variant="outline" onClick={onBack}>
          Regresar al perfil del paciente
        </Button> */}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medical records..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="6months">Past 6 Months</SelectItem>
              <SelectItem value="3months">Past 3 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="visits">Visits</SelectItem>
              <SelectItem value="diagnoses">Diagnoses</SelectItem>
              <SelectItem value="medications">Medications</SelectItem>
              <SelectItem value="labs">Lab Results</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="vaccinations">Vaccinations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle>Linea del tiempo medica</CardTitle>
          <CardDescription>
            Historial cronológico de todas las visitas medicas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative pl-8 pr-4 py-4 border-l-2 border-l-muted ml-6">
            {printHistory()}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
