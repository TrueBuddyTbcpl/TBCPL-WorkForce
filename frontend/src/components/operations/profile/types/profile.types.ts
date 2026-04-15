export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string; 
  nationality?: string;
  profilePhoto?: string;
}


export interface AddressInfo {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  permanentAddressSame?: boolean;
  permanentAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
}

export interface EmergencyContact {
  id?: number;
  name?: string;
  phone?: string;
  relation?: string;
}

// ✅ UPDATED — ContactInfo with list instead of 3 single fields
export interface ContactInfo {
  primaryPhone?: string;
  secondaryPhone?: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  emergencyContacts?: EmergencyContact[]; // replaced emergencyContactName/Phone/Relation
}

export interface IdentificationDocs {
  employeeId?: string;
  aadhaarNumber?: string;
  aadhaarPhoto?: string;
  panNumber?: string;
  panPhoto?: string;
  drivingLicense?: string;
  dlPhoto?: string;
  passportNumber?: string;
  passportPhoto?: string;
  otherIdType?: string;
  otherIdNumber?: string;
  otherIdPhoto?: string;
}

export interface AdditionalInfo {
  notes?: string;
  behavioralNotes?: string;
  tags?: string[];
  additionalPhotos?: string[];
  attachments?: string[];
  linkedCases?: string[];
}

// Business Activities
export interface BusinessActivities {
  retailerStatus?: string;      // was: 'Individual' | 'Entity'
  retailerType?: string;        // was: 'Authorized' | 'Unauthorized'
  retailerDetails?: string;
  supplierStatus?: string;      // was: 'Individual' | 'Entity'
  supplierType?: string;        // was: 'Authorized' | 'Unauthorized'
  supplierDetails?: string;
  manufacturerStatus?: string;  // was: 'Individual' | 'Entity'
  manufacturerType?: string;    // was: 'Authorized' | 'Unauthorized'
  manufacturerDetails?: string;
}

// Entity & Organization
export interface EntityOrganization {
  associatedCompanies?: Array<{
    companyName: string;
    relationshipNature: string;
    details?: string;
  }>;
}

// Geographic Exposure
export interface GeographicExposure {
  operatingRegions?: string[];
  markets?: string[];
  jurisdictions?: string[];
}

// Material Seized
export interface MaterialSeizedItem {
  id?: string;
  brandName?: string;
  company?: string;
  quantity?: string;
  location?: string;
  raidingAuthority?: string;    // was: 'N_A' | 'Agriculture' | 'Police' | 'Wing' | 'Other'
  raidingAuthorityOther?: string;
  dateSeized?: string;
}

// Related FIRs & Cases
export interface RelatedFIRsCases {
  firs?: Array<{
    firNumber: string;
    caseNumber?: string;
    sections?: string[];
    dateRegistered?: string;
    status?: string;
  }>;
  materialSeized?: MaterialSeizedItem[];
}

// Vehicles
export interface VehicleInfo {
  id?: string;
  make?: string;
  model?: string;
  registrationNumber?: string;
  ownershipType?: string;       // was: 'N_A' | 'Owned' | 'Leased' | 'Unknown'
}

// Assets
export interface Assets {
  vehicles?: VehicleInfo[];
}

// Associates
export interface AssociateInfo {
  id?: string;
  name?: string;
  relationship?: string;
  role?: string;                // was: 'N_A' | 'Associate' | 'Employee' | 'Family'
  contactInfo?: string;
  notes?: string;
}

// Associations
export interface Associations {
  knownAssociates?: AssociateInfo[];
  knownEmployees?: AssociateInfo[];
  influentialLinks?: Array<{
    personName: string;
    profile: string;
    relationship?: string;
  }>;
}

// Products & Operations
export interface ProductsOperations {
  productsInfringed?: Array<{
    brandName?: string;
    companyName?: string;
    productType?: string;
  }>;
  knownModusOperandi?: string;
  knownLocations?: string[];
}

// Family Background
export interface FamilyBackground {
  fatherName?: string;
  fatherOccupation?: string;
  fatherContact?: string;
  motherName?: string;
  motherOccupation?: string;
  motherContact?: string;
  siblings?: Array<{
    name: string;
    relationship: string;
    occupation?: string;
  }>;
}

// Current Status
export interface CurrentStatus {
  status?: string;              // was: 'Active' | 'Inactive' | 'Arrested' | 'Absconding' | 'Unknown'
  lastKnownLocation?: string;
  statusDate?: string;
  remarks?: string;
}

// Audit Trail
export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  section: string;
  changes: string;
}

export interface AuditTrail {
  entries?: AuditEntry[];
}

// ✅ ProfileData with ALL properties
export interface ProfileData {
  id?: string;
  personal?: PersonalInfo;  // ✅ Added
  address?: AddressInfo;
  contact?: ContactInfo;
  identification?: IdentificationDocs;  // ✅ Added
  additional?: AdditionalInfo;
  
  // New sections
  businessActivities?: BusinessActivities;
  entityOrganization?: EntityOrganization;
  geographicExposure?: GeographicExposure;
  relatedFIRsCases?: RelatedFIRsCases;
  assets?: Assets;
  associations?: Associations;
  productsOperations?: ProductsOperations;
  familyBackground?: FamilyBackground;
  currentStatus?: CurrentStatus;
  auditTrail?: AuditTrail;
  
  createdAt?: string;
  createdBy?: string;
  lastUpdated?: string;
}

// ✅ CulpritProfile with ALL properties
export interface CulpritProfile {
  id: string;
  name: string;
  status: string;
  personal: PersonalInfo;  // ✅ Added
  address?: AddressInfo;
  contact?: ContactInfo;
  identification?: IdentificationDocs;  // ✅ Added
  additional?: AdditionalInfo;
  
  // New sections
  businessActivities?: BusinessActivities;
  entityOrganization?: EntityOrganization;
  geographicExposure?: GeographicExposure;
  relatedFIRsCases?: RelatedFIRsCases;
  assets?: Assets;
  associations?: Associations;
  productsOperations?: ProductsOperations;
  familyBackground?: FamilyBackground;
  currentStatus?: CurrentStatus;
  auditTrail?: AuditTrail;
  
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
}
