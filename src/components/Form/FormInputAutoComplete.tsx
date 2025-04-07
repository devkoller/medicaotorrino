import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


type FormInputProps = {
  control: any
  label?: string
  name: string
  description?: string
  placeholder?: string
  password?: boolean
  required?: boolean
  disabled?: boolean
  options: any[]
  setValue: (name: any, value: any) => void

}

export const FormInputAutoComplete = ({ control, label, name, placeholder, description, options, required, setValue, }: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && <>
            <FormLabel>{label}</FormLabel>{' '}
            {required && <sup className="text-red-500">*</sup>}
          </>}
          <div className="relative w-full">

            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                value={
                  field.value
                    ? options.find((m) => m.value === field.value)?.label || field.value
                    : ""
                }
                onChange={(e) => {
                  const inputValue = e.target.value
                  // If exact match found, set the value to the medication value
                  const exactMatch = options.find(
                    (m) => m.label.toLowerCase() === inputValue.toLowerCase(),
                  )
                  if (exactMatch) {
                    setValue(name, exactMatch.value)
                  } else {
                    // Otherwise just store the text input
                    setValue(name, inputValue)
                  }
                }}
                onFocus={(e) => {
                  e.target.setAttribute("list", `options-${name}`)
                }}
              />
            </FormControl>
            <datalist id={`options-${name}`} className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {options.map((opt) => (
                <option key={opt.value} value={opt.label} />
              ))}
            </datalist>
          </div>
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
