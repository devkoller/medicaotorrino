
import placeholder from "@/assets/images/placeholder.svg"


//traduce la lista al español
const list = [
  "Otorrinolaringólogos certificados por la junta",
  "Equipo de diagnóstico de última generación",
  "Planes de tratamiento personalizados",
  "Opciones quirúrgicas mínimamente invasivas",
  "Compasión y atención centrada en el paciente",
]

export const About = () => {
  const printList = () => {
    return list.map((item, index) => {
      return (
        <li className="flex items-center gap-2" key={index}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-primary"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>{item}</span>
        </li>
      )
    })
  }
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <img
            src={placeholder}
            width={600}
            height={400}
            alt="Modern ENT Clinic"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Acerca de Medicaotorrino
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Con más de 20 años de experiencia, nuestra práctica de otorrinolaringología está dedicada a
                proporcionar la más alta calidad de atención para las condiciones de oído, nariz y garganta.
              </p>
            </div>
            <ul className="grid gap-2">
              {printList()}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
