import { useEffect, useState } from 'react'
import { Layout } from '@/components/auth'
import { DataTable } from '@/components/utils'
import { getColumns, FormUser, FormPermissions } from '@/components/Users'
import { UserType } from '@/types'
import { useFetch, usePost } from '@/hooks'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { FaSpinner } from 'react-icons/fa'



type StateTypeof = {
  users: UserType[]
  selectedUser: UserType | null
  SheetTitle: string
  SheetType: number
}

export const Users = () => {
  const { execute } = usePost()
  const [open, setOpen] = useState(false)
  const [Data, setData] = useState<StateTypeof>({
    users: [],
    selectedUser: null,
    SheetTitle: '',
    SheetType: 1
  })

  const { response: usersData, loading } = useFetch({
    url: "/user/list-users",
  })



  const handleEdit = (user: UserType) => {
    setOpen(prev => !prev)
    setData(prev => ({
      ...prev,
      selectedUser: user,
      SheetTitle: 'Editar Usuario',
      SheetType: 1
    }))
  }

  const handleNewUser = () => {
    setOpen(prev => !prev)
    setData(prev => ({
      ...prev,
      selectedUser: null,
      SheetTitle: 'Nuevo Usuario',
      SheetType: 1
    }))
  }
  const handleNewPermission = () => {
    setOpen(prev => !prev)
    setData(prev => ({
      ...prev,
      selectedUser: null,
      SheetTitle: 'Nuevo permiso',
      SheetType: 3
    }))
  }

  const handleGrants = (user: UserType) => {
    setOpen(prev => !prev)
    setData(prev => ({
      ...prev,
      selectedUser: user,
      SheetTitle: 'Permisos del usuario',
      SheetType: 2
    }))
  }

  const handleSheet = () => {
    setOpen(prev => !prev)
  }

  const update = () => {
    execute({
      url: "/user/list-users",
      method: "get",
    }).then((res) => {
      if (res.status === 200) {
        let data = res.data.map((user: UserType) => {
          return {
            ...user,
            nombre: `${user.name} ${user.lastname1}`,
          }
        })
        setData(e => ({ ...e, users: data, }))
      }
    })
  }

  const columns = getColumns(handleEdit, handleGrants)

  useEffect(() => {
    if (usersData) {
      let data = usersData.data.map((user: UserType) => {
        return {
          ...user,
          nombre: `${user.name} ${user.lastname1}`,
        }
      })
      setData(e => ({ ...e, users: data, }))
    }
  }, [usersData])

  return (
    <Layout>
      <PageHeader>
        <PageHeaderHeading>Usuarios</PageHeaderHeading>
        <PageHeaderDescription>
          Aquí puedes ver, crear y editar los usuarios del sistema
        </PageHeaderDescription>
        <PageActions>
          <Button size="sm" onClick={handleNewUser}>
            Nuevo usuario
          </Button>
          <Button size="sm" onClick={handleNewPermission}>
            Nuevo permiso
          </Button>
        </PageActions>
      </PageHeader>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin h-8 w-8" />
        </div>
      )}
      {!loading &&
        <DataTable
          data={Data.users}
          columns={columns}
        />
      }
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {Data.SheetTitle}
            </SheetTitle>
            <SheetDescription>
            </SheetDescription>
          </SheetHeader>
          {Data.SheetType === 1 && (
            <FormUser selectedUser={Data.selectedUser} update={update} closeSheet={handleSheet} />
          )}
          {/* {Data.SheetType === 2 && (
          )} */}
          {Data.SheetType === 3 && (
            <FormPermissions closeSheet={handleSheet} />
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  )
}

