import { PatientClinicType, PatientType } from '@/types'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput, FormSwitch, FormInputAutoComplete } from '@/components/Form'
import { usePost, useFetch, useLocalStorage } from "@/hooks"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  PlusCircle,
  Trash2,
  Upload,
  LinkIcon,
  FileText,
  Pill,
  ClipboardList,
  Save,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"


interface ClinicHistoryProps {
  clinic?: PatientClinicType | null
  idPatient: number
  updatePatient: () => void
  patient?: PatientType | null
}

const formSchema = z.object({
  oral: z.boolean().nullable(),
  oral_description: z.string().optional().nullable(),
  nose: z.boolean().nullable(),
  nose_description: z.string().optional().nullable(),
  earing_left: z.boolean().nullable(),
  earing_left_description: z.string().optional().nullable(),
  earing_right: z.boolean().nullable(),
  earing_right_description: z.string().optional().nullable(),
  face: z.boolean().nullable(),
  face_description: z.string().optional().nullable(),
  idx: z.string().optional().nullable(),
  plan: z.string().optional().nullable(),
  evolution: z.string().optional().nullable(),
  mc: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  medications: z
    .array(
      z.object({
        medicine_description: z.string().min(1, {
          message: "El medicamento es requerido.",
        }),
        frequency: z.string().min(1, {
          message: "La frecuencia del medicamento es requerida.",
        }),
        duration: z.string().min(1, {
          message: "La duración del tratamiento es requerida.",
        }),
      }),
    ).optional(),
  documents: z
    .array(
      z.object({
        type: z.string(),
        link: z.string().optional(),
        file: z.string().optional(),
      }),
    )
    .optional()
})


interface StateTypeof {
  ClinicSaved: PatientClinicType | null
}

