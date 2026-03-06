import apiClient from './apiClient';

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiProfilePersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  nationality?: string;
  profilePhoto?: string;
}

export interface ApiProfilePhysicalAttributes {
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
  identificationMarks?: string;
  disabilities?: string;
}

export interface ApiProfileAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  permanentSameAsCurrent?: boolean;
  permAddressLine1?: string;
  permAddressLine2?: string;
  permCity?: string;
  permState?: string;
  permPincode?: string;
  permCountry?: string;
}

export interface ApiProfileContactInfo {
  primaryPhone?: string;
  secondaryPhone?: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

export interface ApiProfileIdentificationDocs {
  aadhaarNumber?: string;
  panNumber?: string;
  drivingLicense?: string;
  passportNumber?: string;
  employeeId?: string;
  otherIdType?: string;
  otherIdNumber?: string;
}

export interface ApiProfileBusinessActivities {
  retailerStatus?: string;
  retailerType?: string;
  supplierStatus?: string;
  supplierType?: string;
  manufacturerStatus?: string;
  manufacturerType?: string;
}

export interface ApiProfileAssociatedCompany {
  id?: number;
  companyName: string;
  relationshipNature?: string;
  details?: string;
}

export interface ApiProfileGeographicExposure {
  operatingRegions?: string[];
  markets?: string[];
  jurisdictions?: string[];
}

export interface ApiProfileFir {
  id?: number;
  firNumber?: string;
  caseNumber?: string;
  sections?: string[];
  status?: string;
  dateRegistered?: string;
}

export interface ApiProfileMaterialSeized {
  id?: number;
  brandName?: string;
  company?: string;
  quantity?: string;
  location?: string;
  raidingAuthority?: string;
  raidingAuthorityOther?: string;
  dateSeized?: string;
}

export interface ApiProfileVehicle {
  id?: number;
  make?: string;
  model?: string;
  registrationNumber?: string;
  ownershipType?: string;
}

export interface ApiProfileAssociate {
  id?: number;
  name: string;
  relationship?: string;
  role?: string;
  contactInfo?: string;
  notes?: string;
}

export interface ApiProfileInfluentialLink {
  id?: number;
  personName: string;
  relationship?: string;
  profile?: string;
}

export interface ApiProfileProductInfringed {
  id?: number;
  brandName: string;
  companyName: string;
  productType?: string;
}

export interface ApiProfileProductsOperations {
  productsInfringed?: ApiProfileProductInfringed[];
  knownModusOperandi?: string;
  knownLocations?: string[];
}

export interface ApiProfileFamilyBackground {
  fatherName?: string;
  fatherOccupation?: string;
  fatherContact?: string;
  motherName?: string;
  motherOccupation?: string;
  motherContact?: string;
  siblings?: ApiProfileSibling[];
}

export interface ApiProfileSibling {
  id?: number;
  name: string;
  relationship?: string;
  occupation?: string;
}

export interface ApiProfileCurrentStatus {
  status?: string;
  lastKnownLocation?: string;
  statusDate?: string;
  remarks?: string;
}

export interface ApiProfileAdditionalInfo {
  notes?: string;
  behavioralNotes?: string;
  tags?: string[];
}

export interface ApiStepStatus {
  stepNumber: number;
  stepName: string;
  status: 'NOT_FILLED' | 'PARTIAL' | 'COMPLETE';
}

export interface ApiProfileDetail {
  id: number;
  profileNumber: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  personalInfo?: ApiProfilePersonalInfo;
  physicalAttributes?: ApiProfilePhysicalAttributes;
  address?: ApiProfileAddress;
  contactInfo?: ApiProfileContactInfo;
  identificationDocs?: ApiProfileIdentificationDocs;
  businessActivities?: ApiProfileBusinessActivities;
  associatedCompanies?: ApiProfileAssociatedCompany[];
  geographicExposure?: ApiProfileGeographicExposure;
  firs?: ApiProfileFir[];
  materialSeized?: ApiProfileMaterialSeized[];
  vehicles?: ApiProfileVehicle[];
  knownAssociates?: ApiProfileAssociate[];
  knownEmployees?: ApiProfileAssociate[];
  influentialLinks?: ApiProfileInfluentialLink[];
  productsOperations?: ApiProfileProductsOperations;
  familyBackground?: ApiProfileFamilyBackground;
  currentStatus?: ApiProfileCurrentStatus;
  additionalInfo?: ApiProfileAdditionalInfo;
  stepStatuses?: ApiStepStatus[];
}

export interface ApiPagedProfileResponse {
  profiles: ApiProfileDetail[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export interface ApiImageUploadResponse {
  url: string;
  publicId: string;
  format: string;
  size: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ProfileInitRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  nationality?: string;
  profilePhoto?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPER — uppercase all enum string fields before sending
// ─────────────────────────────────────────────────────────────────────────────

const up = (val?: string): string | undefined => val?.toUpperCase();

// ─────────────────────────────────────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

const BASE = '/operation/profiles';

// ── Image Upload ──────────────────────────────────────────────────────────────

export const uploadProfileImage = async (
  file: File,
  folder?: string
): Promise<ApiImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);

  const res = await apiClient.post(`${BASE}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ── Step 1 — Init Profile ─────────────────────────────────────────────────────

export const initProfile = async (
  data: ProfileInitRequest
): Promise<ApiProfileDetail> => {
  const payload: ProfileInitRequest = {
    ...data,
    gender:     up(data.gender),      // Male     → MALE
    bloodGroup: up(data.bloodGroup),  // A+       → A+  (safe, no-op if already correct)
  };
  const res = await apiClient.post(`${BASE}/init`, payload);
  return res.data;
};

// ── Step 2 — Physical Attributes ──────────────────────────────────────────────

export const savePhysicalAttributes = async (
  profileId: number,
  data: ApiProfilePhysicalAttributes
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/physical-attributes`, data);
  return res.data;
};

// ── Step 3 — Address ──────────────────────────────────────────────────────────

export const saveAddress = async (
  profileId: number,
  data: ApiProfileAddress
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/address`, data);
  return res.data;
};

// ── Step 4 — Contact Info ─────────────────────────────────────────────────────

export const saveContactInfo = async (
  profileId: number,
  data: ApiProfileContactInfo
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/contact-info`, data);
  return res.data;
};

// ── Step 5 — Identification Docs ──────────────────────────────────────────────

export const saveIdentificationDocs = async (
  profileId: number,
  data: ApiProfileIdentificationDocs
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/identification-docs`, data);
  return res.data;
};

// ── Step 6 — Business Activities ──────────────────────────────────────────────

export const saveBusinessActivities = async (
  profileId: number,
  data: ApiProfileBusinessActivities
): Promise<ApiProfileDetail> => {
  const payload: ApiProfileBusinessActivities = {
    retailerStatus:     up(data.retailerStatus),      // Individual  → INDIVIDUAL
    retailerType:       up(data.retailerType),        // Authorized  → AUTHORIZED
    supplierStatus:     up(data.supplierStatus),
    supplierType:       up(data.supplierType),
    manufacturerStatus: up(data.manufacturerStatus),
    manufacturerType:   up(data.manufacturerType),
  };
  const res = await apiClient.put(`${BASE}/${profileId}/business-activities`, payload);
  return res.data;
};

// ── Step 7 — Entity & Organization ───────────────────────────────────────────

export const saveEntityOrganization = async (
  profileId: number,
  data: { associatedCompanies: ApiProfileAssociatedCompany[] }
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/entity-organization`, data);
  return res.data;
};

