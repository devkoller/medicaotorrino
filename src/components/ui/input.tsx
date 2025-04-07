import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [Type, setType] = useState(type)

    return (
      <div className="flex w-full items-center space-x-2">
        <input
          type={Type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <Button type='button' variant='outline' onClick={() => setType(prev => prev === 'password' ? 'input' : 'password')}>{Type === 'password' ? <FaRegEye /> : <FaRegEyeSlash />}</Button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
