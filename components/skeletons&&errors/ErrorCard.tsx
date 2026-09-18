type ErrorCardProps = {
  title: string;
  message: string;
};

export default function ErrorCard({ title, message }: ErrorCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg md:p-10">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-8 text-sm text-red-600">{message}</p>
    </div>
  );
}