// ── Step 8 — Geographic Exposure ──────────────────────────────────────────────

export const saveGeographicExposure = async (
  profileId: number,
  data: ApiProfileGeographicExposure
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/geographic-exposure`, data);
  return res.data;
};

// ── Step 9 — Related FIRs ─────────────────────────────────────────────────────

export const saveRelatedFIRs = async (
  profileId: number,
  data: { firs: ApiProfileFir[] }
): Promise<ApiProfileDetail> => {
  const payload = {
    firs: data.firs.map(f => ({
      ...f,
      status: up(f.status),   // Pending → PENDING
    })),
  };
  const res = await apiClient.put(`${BASE}/${profileId}/related-firs`, payload);
  return res.data;
};

// ── Step 10 — Material Seized ─────────────────────────────────────────────────

export const saveMaterialSeized = async (
  profileId: number,
  data: { materialSeized: ApiProfileMaterialSeized[] }
): Promise<ApiProfileDetail> => {
  const payload = {
    materialSeized: data.materialSeized.map(m => ({
      ...m,
      raidingAuthority: up(m.raidingAuthority),   // Police → POLICE
    })),
  };
  const res = await apiClient.put(`${BASE}/${profileId}/material-seized`, payload);
  return res.data;
};

// ── Step 11 — Assets ──────────────────────────────────────────────────────────

export const saveAssets = async (
  profileId: number,
  data: { vehicles: ApiProfileVehicle[] }
): Promise<ApiProfileDetail> => {
  const payload = {
    vehicles: data.vehicles.map(v => ({
      ...v,
      ownershipType: up(v.ownershipType),   // Owned → OWNED
    })),
  };
  const res = await apiClient.put(`${BASE}/${profileId}/assets`, payload);
  return res.data;
};

// ── Step 12 — Known Associates ────────────────────────────────────────────────

export const saveKnownAssociates = async (
  profileId: number,
  data: { knownAssociates: ApiProfileAssociate[] }
): Promise<ApiProfileDetail> => {
  const payload = {
    knownAssociates: data.knownAssociates.map(a => ({
      ...a,
      role: up(a.role),   // Associate → ASSOCIATE
    })),
  };
  const res = await apiClient.put(`${BASE}/${profileId}/known-associates`, payload);
  return res.data;
};

// ── Step 13 — Known Employees ─────────────────────────────────────────────────

export const saveKnownEmployees = async (
  profileId: number,
  data: { knownEmployees: ApiProfileAssociate[] }
): Promise<ApiProfileDetail> => {
  const payload = {
    knownEmployees: data.knownEmployees.map(e => ({
      ...e,
      role: up(e.role),   // Employee → EMPLOYEE
    })),
  };
  const res = await apiClient.put(`${BASE}/${profileId}/known-employees`, payload);
  return res.data;
};

// ── Step 14 — Products & Operations ──────────────────────────────────────────

export const saveProductsOperations = async (
  profileId: number,
  data: ApiProfileProductsOperations
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/products-operations`, data);
  return res.data;
};

