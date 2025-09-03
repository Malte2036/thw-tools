type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="bg-gray-50 p-4 rounded-lg">{children}</div>
    </div>
  );
}
