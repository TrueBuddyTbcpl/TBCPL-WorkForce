import { Plus, Trash2 } from 'lucide-react';

interface Parameter {
  name: string;
  value: string;
}

interface ParameterTableProps {
  parameters: Parameter[];
  onChange: (parameters: Parameter[]) => void;
}

export function ParameterTable({ parameters, onChange }: ParameterTableProps) {
  const addParameter = () => {
    onChange([...parameters, { name: '', value: '' }]);
  };

  const updateParameter = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...parameters];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeParameter = (index: number) => {
    onChange(parameters.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Parameters
        </label>
        <button
          type="button"
          onClick={addParameter}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Parameter
        </button>
      </div>

      <div className="space-y-3">
        {parameters.map((param, index) => (
          <div key={index} className="flex gap-3 items-start">
            <input
              type="text"
              value={param.name}
              onChange={(e) => updateParameter(index, 'name', e.target.value)}
              placeholder="Parameter Name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={param.value}
              onChange={(e) => updateParameter(index, 'value', e.target.value)}
              placeholder="Value"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => removeParameter(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {parameters.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No parameters added yet. Click "Add Parameter" to start.
          </p>
        )}
      </div>
    </div>
  );
}
