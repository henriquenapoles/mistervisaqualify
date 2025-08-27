export interface LeadFormData {
  // Mission
  objective?: string;
  objectiveDetail?: string;
  capital?: string;
  
  // Personal Info
  fullName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  country?: string;
  countryDetail?: string;
  
  // Family
  maritalStatus?: string;
  spouseName?: string;
  spouseAge?: string;
  spouseProfession?: string;
  children?: Array<{
    name: string;
    age: number;
  }>;
  citizenship?: string;
  citizenshipDetail?: string;
  
  // Education
  education?: string;
  graduationYear?: number;
  institution?: string;
  fieldOfStudy?: string;
  certifications?: string;
  englishLevel?: string;
  
  // Experience
  experience?: string;
  currentPosition?: string;
  hasLeadership?: string;
  leadershipDetail?: string;
  hasRecognition?: string;
  recognitionDetail?: string;
  
  // US Connections
  familyInUS?: string;
  jobOffer?: string;
  companyTransfer?: string;
  
  // Source
  howFoundUs?: string;
  howFoundUsDetail?: string;
  
  // Index signature for dynamic access
  [key: string]: any;
}

export interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: 'single-choice' | 'form-fields' | 'multiple-choice';
  icon: string;
  options?: Option[];
  fields?: FormField[];
  questions?: SubQuestion[];
}

export interface Option {
  value: string;
  label: string;
  icon?: string;
  score: number;
  hasInput?: boolean;
  hasForm?: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
    hasInput?: boolean;
  }>;
}

export interface SubQuestion {
  id: string;
  label: string;
  options: Option[];
}

export interface VisaRecommendation {
  name: string;
  description: string;
  icon: string;
}
