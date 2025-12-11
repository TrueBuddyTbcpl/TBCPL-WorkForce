// types/report.types.ts
export interface ReportData {
  header: {
    title: string;
    subtitle: string;
    preparedFor: string;
    preparedBy: string;
    date: string;
    clientLogo?: string;
  };
  tableOfContents: string[];
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  type: 'table' | 'narrative' | 'mixed' | 'custom-table';
  content: TableContent | NarrativeContent | MixedContent | CustomTableContent;
  images?: string[]; // Add images array
}

export interface TableContent {
  columns: string[];
  rows: Record<string, string>[];
}

export interface NarrativeContent {
  text: string;
}

export interface MixedContent {
  items: (TableContent | NarrativeContent)[];
}

// New type for custom row-column table
export interface CustomTableContent {
  columnCount: number;
  columnHeaders: string[];
  rows: string[][];
}

export interface FormStepProps {
  onNext: (data: Partial<ReportData>) => void;
  onBack?: () => void;
  initialData?: Partial<ReportData>;
}

export interface SectionFormData {
  title: string;
  type: 'table' | 'narrative' | 'mixed' | 'custom-table';
  tableColumns?: string[];
  tableRows?: Record<string, string>[];
  narrativeText?: string;
  customTableColumnCount?: number;
  customTableHeaders?: string[];
  customTableRows?: string[][];
}
