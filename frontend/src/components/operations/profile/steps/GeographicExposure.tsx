import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { X } from 'lucide-react';
import type { GeographicExposure } from '../types/profile.types';

interface Props {
  data?: GeographicExposure;
  onNext: (data: GeographicExposure) => void;
  onBack?: () => void;
}

const GeographicExposureStep = ({ data, onNext, onBack }: Props) => {
  const { handleSubmit } = useForm<GeographicExposure>();
  
  const [regions, setRegions] = useState<string[]>(data?.operatingRegions || []);
  const [markets, setMarkets] = useState<string[]>(data?.markets || []);
  const [jurisdictions, setJurisdictions] = useState<string[]>(data?.jurisdictions || []);
  
  const [regionInput, setRegionInput] = useState('');
  const [marketInput, setMarketInput] = useState('');
  const [jurisdictionInput, setJurisdictionInput] = useState('');

  const addTag = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[]) => {
    if (value.trim() && !list.includes(value.trim())) {
      setter([...list, value.trim()]);
    }
  };

  const removeTag = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[]) => {
    setter(list.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    onNext({ operatingRegions: regions, markets, jurisdictions });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Exposure & Operating Regions</h3>

        {/* Operating Regions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Operating Regions</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={regionInput}
              onChange={(e) => setRegionInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(regionInput, setRegions, regions);
                  setRegionInput('');
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter region and press Enter"
            />
            <button
              type="button"
              onClick={() => {
                addTag(regionInput, setRegions, regions);
                setRegionInput('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map((region, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                {region}
                <button type="button" onClick={() => removeTag(index, setRegions, regions)} className="hover:bg-blue-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Markets */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Markets</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={marketInput}
              onChange={(e) => setMarketInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(marketInput, setMarkets, markets);
                  setMarketInput('');
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter market and press Enter"
            />
            <button
              type="button"
              onClick={() => {
                addTag(marketInput, setMarkets, markets);
                setMarketInput('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {markets.map((market, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                {market}
                <button type="button" onClick={() => removeTag(index, setMarkets, markets)} className="hover:bg-green-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Jurisdictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdictions</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={jurisdictionInput}
              onChange={(e) => setJurisdictionInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(jurisdictionInput, setJurisdictions, jurisdictions);
                  setJurisdictionInput('');
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter jurisdiction and press Enter"
            />
            <button
              type="button"
              onClick={() => {
                addTag(jurisdictionInput, setJurisdictions, jurisdictions);
                setJurisdictionInput('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {jurisdictions.map((jurisdiction, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
                {jurisdiction}
                <button type="button" onClick={() => removeTag(index, setJurisdictions, jurisdictions)} className="hover:bg-purple-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {onBack && <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Back</button>}
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto">Next Step</button>
      </div>
    </form>
  );
};

export default GeographicExposureStep;
