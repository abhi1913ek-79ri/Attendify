// subjectConfig.js
// Keep the legacy SUBJECTS array (codes) for any existing logic that uses it (e.g., createEmptyAttendance)
export const SUBJECTS = ['DBMS', 'OS', 'DSA', 'CN', 'Maths', 'AI', 'ML'];

// New: canonical catalog of subjects with human-friendly names and short codes
export const SUBJECT_CATALOG = [
	{ code: 'ICT311', name: 'Artificial Intelligence' },
	{ code: 'ICT301', name: 'Digital Signal Processing' },
	{ code: 'ICT303', name: 'Compiler Design' },
	{ code: 'ITE329', name: 'System Analysis and Design' },
	{ code: 'ITE301', name: 'Statistics, Statistical Modelling & Data Analytics' },
	{ code: 'ITE311', name: 'Software Measurements, Metrics, and Modelling' },
	{ code: 'MS307', name: 'Entrepreneurship Mindset' },
	{ code: 'HS305', name: 'Elements of Indian History for Engineers*' },
];

// Derived helpers
export const SUBJECT_NAMES = SUBJECT_CATALOG.map(s => s.name);
export const SUBJECT_CODES = SUBJECT_CATALOG.map(s => s.code);
export const NAME_TO_CODE = SUBJECT_CATALOG.reduce((acc, s) => { acc[s.name] = s.code; return acc; }, {});
export const CODE_TO_NAME = SUBJECT_CATALOG.reduce((acc, s) => { acc[s.code] = s.name; return acc; }, {});
