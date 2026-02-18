type Props = {
  count: number
}

export default function ReviewCount({ count }: Props) {
  return (
    <p className="text-sm text-gray-500">
      {count} reviews
    </p>
  )
}
