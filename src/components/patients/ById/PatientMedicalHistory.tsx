import { PatientType } from "@/types"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale";
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
  top?: number
}

export const PatientMedicalHistory = ({ patient, top }: PatientMedicalHistoryProps) => {
  const { execute, loading } = usePost()

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

  const downloadFile = (id: number) => {
    execute({
      url: `/patient/download`,
      body: {
        id
      },
    }).then((res: any) => {

      if (res.status === 200) {
        const byteCharacters = atob(res.data.base64)
        const byteNumbers = new Uint8Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const blob = new Blob([byteNumbers], { type: res.data.type })
        const blobURL = URL.createObjectURL(blob)

        // Abrir en una nueva pestaña
        window.open(blobURL, "_blank")
      }
    })
  }

  const printHistory = () => {
    if (patient?.clinic_histories?.length === 0) {
      return (
        <div>
          <p>El paciente aún no tiene un historial medico</p>
        </div>
      )
    }



    return patient?.clinic_histories?.map((history, index) => {
      if (top && index >= top) {
        return null
      }
      if (index === 0) {
        // console.log(history);

      }
      return (
        <Accordion type="single" collapsible className="w-full" key={index} defaultValue={'a0'}>
          <AccordionItem value={'a' + index} defaultValue={index === 0 ? 'open' : ''}>
            <AccordionTrigger className="text-sm py-2">
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">{format(parseISO(`${history?.updatedAt}`), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mb-8">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div>
                      <p className="text-sm text-muted-foreground">{format(parseISO(`${history?.updatedAt}`), "d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}</p>
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
                    <AccordionItem value="details">
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

                  {history?.medical_recipe && (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="medications">
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
                  )}

                  {history?.files && (
                    <Accordion type="single" collapsible className="w-full" defaultValue="files">
                      <AccordionItem value="files">
                        <AccordionTrigger className="text-sm py-2">Archivos</AccordionTrigger>
                        <AccordionContent>
                          <ul>
                            {history?.files.map((file, index) => {
                              if (file.type === 'LINK') {
                                return (
                                  <li key={index} className="mb-2">
                                    <a href={file.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                      {file.link}
                                    </a>
                                  </li>
                                )
                              }
                              return (
                                <li key={index} className="mb-2">
                                  <Button variant={'ghost'} size="sm" onClick={() => downloadFile(file.id)}>
                                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {file.name}
                                  </Button>
                                </li>
                              )
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

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
            </AccordionContent>
          </AccordionItem>
        </Accordion>


      )
    })
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Historial medico</h1>
        </div>
      </div>


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
