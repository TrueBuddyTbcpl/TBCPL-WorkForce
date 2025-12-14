import { X } from 'lucide-react';

interface Props {
  section: string | null;
  onClose: () => void;
}

const EditProfileModal = ({ section, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit {section}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="text-center py-12">
            <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg p-8">
              <p className="text-gray-700 mb-4">
                To edit <span className="font-semibold text-blue-600">{section}</span> section, click the "Edit Full Profile" button.
              </p>
              <p className="text-sm text-gray-600">
                This will take you back to the form where you can make changes to any section.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
