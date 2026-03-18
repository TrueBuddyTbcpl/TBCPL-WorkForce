import type { ApiProfileDetail } from '../../../../services/api/profileApi';

// ─── Helpers ───────────────────────────────────────────────────────────────

const cast = <T>(val: string | undefined): T | undefined =>
  val as T | undefined;

// ─── Mappers ────────────────────────────────────────────────────────────────

export const mapToPersonalInfo = (d?: ApiProfileDetail) => {
  if (!d?.personalInfo) return undefined;
  const p = d.personalInfo;
  return {
    firstName:    p.firstName,
    lastName:     p.lastName,
    middleName:   p.middleName,
    gender:       cast<'Male' | 'Female' | 'Other'>(p.gender),
    dateOfBirth:  p.dateOfBirth,
    nationality:  p.nationality,
    profilePhoto: p.profilePhoto,
  };
};


export const mapToAddress = (d?: ApiProfileDetail) => {
  if (!d?.address) return undefined;
  return { ...d.address };
};

export const mapToContactInfo = (d?: ApiProfileDetail) => {
  if (!d?.contactInfo) return undefined;
  return { ...d.contactInfo };
};

export const mapToIdentificationDocs = (d?: ApiProfileDetail) => {
  if (!d?.identificationDocs) return undefined;
  return { ...d.identificationDocs };
};

export const mapToBusinessActivities = (d?: ApiProfileDetail) => {
  if (!d?.businessActivities) return undefined;
  const b = d.businessActivities;
  return {
    retailerStatus:     cast<'Individual' | 'Entity'>(b.retailerStatus),
    retailerType:       cast<'Authorized' | 'Unauthorized'>(b.retailerType),
    supplierStatus:     cast<'Individual' | 'Entity'>(b.supplierStatus),
    supplierType:       cast<'Authorized' | 'Unauthorized'>(b.supplierType),
    manufacturerStatus: cast<'Individual' | 'Entity'>(b.manufacturerStatus),
    manufacturerType:   cast<'Authorized' | 'Unauthorized'>(b.manufacturerType),
  };
};

export const mapToEntityOrganization = (d?: ApiProfileDetail) => {
  if (!d?.associatedCompanies) return undefined;
  return {
    associatedCompanies: (d.associatedCompanies ?? []).map(c => ({
      companyName:        c.companyName,
      relationshipNature: c.relationshipNature ?? '',
      details:            c.details,
    })),
  };
};

export const mapToGeographicExposure = (d?: ApiProfileDetail) => {
  if (!d?.geographicExposure) return undefined;
  return { ...d.geographicExposure };
};

export const mapToRelatedFIRs = (d?: ApiProfileDetail) => {
  if (!d?.firs) return undefined;
  return {
    firs: (d.firs ?? []).map(f => ({
      firNumber:      f.firNumber ?? '',
      caseNumber:     f.caseNumber,
      sections:       f.sections,
      dateRegistered: f.dateRegistered,
      status:         f.status,
    })),
  };
};

export const mapToMaterialSeized = (d?: ApiProfileDetail) => {
  if (!d?.materialSeized) return undefined;
  return {
    materialSeized: (d.materialSeized ?? []).map(m => ({
      id:                   m.id?.toString(),
      brandName:            m.brandName,
      company:              m.company,
      quantity:             m.quantity,
      location:             m.location,
      raidingAuthority:     cast<'N_A' | 'Agriculture' | 'Police' | 'Wing' | 'Other'>(m.raidingAuthority),
      raidingAuthorityOther: m.raidingAuthorityOther,
      dateSeized:           m.dateSeized,
    })),
  };
};

export const mapToAssets = (d?: ApiProfileDetail) => {
  if (!d?.vehicles) return undefined;
  return {
    vehicles: (d.vehicles ?? []).map(v => ({
      id:                 v.id?.toString(),
      make:               v.make,
      model:              v.model,
      registrationNumber: v.registrationNumber,
      ownershipType:      cast<'N_A' | 'Owned' | 'Leased' | 'Unknown'>(v.ownershipType),
    })),
  };
};

export const mapToKnownAssociates = (d?: ApiProfileDetail) => {
  if (!d?.knownAssociates) return undefined;
  return {
    knownAssociates: (d.knownAssociates ?? []).map(a => ({
      id:          a.id?.toString(),
      name:        a.name,
      relationship: a.relationship,
      role:        cast<'N_A' | 'Associate' | 'Employee' | 'Family'>(a.role),
      contactInfo: a.contactInfo,
      notes:       a.notes,
    })),
  };
};

export const mapToKnownEmployees = (d?: ApiProfileDetail) => {
  if (!d?.knownEmployees) return undefined;
  return {
    knownEmployees: (d.knownEmployees ?? []).map(e => ({
      id:          e.id?.toString(),
      name:        e.name,
      relationship: e.relationship,
      role:        cast<'N_A' | 'Associate' | 'Employee' | 'Family'>(e.role),
      contactInfo: e.contactInfo,
      notes:       e.notes,
    })),
  };
};

export const mapToProductsOperations = (d?: ApiProfileDetail) => {
  if (!d?.productsOperations) return undefined;
  return { ...d.productsOperations };
};

export const mapToFamilyBackground = (d?: ApiProfileDetail) => {
  if (!d?.familyBackground) return undefined;
  const f = d.familyBackground;
  return {
    fatherName:       f.fatherName,
    fatherOccupation: f.fatherOccupation,
    fatherContact:    f.fatherContact,
    motherName:       f.motherName,
    motherOccupation: f.motherOccupation,
    motherContact:    f.motherContact,
    siblings: (f.siblings ?? []).map(s => ({
      name:         s.name,
      relationship: s.relationship ?? '',
      occupation:   s.occupation,
    })),
  };
};

export const mapToInfluentialLinks = (d?: ApiProfileDetail) => {
  if (!d?.influentialLinks) return undefined;
  return {
    influentialLinks: (d.influentialLinks ?? []).map(l => ({
      personName:   l.personName,
      relationship: l.relationship ?? '',
      profile:      l.profile ?? '',
    })),
  };
};

export const mapToCurrentStatus = (d?: ApiProfileDetail) => {
  if (!d?.currentStatus) return undefined;
  const s = d.currentStatus;
  return {
    status:            cast<'Active' | 'Inactive' | 'Arrested' | 'Absconding' | 'Unknown'>(s.status),
    lastKnownLocation: s.lastKnownLocation,
    statusDate:        s.statusDate,
    remarks:           s.remarks,
  };
};

export const mapToAdditionalInfo = (d?: ApiProfileDetail) => {
  if (!d?.additionalInfo) return undefined;
  return { ...d.additionalInfo };
};
