interface InfoItem {
  label: string;
  value: string;
}

interface Props {
  items: InfoItem[];
}

const InfoSection = ({ items }: Props) => {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-600 w-1/3">{item.label}:</span>
          <span className="text-sm text-gray-900 w-2/3 text-right font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default InfoSection;
