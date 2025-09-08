export default function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium">{label}:</span> <span>{value}</span>
    </div>
  );
}
