import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

interface LazySectionProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  [key: string]: any
}

const LazySection = ({ component, fallback, ...props }: LazySectionProps) => {
  const DynamicComponent = dynamic(component, {
    loading: () => fallback || <div className="section-spacing animate-pulse bg-muted/20 rounded-lg" />,
    ssr: true // Keep SSR for SEO
  })

  return <DynamicComponent {...props} />
}

export default LazySection