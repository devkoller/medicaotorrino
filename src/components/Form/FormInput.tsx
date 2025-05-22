import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


type FormInputProps = {
  control: any
  label?: string
  name: string
  description?: string
  placeholder?: string
  password?: boolean
  required?: boolean
  disabled?: boolean
  type?: string

}

export const FormInput = ({ control, label, name, description, type, placeholder, required, ...props }: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full space-y-4">
          {label && <>
            <FormLabel>{label}</FormLabel>{' '}
            {required && <sup className="text-red-500">*</sup>}
          </>}
          <FormControl>
            {type === 'textarea' ? (
              <Textarea placeholder={placeholder || ''} {...field} {...props} />
            ) : (
              <Input placeholder={placeholder || ''} {...field} type={type} {...props} />
            )}
          </FormControl>
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
