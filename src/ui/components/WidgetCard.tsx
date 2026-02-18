type Props = {
  children: any
}

export default function WidgetCard({ children }: Props) {
  return (
    <div id="base-layout" className="flex flex-1 min-h-60 w-full p-6 bg-green-50">
      {children}
    </div>
  )
}
