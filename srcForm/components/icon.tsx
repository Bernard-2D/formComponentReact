import { LucideProps, icons } from 'lucide-react'
import React from 'react'

function Icon({ name, color, size, ...prop }: LucideProps) {
  const LucideIcon = icons[name as keyof typeof icons] || React.Fragment
  return <LucideIcon color={color} size={size} {...prop} />
}

export default Icon
