import { Shape1 } from '@/assets/images/SVGComponents/Shapes'
import { Button } from '@/components/ui/button'
import { ChevronRight } from "lucide-react"
import both from '@/assets/images/otorrino/both.avif'




export const Banner = () => {
  return <section>{<_SingleBanner />}</section>
}

const _SingleBanner = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative xl:py-48">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Tu consultorio de otorrinolaringología en Guadalajara
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Somos especialistas en el diagnóstico, tratamiento y prevención de enfermedades que afectan la garganta, la nariz y los oídos. Con un enfoque integral y personalizado, ofrecemos soluciones médicas y quirúrgicas para mejorar tu salud auditiva, respiratoria y vocal. Confía en nuestra experiencia para brindarte el mejor cuidado otorrinolaringológico.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <a href="https://wa.me/523325400235" target='_blank' rel='noreferrer'>
                  Agendar una cita
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#services">
                  Nuestros servicios
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <img
            src={both}
            width={550}
            height={550}
            alt="ENT Doctor with Patient"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-left sm:w-full lg:aspect-square"
          />
        </div>
      </div>

      <Shape1 className='absolute bottom-0 left-0 w-full z-10' pathClassName='fill-current text-slate-100' />
    </section>
  )
}
