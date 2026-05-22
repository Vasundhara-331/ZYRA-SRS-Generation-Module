export interface Question {
  id: string;
  label: string;
  placeholder: string;
  description?: string;
  type: 'text' | 'textarea' | 'list';
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export const SRS_TEMPLATE: Section[] = [
  {
    id: 'introduction',
    title: '1. INTRODUCTION',
    questions: [
      {
        id: 'purpose',
        label: 'Purpose',
        placeholder: 'Define the purpose and target audience...',
        type: 'textarea',
      },
      {
        id: 'intended-audience',
        label: 'Intended Audience',
        placeholder: 'e.g., Web developers, project managers...',
        type: 'textarea',
      },
      {
        id: 'scope',
        label: 'Scope',
        placeholder: 'Briefly define the scope and objectives...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'overall-description',
    title: '2. OVERALL DESCRIPTION',
    questions: [
      {
        id: 'perspective',
        label: 'Product Perspective',
        placeholder: 'Is this a standalone product or part of a larger system?',
        type: 'textarea',
      },
      {
        id: 'functions',
        label: 'Product Functions',
        placeholder: 'List major functions of the software...',
        type: 'textarea',
      },
      {
        id: 'user-classes',
        label: 'User Classes and Characteristics',
        placeholder: 'Define the target user groups...',
        type: 'textarea',
      },
      {
        id: 'operating-environment',
        label: 'Operating Environment',
        placeholder: 'OS, hardware, and runtime requirements...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'system-features',
    title: '3. SYSTEM FEATURES',
    questions: [
      {
        id: 'feature-1',
        label: 'Functional Requirement 1',
        placeholder: 'Describe a core functional capability...',
        type: 'textarea',
      },
      {
        id: 'feature-2',
        label: 'Functional Requirement 2',
        placeholder: 'Describe another core functional capability...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'external-interface',
    title: '4. EXTERNAL INTERFACE REQUIREMENTS',
    questions: [
      {
        id: 'user-interfaces',
        label: 'User Interfaces',
        placeholder: 'Describe the UI stack and navigation details...',
        type: 'textarea',
      },
      {
        id: 'hardware-interfaces',
        label: 'Hardware Interfaces',
        placeholder: 'List any hardware requirements or integrations...',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'non-functional',
    title: '5. NON-FUNCTIONAL REQUIREMENTS',
    questions: [
      {
        id: 'performance',
        label: 'Performance Requirements',
        placeholder: 'Speed, responsiveness, and availability...',
        type: 'textarea',
      },
      {
        id: 'security',
        label: 'Security Requirements',
        placeholder: 'Authentication, encryption, and data protection...',
        type: 'textarea',
      },
    ],
  },
];
