// src/components/operations/pre-report/steps/truebuddy-lead/Step1BasicInfo.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep1Input,
} from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep1Schema } from '../../../../../schemas/prereport.schemas';

import {
  ProductCategory,
  InfringementType,
  NatureOfEntity,
} from '../../../../../utils/constants';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';

interface Step1Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack?: () => void;
  onSkip: () => void;
}

const TrueBuddyStep1BasicInfo: React.FC<Step1Props> = ({ data, onNext, onBack, onSkip, }) => {
  const {
    control,
    handleSubmit,


    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep1Input>({
    resolver: zodResolver(trueBuddyLeadStep1Schema),
    defaultValues: {
      dateInternalLeadGeneration: data.dateInternalLeadGeneration || '',
      productCategory: data.productCategory || ProductCategory.CROP_PROTECTION,
      infringementType: data.infringementType || InfringementType.COUNTERFEIT,
      broadGeography: data.broadGeography || '',
      clientSpocName: data.clientSpocName || '',
      clientSpocDesignation: data.clientSpocDesignation || '',
      natureOfEntity: data.natureOfEntity || NatureOfEntity.MANUFACTURER,
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep1Input) => {
    try {
      // Cast enum strings to proper types
      const typedData: Partial<TrueBuddyLeadData> = {
        dateInternalLeadGeneration: formData.dateInternalLeadGeneration,
        productCategory: formData.productCategory as ProductCategory,
        infringementType: formData.infringementType as InfringementType,
        broadGeography: formData.broadGeography,
        clientSpocName: formData.clientSpocName,
        clientSpocDesignation: formData.clientSpocDesignation,
        natureOfEntity: formData.natureOfEntity as NatureOfEntity,
      };

      await onNext(typedData);
    } catch (error) {
      console.error('Error submitting Step 1:', error);
    }
  };


  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 1: Case Reference
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date of Internal Lead Generation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Internal Lead Generation {/* ✅ Removed asterisk */}
            </label>
            <Controller
              name="dateInternalLeadGeneration"
              control={control}
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dateInternalLeadGeneration ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              )}
            />
            {errors.dateInternalLeadGeneration && (
              <p className="mt-1 text-sm text-red-600">{errors.dateInternalLeadGeneration.message}</p>
            )}
          </div>

          {/* Product Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Category 
            </label>
            <Controller
              name="productCategory"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.productCategory ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
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
          </div>

          {/* Infringement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Infringement Type 
            </label>
            <Controller
              name="infringementType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.infringementType ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
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
          </div>

          {/* Broad Geography */}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.broadGeography ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              )}
            />
            {errors.broadGeography && (
              <p className="mt-1 text-sm text-red-600">{errors.broadGeography.message}</p>
            )}
          </div>

          {/* Client SPOC Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client SPOC Name 
            </label>
            <Controller
              name="clientSpocName"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="Enter client SPOC name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.clientSpocName ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              )}
            />
            {errors.clientSpocName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientSpocName.message}</p>
            )}
          </div>

          {/* Client SPOC Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client SPOC Designation 
            </label>
            <Controller
              name="clientSpocDesignation"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="Enter designation"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.clientSpocDesignation ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              )}
            />
            {errors.clientSpocDesignation && (
              <p className="mt-1 text-sm text-red-600">{errors.clientSpocDesignation.message}</p>
            )}
          </div>

          {/* Nature of Entity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nature of Entity 
            </label>
            <Controller
              name="natureOfEntity"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.natureOfEntity ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
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
          </div>

          {/* Form Actions */}
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
            {/* Skip Button */}
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
