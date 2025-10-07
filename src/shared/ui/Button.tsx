import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'social';
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-mednova-green text-white hover:bg-green-600',
    secondary: 'bg-transparent border border-mednova-green text-mednova-green hover:bg-green-50',
    social: 'bg-blue-500 text-white hover:bg-blue-600', 
  };

  return (
    <button className={`px-4 py-2 rounded font-semibold transition-colors w-full ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}