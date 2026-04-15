import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { RelatedFIRsCases } from '../types/profile.types';
import DropdownWithOther from '../../../../components/ui/DropdownWithOther';

interface Props {
  data?: RelatedFIRsCases;
  onNext: (data: RelatedFIRsCases) => void;
  onBack?: () => void;
}

const RelatedFIRsCasesStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit } = useForm<RelatedFIRsCases>({
    defaultValues: data || {
      firs: [{ firNumber: '', caseNumber: '', sections: [], dateRegistered: '', status: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'firs' });

  const onSubmit = (formData: RelatedFIRsCases) => {
    const processedData = {
      ...formData,
      firs: formData.firs?.map(fir => ({
        ...fir,
        sections: typeof fir.sections === 'string'
          ? (fir.sections as string).split(',').map(s => s.trim()).filter(Boolean)
          : fir.sections,
      })),
    };
    onNext(processedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Related FIRs & Cases</h3>
          <button
            type="button"
            onClick={() => append({ firNumber: '', caseNumber: '', sections: [], dateRegistered: '', status: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add FIR
          </button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <h4 className="text-md font-medium text-gray-800 mb-3">FIR #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FIR Number</label>
                  <input type="text" {...register(`firs.${index}.firNumber`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter FIR number" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
                  <input type="text" {...register(`firs.${index}.caseNumber`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter case number" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sections (comma separated)</label>
                  <input type="text" {...register(`firs.${index}.sections`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 420, 467, 468" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Registered</label>
                  <input type="date" {...register(`firs.${index}.dateRegistered`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* ── CHANGED: DropdownWithOther replaces static <select> ── */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Controller
                    name={`firs.${index}.status`}
                    control={control}
                    render={({ field }) => (
                      <DropdownWithOther
                        fieldName="firStatus"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Status"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        {onBack && <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Back</button>}
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto">Next Step</button>
      </div>
    </form>
  );
};

export default RelatedFIRsCasesStep;