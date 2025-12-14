import { Edit2 } from 'lucide-react';
import type { ReactNode } from 'react';


interface Props {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}

const ProfileCard = ({ title, children, onEdit }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium transition-colors print:hidden"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default ProfileCard;
