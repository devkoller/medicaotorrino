import { Layout } from '@/components/auth'

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Camera, Loader2, Mail, Lock, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/hooks"
import { Textarea } from '@/components/ui/textarea'
import { usePost, useFetch } from "@/hooks"
import Cropper, { ReactCropperElement } from 'react-cropper';
import { API_URL } from '@/api/config'


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


// Personal information form schema
const personalInfoSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es obligatorio.",
  }),
  lastname1: z.string().min(1, {
    message: "El primer apellido es obligatorio.",
  }),
  lastname2: z.string().min(1, {
    message: "El segundo apellido es obligatorio.",
  }),
  speciality: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email({
    message: "El correo electrónico no es válido.",
  }),
})

// Password change form schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "La contraseña actual es obligatoria.",
    }),
    newPassword: z.string().min(8, {
      message: "La nueva contraseña debe tener al menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "La confirmación de la contraseña es obligatoria.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })


export const UserProfile = () => {
  const { id, name, lastname1, lastname2, email, } = useAuthStore()
  const { execute, loading } = usePost()
  const [activeTab, setActiveTab] = useState("personal")
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [image, setImage] = useState<string>('');
  const cropperRef = useRef<ReactCropperElement>(null);
  const [profileImage, setProfileImage] = useState(`${API_URL}/user/get-profile-image/${id}`)

  const { response: userData, loading: getUserLoading } = useFetch({
    url: `/user/get-user/` + id,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Personal information form
  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: name || "",
      lastname1: lastname1 || "",
      lastname2: lastname2 || "",
      speciality: "",
      description: "",
      email: email || "",
    },
  })

  // Password change form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Handle personal information update
  function onPersonalSubmit(values: z.infer<typeof personalInfoSchema>) {
    setIsUpdatingPersonal(loading)

    execute({
      url: `/user/update-user`,
      method: "patch",
      body: {
        ...values,
        id,
      },
    }).then((res) => {
      setIsUpdatingPersonal(loading)
      if (res.status === 200) {
        toast({
          title: "Información actualizada",
          description: "Tu información personal ha sido actualizada correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar la información. Intenta nuevamente.",
          variant: "destructive",
        })
      }
    })
  }

  // Handle password change
  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsUpdatingPassword(loading)

    execute({
      url: `/user/change-password`,
      method: "patch",
      body: {
        password: values.newPassword,
        id,
      },
    }).then((res) => {
      setIsUpdatingPersonal(loading)
      if (res.status === 200) {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido actualizada correctamente.",
        })
        passwordForm.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar la contraseña. Intenta nuevamente.",
          variant: "destructive",
        })
      }
    })

  }

  // Handle profile image click
  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  // Handle profile image change
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setOpenDialog(true)

    // setIsUploadingImage(true)

    // // Simulate image upload
    // const reader = new FileReader()
    // reader.onload = (e) => {
    //   // Simulate API call delay
    //   setTimeout(() => {
    //     setProfileImage(e.target?.result as string)
    //     setIsUploadingImage(false)
    //     toast({
    //       title: "Profile image updated",
    //       description: "Your profile image has been updated successfully.",
    //     })
    //   }, 1500)
    // }
    // reader.readAsDataURL(file)
  }

  // Realizar el recorte, convertir a WebP y enviar al servidor
  const handleCrop = () => {
    setIsUploadingImage(loading)
    if (cropperRef.current) {
      const cropper = (cropperRef.current as any).cropper;
      const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
      });
      canvas.toBlob((blob: any) => {
        if (blob) {
          const formData = new FormData();
          formData.append('profile_image', blob, 'profile.webp');
          formData.append('id', id || '');

          execute({
            url: `/user/upload-profile-image`,
            method: "patch",
            body: formData,
            hasFiles: true,
          }).then((res) => {
            setIsUploadingImage(loading)
            if (res.status === 200) {
              toast({
                title: "Imagen guardada actualizada",
                description: "Tu foto personal ha sido actualizada correctamente.",
              })
              setOpenDialog(false)
              setProfileImage(URL.createObjectURL(blob))
              setImage('')

            } else {
              toast({
                title: "Error",
                description: "No se pudo actualizar la foto. Intenta nuevamente.",
                variant: "destructive",
              })
            }
          })

          // Realiza la petición al servidor (ajusta la URL y método según tu backend)
          // fetch('/ruta/al/servidor', {
          //   method: 'POST',
          //   body: formData,
          // })
          //   .then((res) => res.json())
          //   .then((data) => {
          //     console.log('Imagen subida exitosamente:', data);
          //   })
          //   .catch((err) => {
          //     console.error('Error al subir la imagen:', err);
          //   });
        }
      }, 'image/webp');
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  useEffect(() => {
    if (userData) {
      const { name, lastname1, lastname2, email, speciality, description } = userData.data
      personalForm.setValue("name", name)
      personalForm.setValue("lastname1", lastname1)
      personalForm.setValue("lastname2", lastname2)
      personalForm.setValue("email", email)
      personalForm.setValue("speciality", speciality)
      personalForm.setValue("description", description)
    }
  }, [userData])


  if (getUserLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent>
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Perfil</CardTitle>
            <CardDescription>Administra la información de tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div>
                    <Avatar className="h-32 w-32 cursor-pointer" onClick={handleProfileImageClick}>
                      <AvatarImage src={profileImage} alt={name || ''} />
                      <AvatarFallback className="text-3xl">{getInitials(name || '')}</AvatarFallback>
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}
                    </Avatar>
                    <div className="absolute bottom-0 cursor-pointer right-0 bg-primary text-primary-foreground p-1 rounded-full" onClick={handleProfileImageClick}>
                      <Camera className="h-5 w-5" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium">{`${name} ${lastname1} ${lastname2}`}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              {/* Profile Forms Section */}
              <div className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Información personal</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                  </TabsList>

                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-6 pt-4">
                    <Form {...personalForm}>
                      <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
                        <FormField
                          control={personalForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombres</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input className="pl-9" placeholder="Tus nombres" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="lastname1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primer apellido</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input className="pl-9" placeholder="Primer apellido" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="lastname2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Segundo apellido</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input className="pl-9" placeholder="Segundo apellido" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="speciality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Especialidad</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input className="pl-9" placeholder="Especialidad" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Textarea className="pl-9" placeholder="Descripción" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Correo</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="Correo" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isUpdatingPersonal}>
                            {isUpdatingPersonal ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar cambios
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* Security Tab */}
                  <TabsContent value="security" className="space-y-6 pt-4">
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña actual</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-9"
                                    type="password"
                                    placeholder="Ingresa tu contraseña actual"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator className="my-4" />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nueva contraseña</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" type="password" placeholder="Nueva contraseña" {...field} />
                                </div>
                              </FormControl>
                              <FormDescription>
                                La contraseña debe tener al menos 8 caracteres.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirma tu nueva contraseña</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-9"
                                    type="password"
                                    placeholder="Confirma tu nueva contraseña"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isUpdatingPassword}>
                            {isUpdatingPassword ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Actualizando...
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Cambiar contraseña
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Foto de perfil
            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>

          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            ref={cropperRef}
          />

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="mr-2">
              Cancelar
            </Button>
            <Button onClick={handleCrop}>
              Guardar y subir
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </Layout>
  );
};

