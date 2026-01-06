import React, { useState } from 'react';
import { X, Briefcase, Search, Building, Package, Mail, Phone, MapPin } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  productName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  activeCases: number;
  totalCases: number;
}

// Mock client data
const mockClients: Client[] = [
  {
    id: 'client001',
    name: 'Samsung India',
    productName: 'Galaxy Smartphones',
    industry: 'Electronics',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh.kumar@samsung.com',
    phone: '+91 98765 00001',
    address: 'Noida, Uttar Pradesh',
    activeCases: 2,
    totalCases: 5,
  },
  {
    id: 'client002',
    name: 'Adidas India',
    productName: 'Sports Footwear',
    industry: 'Fashion & Apparel',
    contactPerson: 'Priya Sharma',
    email: 'priya.sharma@adidas.com',
    phone: '+91 98765 00002',
    address: 'Gurgaon, Haryana',
    activeCases: 1,
    totalCases: 3,
  },
  {
    id: 'client003',
    name: 'Apple India',
    productName: 'iPhone Accessories',
    industry: 'Electronics',
    contactPerson: 'Amit Verma',
    email: 'amit.verma@apple.com',
    phone: '+91 98765 00003',
    address: 'Mumbai, Maharashtra',
    activeCases: 0,
    totalCases: 4,
  },
  {
    id: 'client004',
    name: 'Cipla Pharmaceuticals',
    productName: 'Generic Medicines',
    industry: 'Pharmaceuticals',
    contactPerson: 'Dr. Sunita Reddy',
    email: 'sunita.reddy@cipla.com',
    phone: '+91 98765 00004',
    address: 'Mumbai, Maharashtra',
    activeCases: 1,
    totalCases: 2,
  },
  {
    id: 'client005',
    name: 'Rolex India',
    productName: 'Luxury Watches',
    industry: 'Luxury Goods',
    contactPerson: 'Vikram Singh',
    email: 'vikram.singh@rolex.com',
    phone: '+91 98765 00005',
    address: 'New Delhi',
    activeCases: 1,
    totalCases: 1,
  },
  {
    id: 'client006',
    name: 'Maruti Suzuki India',
    productName: 'Automotive Spare Parts',
    industry: 'Automotive',
    contactPerson: 'Suresh Patel',
    email: 'suresh.patel@marutisuzuki.com',
    phone: '+91 98765 00006',
    address: 'Gurgaon, Haryana',
    activeCases: 1,
    totalCases: 2,
  },
  {
    id: 'client007',
    name: 'Zara India',
    productName: 'Fashion Apparel',
    industry: 'Fashion & Apparel',
    contactPerson: 'Neha Kapoor',
    email: 'neha.kapoor@zara.com',
    phone: '+91 98765 00007',
    address: 'Mumbai, Maharashtra',
    activeCases: 1,
    totalCases: 1,
  },
  {
    id: 'client008',
    name: 'Lakme India',
    productName: 'Cosmetics & Beauty Products',
    industry: 'Beauty & Cosmetics',
    contactPerson: 'Pooja Malhotra',
    email: 'pooja.malhotra@lakme.com',
    phone: '+91 98765 00008',
    address: 'Mumbai, Maharashtra',
    activeCases: 1,
    totalCases: 1,
  },
  {
    id: 'client009',
    name: 'Sony India',
    productName: 'Audio Equipment',
    industry: 'Electronics',
    contactPerson: 'Karan Mehta',
    email: 'karan.mehta@sony.com',
    phone: '+91 98765 00009',
    address: 'New Delhi',
    activeCases: 1,
    totalCases: 1,
  },
  {
    id: 'client010',
    name: 'Coca Cola India',
    productName: 'Soft Drinks',
    industry: 'Beverages',
    contactPerson: 'Anjali Singh',
    email: 'anjali.singh@cocacola.com',
    phone: '+91 98765 00010',
    address: 'Gurgaon, Haryana',
    activeCases: 0,
    totalCases: 1,
  },
];

interface ClientsListModalProps {
  onClose: () => void;
}

const ClientsListModal: React.FC<ClientsListModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const industries = ['all', ...Array.from(new Set(mockClients.map(c => c.industry)))];

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all' || client.industry === selectedIndustry;
    
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Clients</h2>
              <p className="text-sm text-gray-600">{filteredClients.length} total clients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name, product, or contact person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clients List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No clients found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-green-300 transition"
                >
                  {/* Client Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {client.productName}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {client.industry}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{client.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{client.address}</span>
                    </div>
                  </div>

                  {/* Case Statistics */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Active Cases</p>
                        <p className="text-2xl font-bold text-green-600">{client.activeCases}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{client.totalCases}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientsListModal;
