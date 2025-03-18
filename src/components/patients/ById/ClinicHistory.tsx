import { FormClinicHistory } from './FormClinicHistory'
import { PatientClinicType } from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AiOutlineFilePdf } from "react-icons/ai";
import { Button } from "@/components/ui/button"
import { usePost } from '@/hooks';



interface ClinicHistoryProps {
  clinic?: PatientClinicType[] | null
  idPatient: number
  updatePatient: () => void
}

export const ClinicHistory = ({ clinic, idPatient, updatePatient }: ClinicHistoryProps) => {
  const { execute, loading } = usePost()
  const formateDate = (format?: string) => {
    if (!format) return 'Sin fecha'

    const date = new Date(format)
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0"); // Meses empiezan desde 0
    const yyyy = date.getUTCFullYear();
    const hh = String(date.getUTCHours()).padStart(2, "0");
    const min = String(date.getUTCMinutes()).padStart(2, "0");

    return `${dd}/${mm}/${yyyy} ${hh}:${min}`
  }

  const pullRecipe = (id: number) => {
    execute({
      url: `/patient/pdf`,
      body: {
        id_clinic: id,
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

  const print = () => {
    return clinic?.map((c, i) => {
      return (
        <AccordionItem value={`item-${i}`} key={i}>
          <AccordionTrigger>
            <div className="flex flex-col gap-1 ">
              <span className="text-lg font-bold">Historia clínica</span>
              <span className="text-sm text-gray-400">Ver más</span>
              <span>{formateDate(c?.updatedAt)}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <article className='flex flex-col border border-gray-400 rounded-md'>
              <div className='flex w-full'>
                <Button onClick={() => {
                  // window.open(`${API_URL}/patient/pdf/${idPatient}?id_clinic=${c.id}`, '_blank')
                  pullRecipe(c.id)
                }} className='w-full' disabled={loading}>
                  <AiOutlineFilePdf className='text-2xl' />
                  <span>Generar receta medica</span>
                </Button>
              </div>

              {c.mc && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3'>Motivo de consulta</p>
                  <p className='p-2'>{c.mc}</p>
                </div>
              )}
              {c.evolution && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3'>Evolución del padecimiento</p>
                  <p className='p-2'>{c.evolution}</p>
                </div>
              )}
              {c.oral_description && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3 '>Cavidad oral y Laringe</p>
                  <p className='p-2'>{c.oral_description}</p>
                </div>
              )}
              {c.nose_description && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3'>Nariz y SPN</p>
                  <p className='p-2'>{c.nose_description}</p>
                </div>
              )}
              {c.earing_left_description && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3'>Oído izquierdo</p>
                  <p className='p-2'>{c.earing_left_description}</p>
                </div>
              )}
              {c.earing_right_description && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3'>Oído derecho</p>
                  <p className='p-2'>{c.earing_right_description}</p>
                </div>
              )}
              {c.face_description && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3'>Cara y cuello</p>
                  <p className='p-2'>{c.face_description}</p>
                </div>
              )}
              {c.idx && (
                <div className='border-b border-gray-400'>
                  <p className='font-bold bg-gray-200 p-3'>Diagnostico</p>
                  <p className='p-2'>{c.idx}</p>
                </div>
              )}
            </article>
          </AccordionContent>
        </AccordionItem>
      )
    })
  }


  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
      <FormClinicHistory idPatient={idPatient} updatePatient={updatePatient} />


      <div className='flex flex-col gap-3'>
        <div>
          <h2 className='font-bold'>Historias clínicas</h2>
        </div>

        <Accordion type="single" collapsible defaultValue='item-0'>
          {print()}

        </Accordion>
      </div>

    </div>
  )
}
