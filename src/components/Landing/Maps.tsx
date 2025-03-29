
import logo from '@/assets/images/otorrino/LogoOtorrino-blanco.avif'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export const Maps = () => {
  return (
    <section className="bg-medica py-10" id="contact">
      <div className="w-10/12 mx-auto grid  md:grid-cols-2 gap-5 text-white">
        <div className='flex flex-col gap-5'>
          <img src={logo} alt="" />
          <p>Centro de Especialidades Country 2000</p>
          <p>
            Av. Jorge Alvarez del Castillo No. 1558 casi esquina con Calle Mar de Marmara, Col. Lomas del Country.
            CP 44620 Guadalajara, Jalisco. México.
          </p>
          <Separator />
          <div>
            <p>
              Teléfonos: <a href="tel:3347052681">
                +52 33 4705 2681
              </a>
            </p>
            <p>
              Citas por WhatsApp: <a href="https://wa.me/523325400235" target='_blank' rel='noreferrer'>
                33 2540 0235
              </a>
            </p>
          </div>
          <div>
            <p>Horario de atención telefónica por las recepcionistas:</p>
            <p>Lunes a viernes de 10 a 14 y de 16 a 20 hrs</p>
            <p>Sábado de 10 a 14 hrs.</p>
          </div>

          <a href="https://wa.me/523325400235" target='_blank' rel='noreferrer'>
            <Button className='border-white bg-transparent w-full' variant='outline'>
              Agendar cita por WhatsApp
            </Button>
          </a>
        </div>

        <div className='flex'>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.156965907131!2d-103.36719252390415!3d20.703849680865375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae2eb56c3355%3A0x60f177b6416ccb59!2sAv.%20Cvln.%20Jorge%20%C3%81lvarez%20del%20Castillo%201558%2C%20Lomas%20del%20Country%2C%2044620%20Guadalajara%2C%20Jal.!5e0!3m2!1sen!2smx!4v1740858641153!5m2!1sen!2smx"
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            className='w-full'
          ></iframe>
        </div>

      </div>
    </section>
  )
}
