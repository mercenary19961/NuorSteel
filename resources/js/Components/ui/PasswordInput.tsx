import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  leftIcon?: ReactNode;
}

export default function PasswordInput({ leftIcon, className, ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {leftIcon}
      <input {...rest} type={visible ? 'text' : 'password'} className={className} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
