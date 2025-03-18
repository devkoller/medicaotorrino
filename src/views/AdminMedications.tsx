
import { useEffect, useState } from 'react'
import { Layout } from '@/components/auth'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { useFetch, usePost } from '@/hooks'
import { MedicationsType } from '@/types'
import { DataTable } from '@/components/utils'
import { getColumns, FormMedications } from '@/components/medications'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


interface StateTypeof {
  medications: MedicationsType[]
  selectedMedicamento: MedicationsType | null
}


export const AdminMedications = () => {
  const { execute } = usePost()
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [Data, setData] = useState<StateTypeof>({
    medications: [],
    selectedMedicamento: null,
  })

  const { response: medicationsData, loading } = useFetch({
    url: "/medications/list",
  })

  const handleNewMedicamento = () => {
    setOpen(prev => !prev)
    setData(prev => ({
      ...prev,
      selectedMedicamento: null,
    }))
  }

  const update = () => {
    execute({
      url: "/medications/list",
      method: "get",
    }).then(res => {
      if (res.status === 200) {
        setData(prev => ({
          ...prev,
          medications: res.data,
        }))
      }
    })
  }

  const handleEdit = (medicamento: MedicationsType) => {
    setOpen(prev => !prev)
    setData(prev => ({
      ...prev,
      selectedMedicamento: medicamento,
    }))
  }

  const handleDelete = (medicamento: MedicationsType) => {
    setOpenDialog(prev => !prev)
    setData(prev => ({
      ...prev,
      selectedMedicamento: medicamento,
    }))
  }

  const deleteMedicamento = () => {
    execute({
      url: `/medications/delete`,
      method: 'delete',
      body: {
        id: Data.selectedMedicamento?.id
      }
    }).then(res => {
      if (res.status === 200) {
        update()
        setOpenDialog(prev => !prev)
        setData(prev => ({
          ...prev,
          selectedMedicamento: null
        }))
      }
    })

  }

  const columns = getColumns(handleEdit, handleDelete)

  useEffect(() => {
    if (medicationsData) {
      setData(prev => ({
        ...prev,
        medications: medicationsData.data
      }))
    }
  }, [medicationsData])



  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <PageHeader>
        <PageHeaderHeading>Medicamentos</PageHeaderHeading>
        <PageHeaderDescription>
          Aquí puedes ver, crear y editar la lista de medicamentos disponibles para utilizar en las recetas medicas
        </PageHeaderDescription>
        <PageActions>
          <Button size="sm" onClick={handleNewMedicamento}>
            Nuevo medicamento
          </Button>
        </PageActions>
      </PageHeader>

      <DataTable
        data={Data.medications}
        columns={columns}
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              Formulario de medicamento
            </SheetTitle>
            <SheetDescription>
            </SheetDescription>
          </SheetHeader>
          <FormMedications selectedMedicamento={Data.selectedMedicamento} update={update} closeSheet={handleNewMedicamento} />
        </SheetContent>
      </Sheet>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estas seguro de eliminar el medicamento?</DialogTitle>
            <DialogDescription>
              No podrás revertir esto después de eliminarlo
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-center gap-3'>
            <Button variant='outline' onClick={() => {
              setOpenDialog(prev => !prev)
              setData(prev => ({
                ...prev,
                selectedMedicamento: null
              }))
            }}>Cancelar</Button>
            <Button onClick={() => {
              deleteMedicamento()
            }}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>


    </Layout>
  )
}
