export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-ink" />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}
