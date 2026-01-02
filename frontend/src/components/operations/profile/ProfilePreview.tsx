import { X, Edit, User, MapPin, Phone, FileText, Briefcase, Building2, Globe, Scale, Package, Car, Users, ShoppingBag, Heart, Award, Activity, AlertCircle } from 'lucide-react';
import type { CulpritProfile } from './types/profile.types';

interface Props {
  profile: CulpritProfile;
  onClose: () => void;
  onEdit?: () => void;
}

const ProfilePreview = ({ profile, onClose, onEdit }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-start">
          <div className="flex items-start gap-4">
            {profile.personal.profilePhoto ? (
              <img src={profile.personal.profilePhoto} alt={profile.name} className="w-24 h-24 rounded-lg object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-12 h-12" />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
              <p className="text-blue-100 mb-2">Profile ID: {profile.id}</p>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.status === 'Active' ? 'bg-green-500' : profile.status === 'Arrested' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                  {profile.currentStatus?.status || profile.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button onClick={onEdit} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <Edit className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <Section icon={<User />} title="Personal Information">
              <InfoRow label="Full Name" value={profile.name} />
              <InfoRow label="Date of Birth" value={profile.personal.dateOfBirth} />
              <InfoRow label="Gender" value={profile.personal.gender} />
              <InfoRow label="Nationality" value={profile.personal.nationality} />
            </Section>

            {/* Physical Attributes */}
            {profile.physical && (
              <Section icon={<Activity />} title="Physical Attributes">
                <InfoRow label="Height" value={profile.physical.height} />
                <InfoRow label="Weight" value={profile.physical.weight} />
                <InfoRow label="Eye Color" value={profile.physical.eyeColor} />
                <InfoRow label="Hair Color" value={profile.physical.hairColor} />
                <InfoRow label="Skin Tone" value={profile.physical.skinTone} />
                <InfoRow label="Identification Marks" value={profile.physical.identificationMarks} />
                {profile.physical.disabilities && (
                  <InfoRow label="Disabilities" value={profile.physical.disabilities} />
                )}
              </Section>
            )}

            {/* Address Information */}
            {profile.address && (
              <Section icon={<MapPin />} title="Address Information">
                <InfoRow label="Address" value={`${profile.address.addressLine1 || ''} ${profile.address.addressLine2 || ''}`} />
                <InfoRow label="City" value={profile.address.city} />
                <InfoRow label="State" value={profile.address.state} />
                <InfoRow label="Pincode" value={profile.address.pincode} />
                <InfoRow label="Country" value={profile.address.country} />
              </Section>
            )}

            {/* Contact Information */}
            {profile.contact && (
              <Section icon={<Phone />} title="Contact Information">
                <InfoRow label="Primary Phone" value={profile.contact.primaryPhone} />
                <InfoRow label="Secondary Phone" value={profile.contact.secondaryPhone} />
                <InfoRow label="Primary Email" value={profile.contact.primaryEmail} />
                <InfoRow label="Secondary Email" value={profile.contact.secondaryEmail} />
                {profile.contact.emergencyContactName && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Emergency Contact</p>
                    </div>
                    <InfoRow label="Name" value={profile.contact.emergencyContactName} />
                    <InfoRow label="Phone" value={profile.contact.emergencyContactPhone} />
                    <InfoRow label="Relation" value={profile.contact.emergencyContactRelation} />
                  </>
                )}
              </Section>
            )}

            {/* Identification Documents */}
            {profile.identification && (
              <Section icon={<FileText />} title="Identification Documents" fullWidth>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Employee ID" value={profile.identification.employeeId} />
                  <InfoRow label="Aadhaar Number" value={profile.identification.aadhaarNumber} />
                  <InfoRow label="PAN Number" value={profile.identification.panNumber} />
                  <InfoRow label="Driving License" value={profile.identification.drivingLicense} />
                  <InfoRow label="Passport Number" value={profile.identification.passportNumber} />
                  {profile.identification.otherIdType && (
                    <InfoRow label={profile.identification.otherIdType} value={profile.identification.otherIdNumber} />
                  )}
                </div>
              </Section>
            )}

            {/* Business Activities */}
            {profile.businessActivities && (
              <Section icon={<Briefcase />} title="Business Activities" fullWidth>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Retailer</p>
                    <p className="font-semibold text-sm">{profile.businessActivities.retailerStatus || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{profile.businessActivities.retailerType}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Supplier</p>
                    <p className="font-semibold text-sm">{profile.businessActivities.supplierStatus || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{profile.businessActivities.supplierType}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Manufacturer</p>
                    <p className="font-semibold text-sm">{profile.businessActivities.manufacturerStatus || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{profile.businessActivities.manufacturerType}</p>
                  </div>
                </div>
              </Section>
            )}

            {/* Entity & Organization */}
            {profile.entityOrganization?.associatedCompanies && profile.entityOrganization.associatedCompanies.length > 0 && (
              <Section icon={<Building2 />} title="Associated Companies" fullWidth>
                <div className="space-y-2">
                  {profile.entityOrganization.associatedCompanies.map((company, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-sm">{company.companyName}</p>
                      <p className="text-xs text-gray-600">{company.relationshipNature}</p>
                      {company.details && <p className="text-xs text-gray-500 mt-1">{company.details}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Geographic Exposure */}
            {profile.geographicExposure && (
              <Section icon={<Globe />} title="Geographic Exposure">
                {profile.geographicExposure.operatingRegions && profile.geographicExposure.operatingRegions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Operating Regions</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.geographicExposure.operatingRegions.map((region, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{region}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.geographicExposure.markets && profile.geographicExposure.markets.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Markets</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.geographicExposure.markets.map((market, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{market}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.geographicExposure.jurisdictions && profile.geographicExposure.jurisdictions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Jurisdictions</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.geographicExposure.jurisdictions.map((jurisdiction, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">{jurisdiction}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Related FIRs & Cases */}
            {profile.relatedFIRsCases?.firs && profile.relatedFIRsCases.firs.length > 0 && (
              <Section icon={<Scale />} title="Related FIRs & Cases" fullWidth>
                <div className="space-y-3">
                  {profile.relatedFIRsCases.firs.map((fir, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">FIR: {fir.firNumber}</p>
                          {fir.caseNumber && <p className="text-xs text-gray-600">Case: {fir.caseNumber}</p>}
                        </div>
                        {fir.status && (
                          <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">{fir.status}</span>
                        )}
                      </div>
                      {fir.sections && fir.sections.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {fir.sections.map((section, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">{section}</span>
                          ))}
                        </div>
                      )}
                      {fir.dateRegistered && (
                        <p className="text-xs text-gray-500">Registered: {new Date(fir.dateRegistered).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Material Seized */}
            {profile.relatedFIRsCases?.materialSeized && profile.relatedFIRsCases.materialSeized.length > 0 && (
              <Section icon={<Package />} title="Material Seized" fullWidth>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2">Brand</th>
                        <th className="text-left p-2">Company</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Authority</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.relatedFIRsCases.materialSeized.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{item.brandName}</td>
                          <td className="p-2">{item.company}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">{item.location}</td>
                          <td className="p-2">{item.raidingAuthority === 'Other' ? item.raidingAuthorityOther : item.raidingAuthority}</td>
                          <td className="p-2">{item.dateSeized ? new Date(item.dateSeized).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Assets - Vehicles */}
            {profile.assets?.vehicles && profile.assets.vehicles.length > 0 && (
              <Section icon={<Car />} title="Vehicles Owned">
                <div className="space-y-2">
                  {profile.assets.vehicles.map((vehicle, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-gray-600">{vehicle.registrationNumber}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{vehicle.ownershipType}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Known Associates */}
            {profile.associations?.knownAssociates && profile.associations.knownAssociates.length > 0 && (
              <Section icon={<Users />} title="Known Associates" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.associations.knownAssociates.map((associate, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-sm">{associate.name}</p>
                      <p className="text-xs text-gray-600">{associate.relationship}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">{associate.role}</span>
                        {associate.contactInfo && <p className="text-xs text-gray-500">{associate.contactInfo}</p>}
                      </div>
                      {associate.notes && <p className="text-xs text-gray-500 mt-1">{associate.notes}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Known Employees */}
            {profile.associations?.knownEmployees && profile.associations.knownEmployees.length > 0 && (
              <Section icon={<Users />} title="Known Employees" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.associations.knownEmployees.map((employee, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <p className="font-semibold text-sm">{employee.name}</p>
                      <p className="text-xs text-gray-600">{employee.relationship}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">{employee.role}</span>
                        {employee.contactInfo && <p className="text-xs text-gray-500">{employee.contactInfo}</p>}
                      </div>
                      {employee.notes && <p className="text-xs text-gray-500 mt-1">{employee.notes}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Products & Operations */}
            {profile.productsOperations && (
              <Section icon={<ShoppingBag />} title="Products & Operations" fullWidth>
                {profile.productsOperations.productsInfringed && profile.productsOperations.productsInfringed.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Products Infringed</p>
                    <div className="grid grid-cols-2 gap-2">
                      {profile.productsOperations.productsInfringed.map((product, index) => (
                        <div key={index} className="p-2 bg-orange-50 border border-orange-200 rounded">
                          <p className="font-semibold text-xs">{product.brandName}</p>
                          <p className="text-xs text-gray-600">{product.companyName}</p>
                          {product.productType && <p className="text-xs text-gray-500">{product.productType}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {profile.productsOperations.knownModusOperandi && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Modus Operandi</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">{profile.productsOperations.knownModusOperandi}</p>
                  </div>
                )}
                {profile.productsOperations.knownLocations && profile.productsOperations.knownLocations.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Known Locations</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.productsOperations.knownLocations.map((location, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">{location}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Family Background */}
            {profile.familyBackground && (
              <Section icon={<Heart />} title="Family Background">
                {profile.familyBackground.fatherName && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700">Father</p>
                    <p className="font-semibold text-sm">{profile.familyBackground.fatherName}</p>
                    <p className="text-xs text-gray-600">{profile.familyBackground.fatherOccupation}</p>
                    {profile.familyBackground.fatherContact && <p className="text-xs text-gray-500">{profile.familyBackground.fatherContact}</p>}
                  </div>
                )}
                {profile.familyBackground.motherName && (
                  <div className="mb-3 p-3 bg-pink-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700">Mother</p>
                    <p className="font-semibold text-sm">{profile.familyBackground.motherName}</p>
                    <p className="text-xs text-gray-600">{profile.familyBackground.motherOccupation}</p>
                    {profile.familyBackground.motherContact && <p className="text-xs text-gray-500">{profile.familyBackground.motherContact}</p>}
                  </div>
                )}
                {profile.familyBackground.siblings && profile.familyBackground.siblings.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Siblings</p>
                    <div className="space-y-2">
                      {profile.familyBackground.siblings.map((sibling, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <p className="font-semibold text-xs">{sibling.name}</p>
                          <p className="text-xs text-gray-600">{sibling.relationship} - {sibling.occupation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Influential Links */}
            {profile.associations?.influentialLinks && profile.associations.influentialLinks.length > 0 && (
              <Section icon={<Award />} title="Influential Links" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.associations.influentialLinks.map((link, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm">{link.personName}</p>
                        {link.relationship && (
                          <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded">{link.relationship}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{link.profile}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Current Status */}
            {profile.currentStatus && (
              <Section icon={<AlertCircle />} title="Current Status">
                <InfoRow label="Status" value={profile.currentStatus.status} />
                <InfoRow label="Last Known Location" value={profile.currentStatus.lastKnownLocation} />
                <InfoRow label="Status Date" value={profile.currentStatus.statusDate ? new Date(profile.currentStatus.statusDate).toLocaleDateString() : undefined} />
                {profile.currentStatus.remarks && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Remarks</p>
                    <p className="text-xs text-gray-600">{profile.currentStatus.remarks}</p>
                  </div>
                )}
              </Section>
            )}

            {/* Additional Information */}
            {profile.additional && (
              <Section icon={<FileText />} title="Additional Information" fullWidth>
                {profile.additional.notes && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">{profile.additional.notes}</p>
                  </div>
                )}
                {profile.additional.behavioralNotes && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Behavioral Observations</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">{profile.additional.behavioralNotes}</p>
                  </div>
                )}
                {profile.additional.tags && profile.additional.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.additional.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

          </div>

          {/* Metadata Footer */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <p className="font-semibold text-gray-700">Created At</p>
                <p>{new Date(profile.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Created By</p>
                <p>{profile.createdBy}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Last Updated</p>
                <p>{new Date(profile.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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

// Helper Components
const Section = ({ icon, title, children, fullWidth = false }: { icon: React.ReactNode; title: string; children: React.ReactNode; fullWidth?: boolean }) => (
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
