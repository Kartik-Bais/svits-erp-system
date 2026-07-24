import './Skeleton.css'

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '' }) {
  return (
    <div 
      className={`skeleton-shimmer ${className}`} 
      style={{ width, height, borderRadius }}
    />
  )
}
