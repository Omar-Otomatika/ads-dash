import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-[10px] font-bold tracking-wider text-foreground uppercase">
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={`flex h-11 w-full rounded-md border border-muted bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"
