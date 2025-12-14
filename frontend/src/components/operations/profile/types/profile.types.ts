export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  nationality: string;
  profilePhoto?: string;
}

export interface PhysicalAttributes {
  height: string;
  weight: string;
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
  identificationMarks?: string;
  disabilities?: string;
}

export interface AddressInfo {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  permanentAddressSame: boolean;
  permanentAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface ContactInfo {
  primaryPhone: string;
  secondaryPhone?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
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
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  tags?: string[];
  additionalPhotos?: string[];
  attachments?: string[];
}

export interface CulpritProfile {
  id: string;
  personal: PersonalInfo;
  physical: PhysicalAttributes;
  address: AddressInfo;
  contact: ContactInfo;
  identification: IdentificationDocs;
  additional: AdditionalInfo;
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
  status: 'Active' | 'Archived' | 'Under Review';
}
