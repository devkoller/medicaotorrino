import { useState, useEffect } from 'react'
import { useFetch } from "@/hooks"
import { ServiceType } from "@/types"
import { Icon } from "@/components/ui/icon"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"


export const Clients = () => {
  const [ServiceData, setServiceData] = useState<ServiceType[]>([])

  const { response: data } = useFetch({
    url: "/service/get-all",
    qs: {
      public: 1
    }
  })

  const printServices = () => {
    return ServiceData.map((service, index) => {
      return (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center gap-4">
            {/* <service.icon  /> */}
            <Icon iconName={service.icon || ''} className="h-6 w-6 text-primary" />
            <div className="grid gap-1" >
              <CardTitle>
                {service.name}
              </CardTitle>
              <CardDescription>
                {service.suffering}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {service.description}
            </p>
          </CardContent>
        </Card>
      )
    })
  }



  useEffect(() => {
    if (data) {
      setServiceData(data.data)
    }
  }, [data])


  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Especialidades
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Servicios
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nosotros ofrecemos una amplia gama de opciones de diagnóstico y tratamiento para afecciones de oído, nariz y garganta.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {printServices()}
        </div>
      </div>
    </section>
  )
}
