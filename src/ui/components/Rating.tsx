type Props = {
  value: number
}

export default function Rating({ value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>
            {i < Math.round(value) ? '★' : '☆'}
          </span>
        ))}
      </div>

      <span className="text-sm font-medium">
        {value.toFixed(1)}
      </span>
    </div>
  )
}
