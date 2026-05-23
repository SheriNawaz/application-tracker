import { useState } from "react"

type Props = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  name?: string
}

const EyeOpen = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeClosed = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const PasswordInput = ({ value, onChange, placeholder = "••••••••", required, name }: Props) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 pr-11 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors duration-200"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeClosed /> : <EyeOpen />}
      </button>
    </div>
  )
}

export default PasswordInput
