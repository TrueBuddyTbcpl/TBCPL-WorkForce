// src/components/operations/pre-report/steps/truebuddy-lead/Step1BasicInfo.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TrueBuddyLeadStep1Input } from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep1Schema } from '../../../../../schemas/prereport.schemas';
import {
  ProductCategory,
  InfringementType,
  NatureOfEntity,
  ReasonOfSuspicion,
} from '../../../../../utils/constants';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';



interface Step1Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack?: () => void;
  onSkip: () => void;
}



const TrueBuddyStep1BasicInfo: React.FC<Step1Props> = ({ data, onNext, onBack, onSkip }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep1Input>({
    resolver: zodResolver(trueBuddyLeadStep1Schema),
    defaultValues: {
      dateInternalLeadGeneration: data.dateInternalLeadGeneration || '',
      productCategory: data.productCategory || ProductCategory.CROP_PROTECTION,
      productCategoryCustomText: data.productCategoryCustomText || '',    // ← CHANGED
      infringementType: data.infringementType || InfringementType.COUNTERFEIT,
      infringementTypeCustomText: data.infringementTypeCustomText || '',    // ← CHANGED
      broadGeography: data.broadGeography || '',
      reasonOfSuspicion: Array.isArray(data.reasonOfSuspicion)
        ? data.reasonOfSuspicion
        : data.reasonOfSuspicion
          ? [data.reasonOfSuspicion]
          : [],
      reasonOfSuspicionCustomText: data.reasonOfSuspicionCustomText || '',    // ← CHANGED
      expectedSeizure: data.expectedSeizure || '',
      natureOfEntity: data.natureOfEntity || NatureOfEntity.MANUFACTURER,
      natureOfEntityCustomText: data.natureOfEntityCustomText || '',    // ← CHANGED
    },
  });


  const watchProductCategory = watch('productCategory');
  const watchInfringementType = watch('infringementType');
  const watchReasonOfSuspicion = watch('reasonOfSuspicion');
  const watchNatureOfEntity = watch('natureOfEntity');


  const onSubmit = async (formData: TrueBuddyLeadStep1Input) => {
    try {
      const typedData: Partial<TrueBuddyLeadData> = {
        dateInternalLeadGeneration: formData.dateInternalLeadGeneration,
        productCategory: formData.productCategory,
        productCategoryCustomText: formData.productCategoryCustomText,   // ← CHANGED
        infringementType: formData.infringementType,
        infringementTypeCustomText: formData.infringementTypeCustomText,  // ← CHANGED
        broadGeography: formData.broadGeography,
        reasonOfSuspicion: formData.reasonOfSuspicion ?? [],
        reasonOfSuspicionCustomText: formData.reasonOfSuspicionCustomText, // ← CHANGED
        expectedSeizure: formData.expectedSeizure,
        natureOfEntity: formData.natureOfEntity,
        natureOfEntityCustomText: formData.natureOfEntityCustomText,    // ← CHANGED
      };
      await onNext(typedData);
    } catch (error) {
      console.error('Error submitting Step 1:', error);
    }
  };


  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError ? 'border-red-500' : 'border-gray-300'
    }`;


  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 1: Case Reference
        </h2>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


          {/* ── Date of Internal Lead Generation ─────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Internal Lead Generation
            </label>
            <Controller
              name="dateInternalLeadGeneration"
              control={control}
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  className={inputClass(!!errors.dateInternalLeadGeneration)}
                />
              )}
            />
            {errors.dateInternalLeadGeneration && (
              <p className="mt-1 text-sm text-red-600">{errors.dateInternalLeadGeneration.message}</p>
            )}
          </div>


          {/* ── Product Category ─────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Category
            </label>
            <Controller
              name="productCategory"
              control={control}
              render={({ field }) => (
                <select {...field} className={inputClass(!!errors.productCategory)}>
                  <option value="">Select Product Category</option>
                  {Object.values(ProductCategory).map((category) => (
                    <option key={category} value={category}>
                      {category.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.productCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.productCategory.message}</p>
            )}
            {watchProductCategory === ProductCategory.CUSTOM && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category (Custom)
                </label>
                <Controller
                  name="productCategoryCustomText"                          // ← CHANGED
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"                                           // ← CHANGED
                      {...field}
                      placeholder="Describe custom product category"       // ← CHANGED
                      className={inputClass(!!errors.productCategoryCustomText)}
                    />
                  )}
                />
                {errors.productCategoryCustomText && (
                  <p className="mt-1 text-sm text-red-600">{errors.productCategoryCustomText.message}</p>
                )}
              </div>
            )}
          </div>


          {/* ── Infringement Type ────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Infringement Type
            </label>
            <Controller
              name="infringementType"
              control={control}
              render={({ field }) => (
                <select {...field} className={inputClass(!!errors.infringementType)}>
                  <option value="">Select Infringement Type</option>
                  {Object.values(InfringementType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.infringementType && (
              <p className="mt-1 text-sm text-red-600">{errors.infringementType.message}</p>
            )}
            {watchInfringementType === InfringementType.CUSTOM && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Infringement Type (Custom)
                </label>
                <Controller
                  name="infringementTypeCustomText"                        // ← CHANGED
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"                                           // ← CHANGED
                      {...field}
                      placeholder="Describe custom infringement type"      // ← CHANGED
                      className={inputClass(!!errors.infringementTypeCustomText)}
                    />
                  )}
                />
                {errors.infringementTypeCustomText && (
                  <p className="mt-1 text-sm text-red-600">{errors.infringementTypeCustomText.message}</p>
                )}
              </div>
            )}
          </div>


          {/* ── Broad Geography ──────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Broad Geography
            </label>
            <Controller
              name="broadGeography"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="e.g., Northern India, Maharashtra"
                  className={inputClass(!!errors.broadGeography)}
                />
              )}
            />
            {errors.broadGeography && (
              <p className="mt-1 text-sm text-red-600">{errors.broadGeography.message}</p>
            )}
          </div>


          {/* ── Reason of Suspicion ───────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason of Suspicion
            </label>
            <Controller
              name="reasonOfSuspicion"
              control={control}
              render={({ field }) => {
                const selectedValues = field.value || [];

                return (
                  <div className="space-y-2">
                    {Object.values(ReasonOfSuspicion).map((reason) => (
                      <label key={reason} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedValues.includes(reason)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...selectedValues, reason]);
                            } else {
                              field.onChange(
                                selectedValues.filter((r: any) => r !== reason)
                              );
                            }
                          }}
                        />
                        {reason.replace(/_/g, " ")}
                      </label>
                    ))}
                  </div>
                );
              }}
            />
            {errors.reasonOfSuspicion && (
              <p className="mt-1 text-sm text-red-600">{errors.reasonOfSuspicion.message}</p>
            )}
            {watchReasonOfSuspicion?.includes(ReasonOfSuspicion.CUSTOM) && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason of Suspicion (Custom)
                </label>

                <Controller
                  name="reasonOfSuspicionCustomText"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      placeholder="Describe custom reason of suspicion"
                      className={inputClass(!!errors.reasonOfSuspicionCustomText)}
                    />
                  )}
                />

                {errors.reasonOfSuspicionCustomText && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.reasonOfSuspicionCustomText.message}
                  </p>
                )}
              </div>
            )}
          </div>


          {/* ── Expected Seizure ─────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Seizure
            </label>
            <Controller
              name="expectedSeizure"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="e.g., 500 cartons, 2000 units"
                  className={inputClass(!!errors.expectedSeizure)}
                />
              )}
            />
            {errors.expectedSeizure && (
              <p className="mt-1 text-sm text-red-600">{errors.expectedSeizure.message}</p>
            )}
          </div>


          {/* ── Nature of Entity ─────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nature of Entity
            </label>
            <Controller
              name="natureOfEntity"
              control={control}
              render={({ field }) => (
                <select {...field} className={inputClass(!!errors.natureOfEntity)}>
                  <option value="">Select Nature of Entity</option>
                  {Object.values(NatureOfEntity).map((entity) => (
                    <option key={entity} value={entity}>
                      {entity.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.natureOfEntity && (
              <p className="mt-1 text-sm text-red-600">{errors.natureOfEntity.message}</p>
            )}
            {watchNatureOfEntity === NatureOfEntity.CUSTOM && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nature of Entity (Custom)
                </label>
                <Controller
                  name="natureOfEntityCustomText"                          // ← CHANGED
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"                                           // ← CHANGED
                      {...field}
                      placeholder="Describe custom nature of entity"       // ← CHANGED
                      className={inputClass(!!errors.natureOfEntityCustomText)}
                    />
                  )}
                />
                {errors.natureOfEntityCustomText && (
                  <p className="mt-1 text-sm text-red-600">{errors.natureOfEntityCustomText.message}</p>
                )}
              </div>
            )}
          </div>


          {/* ── Form Actions ─────────────────────────────────────────────── */}
          <div className="flex justify-between pt-6 border-t">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-3 border-2 border-yellow-400 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 transition-colors"
            >
              Skip Step
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'}
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};


export default TrueBuddyStep1BasicInfo;