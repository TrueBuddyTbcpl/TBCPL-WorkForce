import {
  X, Edit, Trash2, User, MapPin, Phone, FileText, Briefcase,
  Building2, Globe, Scale, Package, Car, Users, ShoppingBag,
  Heart, Award, AlertCircle
} from 'lucide-react';
import type { ApiProfileDetail } from '../../../services/api/profileApi';

import { useEffect, useState } from 'react';
import apiClient from '../../../services/api/apiClient';
import { Link } from 'lucide-react'; // add to existing lucide imports


interface Props {
  profile: ApiProfileDetail;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProfilePreview = ({ profile, onClose, onEdit, onDelete }: Props) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-500';
      case 'ARRESTED': return 'bg-red-500';
      case 'ABSCONDING': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };

  const [linkedCasesCount, setLinkedCasesCount] = useState<number | null>(null);

  useEffect(() => {
    apiClient.get(`/operation/cases/profile/${profile.id}/count`)
      .then(res => setLinkedCasesCount(res.data.data))
      .catch(() => setLinkedCasesCount(0));
  }, [profile.id]);

  const p = profile;
  const fullName = p.name;
  const pi = p.personalInfo;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-start">
          <div className="flex items-start gap-4">
            {pi?.profilePhoto ? (
              <img src={pi.profilePhoto} alt={fullName} className="w-24 h-24 rounded-lg object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-12 h-12" />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold mb-1">{fullName}</h2>
              <p className="text-blue-100 mb-1">Profile Number: {p.profileNumber}</p>
              <p className="text-blue-200 text-sm mb-2">DB ID: {p.id}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(p.currentStatus?.status || p.status)}`}>
                {p.currentStatus?.status || p.status}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button onClick={onEdit} className="p-2 hover:bg-blue-700 rounded-lg transition-colors" title="Edit">
                <Edit className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="p-2 hover:bg-red-700 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {linkedCasesCount !== null && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
      ${linkedCasesCount > 0
                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              {linkedCasesCount > 0
                ? `Linked to ${linkedCasesCount} case${linkedCasesCount > 1 ? 's' : ''}`
                : 'No cases linked'
              }
            </span>
          </div>
        )}


        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Personal Info */}
            <Section icon={<User />} title="Personal Information">
              <InfoRow label="Full Name" value={fullName} />
              <InfoRow label="Date of Birth" value={pi?.dateOfBirth} />
              <InfoRow label="Gender" value={pi?.gender} />
              <InfoRow label="Nationality" value={pi?.nationality} />
              <InfoRow label="Blood Group" value={pi?.bloodGroup} />
            </Section>

            

            {/* Address */}
            {p.address && (
              <Section icon={<MapPin />} title="Address">
                <InfoRow label="Address" value={[p.address.addressLine1, p.address.addressLine2].filter(Boolean).join(', ')} />
                <InfoRow label="City" value={p.address.city} />
                <InfoRow label="State" value={p.address.state} />
                <InfoRow label="Pincode" value={p.address.pincode} />
                <InfoRow label="Country" value={p.address.country} />
              </Section>
            )}

            {/* Contact */}
            {p.contactInfo && (
              <Section icon={<Phone />} title="Contact Information">
                <InfoRow label="Primary Phone" value={p.contactInfo.primaryPhone} />
                <InfoRow label="Secondary Phone" value={p.contactInfo.secondaryPhone} />
                <InfoRow label="Primary Email" value={p.contactInfo.primaryEmail} />
                <InfoRow label="Secondary Email" value={p.contactInfo.secondaryEmail} />
                {p.contactInfo.emergencyContactName && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Emergency Contact</p>
                    </div>
                    <InfoRow label="Name" value={p.contactInfo.emergencyContactName} />
                    <InfoRow label="Phone" value={p.contactInfo.emergencyContactPhone} />
                    <InfoRow label="Relation" value={p.contactInfo.emergencyContactRelation} />
                  </>
                )}
              </Section>
            )}

            {/* ID Documents */}
            {p.identificationDocs && (
              <Section icon={<FileText />} title="Identification Documents" fullWidth>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Aadhaar" value={p.identificationDocs.aadhaarNumber} />
                  <InfoRow label="PAN" value={p.identificationDocs.panNumber} />
                  <InfoRow label="Driving License" value={p.identificationDocs.drivingLicense} />
                  <InfoRow label="Passport" value={p.identificationDocs.passportNumber} />
                  <InfoRow label="Employee ID" value={p.identificationDocs.employeeId} />
                  {p.identificationDocs.otherIdType && (
                    <InfoRow label={p.identificationDocs.otherIdType} value={p.identificationDocs.otherIdNumber} />
                  )}
                </div>
              </Section>
            )}

            {/* Business Activities */}
            {p.businessActivities && (
              <Section icon={<Briefcase />} title="Business Activities" fullWidth>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Retailer</p>
                    <p className="font-semibold text-sm">{p.businessActivities.retailerStatus || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{p.businessActivities.retailerType}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Supplier</p>
                    <p className="font-semibold text-sm">{p.businessActivities.supplierStatus || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{p.businessActivities.supplierType}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Manufacturer</p>
                    <p className="font-semibold text-sm">{p.businessActivities.manufacturerStatus || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{p.businessActivities.manufacturerType}</p>
                  </div>
                </div>
              </Section>
            )}

            {/* Associated Companies */}
            {p.associatedCompanies && p.associatedCompanies.length > 0 && (
              <Section icon={<Building2 />} title="Associated Companies" fullWidth>
                <div className="space-y-2">
                  {p.associatedCompanies.map((c, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-sm">{c.companyName}</p>
                      <p className="text-xs text-gray-600">{c.relationshipNature}</p>
                      {c.details && <p className="text-xs text-gray-500 mt-1">{c.details}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Geographic Exposure */}
            {p.geographicExposure && (
              <Section icon={<Globe />} title="Geographic Exposure">
                {p.geographicExposure.operatingRegions && p.geographicExposure.operatingRegions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Operating Regions</p>
                    <div className="flex flex-wrap gap-1">
                      {p.geographicExposure.operatingRegions.map((r, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{r}</span>
                      ))}
                    </div>
                  </div>
                )}
                {p.geographicExposure.markets && p.geographicExposure.markets.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Markets</p>
                    <div className="flex flex-wrap gap-1">
                      {p.geographicExposure.markets.map((m, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* FIRs */}
            {p.firs && p.firs.length > 0 && (
              <Section icon={<Scale />} title="Related FIRs" fullWidth>
                <div className="space-y-3">
                  {p.firs.map((fir, i) => (
                    <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">FIR: {fir.firNumber}</p>
                          {fir.caseNumber && <p className="text-xs text-gray-600">Case: {fir.caseNumber}</p>}
                        </div>
                        {fir.status && (
                          <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">{fir.status}</span>
                        )}
                      </div>
                      {fir.dateRegistered && (
                        <p className="text-xs text-gray-500">Registered: {new Date(fir.dateRegistered).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Material Seized */}
            {p.materialSeized && p.materialSeized.length > 0 && (
              <Section icon={<Package />} title="Material Seized" fullWidth>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2">Brand</th>
                        <th className="text-left p-2">Company</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.materialSeized.map((item, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{item.brandName}</td>
                          <td className="p-2">{item.company}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">{item.location}</td>
                          <td className="p-2">{item.dateSeized ? new Date(item.dateSeized).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Vehicles */}
            {p.vehicles && p.vehicles.length > 0 && (
              <Section icon={<Car />} title="Vehicles">
                <div className="space-y-2">
                  {p.vehicles.map((v, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{v.make} {v.model}</p>
                        <p className="text-xs text-gray-600">{v.registrationNumber}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{v.ownershipType}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Known Associates */}
            {p.knownAssociates && p.knownAssociates.length > 0 && (
              <Section icon={<Users />} title="Known Associates" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.knownAssociates.map((a, i) => (
                    <div key={i} className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-sm">{a.name}</p>
                      <p className="text-xs text-gray-600">{a.relationship}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">{a.role}</span>
                        {a.contactInfo && <p className="text-xs text-gray-500">{a.contactInfo}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Known Employees */}
            {p.knownEmployees && p.knownEmployees.length > 0 && (
              <Section icon={<Users />} title="Known Employees" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.knownEmployees.map((e, i) => (
                    <div key={i} className="p-3 bg-green-50 rounded-lg">
                      <p className="font-semibold text-sm">{e.name}</p>
                      <p className="text-xs text-gray-600">{e.relationship}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">{e.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Products & Operations */}
            {p.productsOperations && (
              <Section icon={<ShoppingBag />} title="Products & Operations" fullWidth>
                {p.productsOperations.productsInfringed && p.productsOperations.productsInfringed.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Products Infringed</p>
                    <div className="grid grid-cols-2 gap-2">
                      {p.productsOperations.productsInfringed.map((prod, i) => (
                        <div key={i} className="p-2 bg-orange-50 border border-orange-200 rounded">
                          <p className="font-semibold text-xs">{prod.brandName}</p>
                          <p className="text-xs text-gray-600">{prod.companyName}</p>
                          {prod.productType && <p className="text-xs text-gray-500">{prod.productType}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {p.productsOperations.knownModusOperandi && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Modus Operandi</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">{p.productsOperations.knownModusOperandi}</p>
                  </div>
                )}
              </Section>
            )}

            {/* Family Background */}
            {p.familyBackground && (
              <Section icon={<Heart />} title="Family Background">
                {p.familyBackground.fatherName && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700">Father</p>
                    <p className="font-semibold text-sm">{p.familyBackground.fatherName}</p>
                    <InfoRow label="Occupation" value={p.familyBackground.fatherOccupation} />
                  </div>
                )}
                {p.familyBackground.motherName && (
                  <div className="mb-3 p-3 bg-pink-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700">Mother</p>
                    <p className="font-semibold text-sm">{p.familyBackground.motherName}</p>
                    <InfoRow label="Occupation" value={p.familyBackground.motherOccupation} />
                  </div>
                )}
                {p.familyBackground.siblings && p.familyBackground.siblings.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Siblings</p>
                    {p.familyBackground.siblings.map((s, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded mb-1">
                        <p className="font-semibold text-xs">{s.name}</p>
                        <p className="text-xs text-gray-600">{s.relationship} — {s.occupation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* Influential Links */}
            {p.influentialLinks && p.influentialLinks.length > 0 && (
              <Section icon={<Award />} title="Influential Links" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.influentialLinks.map((l, i) => (
                    <div key={i} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-sm">{l.personName}</p>
                        {l.relationship && (
                          <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded">{l.relationship}</span>
                        )}
                      </div>
                      {l.profile && <p className="text-xs text-gray-600">{l.profile}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Current Status */}
            {p.currentStatus && (
              <Section icon={<AlertCircle />} title="Current Status">
                <InfoRow label="Status" value={p.currentStatus.status} />
                <InfoRow label="Last Known Location" value={p.currentStatus.lastKnownLocation} />
                <InfoRow label="Status Date" value={p.currentStatus.statusDate ? new Date(p.currentStatus.statusDate).toLocaleDateString() : undefined} />
                {p.currentStatus.remarks && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Remarks</p>
                    <p className="text-xs text-gray-600">{p.currentStatus.remarks}</p>
                  </div>
                )}
              </Section>
            )}

            {/* Additional Info */}
            {p.additionalInfo && (
              <Section icon={<FileText />} title="Additional Information" fullWidth>
                {p.additionalInfo.notes && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">{p.additionalInfo.notes}</p>
                  </div>
                )}
                {p.additionalInfo.behavioralNotes && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Behavioral Observations</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">{p.additionalInfo.behavioralNotes}</p>
                  </div>
                )}
                {p.additionalInfo.tags && p.additionalInfo.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {p.additionalInfo.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

          </div>

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div>
              <p className="font-semibold text-gray-700">Created At</p>
              <p>{new Date(p.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Created By</p>
              <p>{p.createdBy}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Last Updated</p>
              <p>{new Date(p.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
            Close
          </button>
          {onEdit && (
            <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper components
const Section = ({ icon, title, children, fullWidth = false }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; fullWidth?: boolean;
}) => (
  <div className={`bg-white border rounded-lg p-4 ${fullWidth ? 'lg:col-span-2' : ''}`}>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b">
      <div className="text-blue-600">{icon}</div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="mb-2">
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
};

export default ProfilePreview;