export const FormClinicHistory = ({ clinic, idPatient, updatePatient, patient }: ClinicHistoryProps) => {
  const { execute, loading } = usePost()
  const { toast } = useToast()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [hasFiles, setHasFiles] = useState(false)
  const [activeSection, setActiveSection] = useState("medical")

  const [medications, setMedications] = useState([])
  const [Data, setData] = useState<StateTypeof>({
    ClinicSaved: null,
  })


  const defaultValues = {
    mc: "",
    evolution: "",
    oral: false,
    oral_description: "",
    nose: false,
    nose_description: "",
    earing_left: false,
    earing_left_description: "",
    earing_right: false,
    earing_right_description: "",
    face: false,
    face_description: "",
    idx: "",
    plan: "",
    notes: "",
    medications: [],
    documents: []
  }

  const [localStorage, setLocalStorage] = useLocalStorage({
    key: "FormClinicHistory",
    defaultValue: defaultValues,
  })


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const { response: medicationsData } = useFetch({
    url: "/medications/list",
  })

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    let body = {
      ...values,
      idPatient,
      id: clinic?.id,
    }

    const formData = new FormData()
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("files", file)
      })
    }

    formData.append("data", JSON.stringify(body))

    let url = clinic?.id ? `/patient/update-clinic-history` : "/patient/create-clinic-history"
    let method = clinic?.id ? "put" : "post"

    execute({
      url,
      method,
      body: formData,
      hasFiles: true,
    }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "",
          description: "La historia clínica ha sido guardada correctamente",
        })
        setData(e => ({ ...e, ClinicSaved: res.data }))
        updatePatient()
        setLocalStorage({})
        setActiveSection("medical")
        setSelectedFiles([])
        form.reset(defaultValues)
      }
    })
  }

  const onError = (error: any) => {
    setActiveSection("medical")
    if (error?.issues) {
      const errorMessage = error.issues[0].message
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const setLastMedications = () => {
    if (patient) {
      const { clinic_histories } = patient
      if (clinic_histories && clinic_histories.length > 0) {
        const { medical_recipe } = clinic_histories[0]
        if (medical_recipe) {
          const { medical_recipe_details } = medical_recipe
          if (medical_recipe_details && medical_recipe_details.length > 0) {
            const lastMedications = medical_recipe_details.map((medication: any) => ({
              medicine_description: medication.medicine_description,
              frequency: medication.frequency,
              duration: medication.duration,
            }))
            form.setValue("medications", lastMedications)
            toast({
              title: "",
              description: "Medicamentos de la receta anterior han sido agregados correctamente",
            })
            return
          }
        }
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  function removeFile(index: number) {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const oral = form.watch('oral')
  const nose = form.watch('nose')
  const earing_left = form.watch('earing_left')
  const earing_right = form.watch('earing_right')
  const face = form.watch('face')


  useEffect(() => {
    if (localStorage && Object.keys(localStorage).length > 0 && localStorage.idPatient === idPatient) {
      form.reset({ ...localStorage, })
    }
  }, [])

  useEffect(() => {
    if (medicationsData) {
      setMedications(medicationsData.data)
    }
  }, [medicationsData])

  useEffect(() => {
    const subscription = form.watch((values) => {
      setLocalStorage({
        ...values,
        idPatient,
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, localStorage]);


  const navItems = [
    { id: "medical", label: "Historia clínica", icon: <ClipboardList className="h-5 w-5" /> },
    { id: "medications", label: "Medicamentos", icon: <Pill className="h-5 w-5" /> },
    { id: "documents", label: "Documentos", icon: <FileText className="h-5 w-5" /> },
  ]

  return (
    <div>
      <div className='flex justify-between mb-5'>
        <div>
          <h2 className="text-lg font-semibold">Historia clínica</h2>
          <p className="text-sm text-muted-foreground">Llena los campos requeridos</p>
        </div>
        <div className='flex items-center gap-3'>
          {Data.ClinicSaved && (
            <>
              <Button variant="outline" size="sm" onClick={() => pullRecipe(Data?.ClinicSaved?.id || 0, 1)} disabled={loading}>
                <FileText className="h-4 w-4 mr-1" />
                Ver receta (Media carta)
              </Button>
              <Button size="sm" onClick={() => pullRecipe(Data?.ClinicSaved?.id || 0, 2)} disabled={loading}>
                <FileText className="h-4 w-4 mr-1" />
                Ver receta (Carta)
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        <div className="hidden md:block w-64 shrink-0">
          <Card className="h-[calc(100vh-200px)] sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle>Secciones</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="px-4 pb-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md gap-3",
                        activeSection === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </ScrollArea>
          </Card>
        </div>

        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">

              {activeSection === "medical" && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <ClipboardList className="mr-2 h-5 w-5" />
                      Historia clínica
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='col-span-6 md:col-span-6 space-y-4'>
                      <FormInput
                        label="Motivo de consulta"
                        type='textarea'
                        name="mc"
                        control={form.control}
                      />

                      <FormInput
                        label="Evolución del padecimiento"
                        type='textarea'
                        name="evolution"
                        control={form.control}
                      />

                      <div className='grid grid-cols-12 items-center'>
                        <div className='col-span-12'>
                          <FormSwitch
                            label="Cavidad oral y Laringe"
                            name="oral"
                            control={form.control}
                          />
                        </div>
                        {oral && (
                          <div className='col-span-12'>
                            <FormInput
                              label="Cavidad oral y Laringe"
                              type='textarea'
                              name="oral_description"
                              control={form.control}
                            />
                          </div>
                        )}
                      </div>

                      <div className='grid grid-cols-12 items-center'>
                        <div className='col-span-12'>
                          <FormSwitch
                            label="Nariz y SPN"
                            name="nose"
                            control={form.control}
                          />
                        </div>
                        {nose && (
                          <div className='col-span-12'>
                            <FormInput
                              label="Nariz y SPN"
                              type='textarea'
                              name="nose_description"
                              control={form.control}
                            />
                          </div>
                        )}
                      </div>

                      <div className='grid grid-cols-12 items-center'>
                        <div className='col-span-12'>
                          <FormSwitch
                            label="Oído izquierdo"
                            name="earing_left"
                            control={form.control}
                          />
                        </div>
                        {earing_left && (
                          <div className='col-span-12'>
                            <FormInput
                              label="Oído izquierdo"
                              type='textarea'
                              name="earing_left_description"
                              control={form.control}
                            />
                          </div>
                        )}
                      </div>

                      <div className='grid grid-cols-12 items-center'>
                        <div className='col-span-12'>
                          <FormSwitch
                            label="Oído derecho"
                            name="earing_right"
                            control={form.control}
                          />
                        </div>
                        {earing_right && (
                          <div className='col-span-12'>
                            <FormInput
                              label="Oído derecho"
                              type='textarea'
                              name="earing_right_description"
                              control={form.control}
                            />
                          </div>
                        )}
                      </div>

                      <div className='grid grid-cols-12 items-center'>
                        <div className='col-span-12'>
                          <FormSwitch
                            label="Cara y cuello"
                            name="face"
                            control={form.control}
                          />
                        </div>
                        {face && (
                          <div className='col-span-12'>
                            <FormInput
                              label="Cara y cuello"
                              type='textarea'
                              name="face_description"
                              control={form.control}
                            />
                          </div>
                        )}
                      </div>

                      <FormInput
                        label="Diagnostico"
                        type='textarea'
                        name="idx"
                        control={form.control}
                      />

                      <FormInput
                        label="Observaciones"
                        type='textarea'
                        name="notes"
                        control={form.control}
                      />

                      <div className="flex justify-end">
                        <Button type="button" onClick={() => setActiveSection("medications")}>
                          Continua a medicamentos
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "medications" && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <Pill className="mr-2 h-5 w-5" />
                      Medicamentos (Opcional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-end">
                        {patient && (patient?.clinic_histories?.length || 0) > 0 && (
                          <div className='flex w-full justify-end'>
                            <Button type="button" onClick={setLastMedications}>
                              Agregar medicamentos de la receta anterior
                            </Button>
                          </div>
                        )}
                      </div>



                      {form.watch("medications")?.map((_, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium">Medicamento #{index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentMedications = form.getValues("medications")
                                form.setValue(
                                  "medications",
                                  currentMedications?.filter((_, i) => i !== index),
                                )
                              }}
                            >
                              Quitar medicamento
                            </Button>
                          </div>

                          <FormInputAutoComplete
                            label="Medicamento"
                            placeholder="Escribe el medicamento"
                            name={`medications.${index}.medicine_description`}
                            options={medications}
                            setValue={form.setValue}
                            control={form.control}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <FormInput
                              label="Frecuencia"
                              name={`medications.${index}.frequency`}
                              control={form.control}
                            />

                            <FormInput
                              label="Durante"
                              name={`medications.${index}.duration`}
                              control={form.control}
                            />
                          </div>
                        </Card>
                      ))}

                      {form.formState.errors.medications && (
                        <p className="text-sm font-medium text-destructive">{form.formState.errors.medications.message}</p>
                      )}

                      <div className='flex flex-col'>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentMedications = form.getValues("medications")
                            form.setValue("medications", [
                              ...currentMedications || [],
                              { medicine_description: "", frequency: "", duration: "" },
                            ])
                          }}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Agregar medicamento
                        </Button>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button type="button" onClick={() => setActiveSection("medical")} variant={"outline"}>
                          Regresar a historia clínica
                        </Button>
                        <Button type="button" onClick={() => setActiveSection("documents")}>
                          Continuar a documentos
                        </Button>
                      </div>
                    </div>


                  </CardContent>
                </Card>
              )}

              {activeSection === "documents" && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Documentos (Opcional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-dashed">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-40">
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <h3 className="font-medium mb-1">Carga documentos</h3>
                          <p className="text-sm text-muted-foreground mb-2">Agrega documentos desde tu dispositivo</p>
                          <Button type="button" onClick={() => {
                            setHasFiles(true)
                          }} size="sm">
                            Selecciona un archivo
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-dashed">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-40">
                          <LinkIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                          <h3 className="font-medium mb-1">Agrega una URL</h3>
                          <p className="text-sm text-muted-foreground mb-2">Agrega un link externo a los documentos</p>
                          <Button type="button" onClick={() => {
                            const currentDocuments = form.getValues("documents")
                            form.setValue("documents", [
                              ...currentDocuments || [],
                              { type: "link", link: "", },
                            ])

                          }} size="sm">
                            Agregar una URL
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* {formData.documents.length > 0 && (
                      <div className="space-y-4 mt-6">
                        <h3 className="font-medium">Added Documents</h3>
                        {formData.documents.map((doc, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardHeader className="py-3 px-4 bg-muted/20 flex flex-row items-center justify-between">
                              <CardTitle className="text-base font-medium flex items-center">
                                {doc.type === "file" ? (
                                  <FileText className="mr-2 h-4 w-4" />
                                ) : (
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                )}
                                {doc.type === "file" ? "File Document" : "URL Document"} #{index + 1}
                              </CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(index)}
                                className="h-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove document</span>
                              </Button>
                            </CardHeader>
                            <CardContent className="p-4">
                              {doc.type === "file" ? (
                                <div className="space-y-3">
                                  <Label htmlFor={`document-file-${index}`}>Upload Document</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id={`document-file-${index}`}
                                      type="file"
                                      onChange={(e) => handleFileChange(e, index)}
                                      className="flex-1"
                                    />
                                  </div>
                                  {doc.name && (
                                    <div className="flex items-center p-2 bg-muted/20 rounded text-sm">
                                      <FileText className="h-4 w-4 mr-2" />
                                      {doc.name}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`document-name-${index}`}>Document Name</Label>
                                    <Input
                                      id={`document-name-${index}`}
                                      value={doc.name}
                                      onChange={(e) => updateDocument(index, "name", e.target.value)}
                                      placeholder="e.g., Lab Results"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`document-url-${index}`}>Document URL</Label>
                                    <Input
                                      id={`document-url-${index}`}
                                      value={doc.value}
                                      onChange={(e) => updateDocument(index, "value", e.target.value)}
                                      placeholder="https://example.com/document"
                                    />
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )} */}
                    {hasFiles && (
                      <Card className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium">Documentos</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => {
                              setHasFiles(false)
                              setSelectedFiles([])
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Quitar documento</span>
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="documents">Carga documentos</Label>
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click para cargar documentos</span> o arrastra y suelta
                                  </p>
                                  <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX (MAX. 10MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} />
                              </label>
                            </div>
                          </div>

                          {selectedFiles.length > 0 && (
                            <div className="border rounded-md p-4">
                              <h4 className="text-sm font-medium mb-2">Selecciona los archivos</h4>
                              <ul className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                  <li key={index} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{file.name}</span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                      className="h-8 w-8 p-0 text-red-500"
                                    >
                                      <span className="sr-only">Eliminar</span>
                                      &times;
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}

                    {form.watch("documents")?.map((_, index) => {

                      return (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium">Enlace #{index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              onClick={() => {
                                const currentDocuments = form.getValues("documents")
                                form.setValue(
                                  "documents",
                                  currentDocuments?.filter((_, i) => i !== index),
                                )
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Quitar enlace</span>
                            </Button>
                          </div>


                          <FormInput
                            label="Enlace"
                            name={`documents.${index}.link`}
                            control={form.control}
                          />
                        </Card>
                      )
                    })}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline">
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </Button>
                      <Button type="submit">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Guardar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* <div className="flex">
            <Button type="submit" disabled={loading}>
              Guardar
            </Button>
          </div> */}
            </form>
          </Form>
        </div>
      </div>






    </div>
  )
}