// ── Step 15 — Family Background ───────────────────────────────────────────────

export const saveFamilyBackground = async (
  profileId: number,
  data: ApiProfileFamilyBackground
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/family-background`, data);
  return res.data;
};

// ── Step 16 — Influential Links ───────────────────────────────────────────────

export const saveInfluentialLinks = async (
  profileId: number,
  data: { influentialLinks: ApiProfileInfluentialLink[] }
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/influential-links`, data);
  return res.data;
};

// ── Step 17 — Current Status ──────────────────────────────────────────────────

export const saveCurrentStatus = async (
  profileId: number,
  data: ApiProfileCurrentStatus
): Promise<ApiProfileDetail> => {
  const payload: ApiProfileCurrentStatus = {
    ...data,
    status: up(data.status),   // Active → ACTIVE
  };
  const res = await apiClient.put(`${BASE}/${profileId}/current-status`, payload);
  return res.data;
};

// ── Step 18 — Additional Info ─────────────────────────────────────────────────

export const saveAdditionalInfo = async (
  profileId: number,
  data: ApiProfileAdditionalInfo
): Promise<ApiProfileDetail> => {
  const res = await apiClient.put(`${BASE}/${profileId}/additional-info`, data);
  return res.data;
};

// ── Read — Get All (Paginated) ────────────────────────────────────────────────

export const getAllProfiles = async (
  page = 0,
  size = 10,
  sortBy = 'createdAt',
  direction = 'desc'
): Promise<ApiPagedProfileResponse> => {
  const res = await apiClient.get(BASE, {
    params: { page, size, sortBy, direction },
  });
  return res.data;
};

// ── Read — Search ─────────────────────────────────────────────────────────────

export const searchProfiles = async (
  query: string,
  page = 0,
  size = 10
): Promise<ApiPagedProfileResponse> => {
  const res = await apiClient.get(`${BASE}/search`, {
    params: { query, page, size },
  });
  return res.data;
};

// ── Read — By Status ──────────────────────────────────────────────────────────

export const getProfilesByStatus = async (
  status: string,
  page = 0,
  size = 10
): Promise<ApiPagedProfileResponse> => {
  const res = await apiClient.get(`${BASE}/by-status`, {
    params: { status: up(status), page, size },   // Active → ACTIVE
  });
  return res.data;
};

// ── Read — By ID ──────────────────────────────────────────────────────────────

export const getProfileById = async (
  profileId: number
): Promise<ApiProfileDetail> => {
  const res = await apiClient.get(`${BASE}/${profileId}`);
  return res.data;
};

// ── Read — Step Statuses ──────────────────────────────────────────────────────

export const getStepStatuses = async (
  profileId: number
): Promise<ApiStepStatus[]> => {
  const res = await apiClient.get(`${BASE}/${profileId}/steps`);
  return res.data;
};

// ── Delete ────────────────────────────────────────────────────────────────────

export const deleteProfile = async (profileId: number): Promise<void> => {
  await apiClient.delete(`${BASE}/${profileId}`);
};
