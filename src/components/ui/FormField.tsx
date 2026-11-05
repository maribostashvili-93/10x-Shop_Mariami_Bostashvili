import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

/** Wraps any input passed as `children` with a visible label and an accessible error message. */
function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-900">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-amber-800">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
