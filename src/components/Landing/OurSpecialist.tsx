import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import raul from '@/assets/images/otorrino/raul.avif'
import magdicarla from '@/assets/images/otorrino/magdicarla.avif'

const specialists = [
  {
    name: "Dr. Raúl Durán López",
    title: "Otorrinolaringología, laringología, alergia, rinología y cirugía plástica facial.",
    description: `Especialidad en Otorrinolaringología realizada en el Hospital Civil de Guadalajara, Universidad de Guadalajara, con la Cédula de Especialista 3624699; cédula de especialidad PEJ 278120.
Certificación y recertificación por el Consejo Mexicano de Otorrinolaringología y Cirugía de Cabeza y Cuello, con el registro DUL-1807/05.`,
    img: raul,
  },
  {
    name: "Dra. Magdicarla De Alba",
    title: "Otorrinolaringología, otología, neuro-otología, cirugía estética y funcional de nariz, alergia.",
    description: "Especialidad en Otorrinolaringología, realizada en el Hospital Civil de Guadalajara “Fray Antonio Alcalde”; Universidad de Guadalajara. Cédula de especialista 3245985. Cédula de especialidad PEJ 278186.",
    img: magdicarla,
  },
]


export const OurSpecialist = () => {

  const printSpecialist = () => {
    return specialists.map((specialist, index) => {
      return (
        <Card className="overflow-hidden" key={index}>
          <CardHeader className="p-0">
            <img
              src={specialist.img}
              width={300}
              height={300}
              alt={specialist.name}
              className="aspect-square object-cover object-top w-full"
            />
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle>
              {specialist.name}
            </CardTitle>
            <CardDescription>
              {specialist.title}
            </CardDescription>
            <p className="mt-2 text-sm text-justify">
              {specialist.description}
            </p>
          </CardContent>
        </Card>
      )
    })
  }
  return (
    <section id="doctors" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Nuestros especialistas
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conoce nuestro equipo de otorrinolaringólogos certificados por la junta dedicados a su atención.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl justify-center gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
          {printSpecialist()}
        </div>
      </div>
    </section>
  )
}
