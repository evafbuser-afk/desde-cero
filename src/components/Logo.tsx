export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }
  return (
    <div className={`font-bold tracking-tight ${sizes[size]}`}>
      <span className="text-lime-500">desde</span>
      <span className="text-teal-700"> cero</span>
    </div>
  )
}
