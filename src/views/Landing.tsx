import { Menu, MembersOf, Banner, Clients, About, OurSpecialist, Maps, Footer } from '@/components/Landing'
import { Shape1 } from '@/assets/images/SVGComponents/Shapes'

export const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Menu />
      <main className="flex-1">
        <Banner />
        <MembersOf />
        <Shape1 pathClassName='fill-current text-slate-100' className=' w-full bg-muted h-auto z-0 overflow-hidden rotate-180 ' />
        <Clients />
        <About />
        <OurSpecialist />
        <Maps />
      </main>
      <Footer />
    </div>
  )
}
