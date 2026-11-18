export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  liveUrl: string;
  displayUrl: string;
  bullets: string[];
  tech: string[];
}

export interface StatItem {
  value: string;
  label: string;
  detail: string;
}

export interface RecordEntry {
  id: string;
  period: string;
  title: string;
  organization: string;
  category: 'Experience' | 'Education' | 'Competitions & Workshops';
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface PrincipleItem {
  number: string;
  title: string;
  description: string;
}

export const RESUME_PROFILE = {
  name: 'Ashrafi Islam',
  firstName: 'Ashrafi',
  role: 'Student · Web Developer',
  city: 'Dhaka, Bangladesh',
  email: 'heyash247@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/ashrafi142',
  linkedinDisplay: 'linkedin.com/in/ashrafi142',
  headshotSrc: '/assets/aistudio/Ashrafi_c229f8d9.png',
  heroBio:
    'Building responsive Next.js and React web applications from Figma design to deployment, backed by hands-on UI and API debugging.',
  aboutParagraphs: [
    'I am Ashrafi Islam, a web developer and Electrical and Electronic Engineering undergraduate at the University of Asia Pacific in Dhaka, Bangladesh (CGPA 4.89, Dean’s List Spring 2024). I build responsive, SEO-friendly interfaces with HTML, CSS, JavaScript, React, Next.js, and Tailwind CSS, taking projects cleanly from layout design to production deployment.',
    'Beyond web development, I serve in youth leadership and civic coordination roles across Narayanganj with Youth Ending Hunger, Youth Lead Global, and SERAC - Bangladesh. Fluent in Bangla and Hindi with basic English, I combine structured problem solving, Git version control, and reliable team coordination.',
  ],
};

export const HERO_STATS: StatItem[] = [
  {
    value: '6',
    label: 'Web projects shipped',
    detail: 'Next.js builds & live e-commerce fixes',
  },
  {
    value: '4.89',
    label: 'B.Sc. EEE CGPA',
    detail: 'University of Asia Pacific · Dean’s List',
  },
  {
    value: '4',
    label: 'Leadership & volunteer roles',
    detail: 'Youth Ending Hunger, Youth Lead Global & SERAC',
  },
];

export const WORK_STATS: StatItem[] = [
  {
    value: '6',
    label: 'Production sites',
    detail: 'Across e-commerce, agencies & real estate',
  },
  {
    value: '5',
    label: 'Next.js + Tailwind builds',
    detail: 'From Figma translation to live deployment',
  },
  {
    value: '5.00',
    label: 'HSC GPA (DMRC)',
    detail: 'Strong academic & analytical foundation',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'growth-analyze',
    title: 'Growth Analyze',
    category: 'B2B eCommerce Platform',
    liveUrl: 'https://growthanalyze.com',
    displayUrl: 'growthanalyze.com',
    bullets: [
      'Developed a full-scale B2B eCommerce platform from Figma design to deployment.',
      'Engineered responsive layouts across desktop and mobile using Next.js and Tailwind CSS.',
      'Optimized frontend performance for fast loading and clean product navigation.',
      'Delivered a seamless end-to-end user experience tailored to B2B workflows.',
    ],
    tech: ['Next.js', 'Tailwind CSS', 'Figma to Code', 'Responsive Design'],
  },
  {
    id: 'skilify-tech',
    title: 'Skilify Tech',
    category: 'Creative Agency Website',
    liveUrl: 'https://skilifytech.com',
    displayUrl: 'skilifytech.com',
    bullets: [
      'Developed a fully responsive, multi-page creative agency website using Next.js and Tailwind CSS.',
      'Built dynamic service pages paired with animated hero sections and clean UI/UX.',
      'Structured scalable routing and reusable components across all agency views.',
      'Implemented SEO-friendly markup and fast page speed optimization.',
    ],
    tech: ['Next.js', 'Tailwind CSS', 'UI/UX', 'SEO-friendly'],
  },
  {
    id: 'rajdhani-rasturant',
    title: 'Rajdhani Rasturant',
    category: 'Restaurant Ordering & Reservations',
    liveUrl: 'https://rajdhanirasturant.com',
    displayUrl: 'rajdhanirasturant.com',
    bullets: [
      'Developed a full-featured restaurant ordering and reservation platform for Rajdhani Restaurant.',
      'Built dynamic menu browsing alongside an interactive custom package builder.',
      'Implemented online table booking workflows and a customer review system.',
      'Styled a responsive, mobile-first interface with Next.js and Tailwind CSS.',
    ],
    tech: ['Next.js', 'Tailwind CSS', 'Mobile-first', 'UI Layout'],
  },
  {
    id: 'proyojon-abashon',
    title: 'Proyojon-Abashon',
    category: 'Real Estate & Land-Share Platform',
    liveUrl: 'https://proyojon-abashon.vercel.app',
    displayUrl: 'proyojon-abashon.vercel.app',
    bullets: [
      'Developed a responsive real estate and land-share management platform for Bangladesh.',
      'Built structured property listings paired with location-based search.',
      'Implemented an inquiry system serving buyers, sellers, and renters.',
      'Crafted accessible responsive layouts using Next.js and Tailwind CSS.',
    ],
    tech: ['Next.js', 'Tailwind CSS', 'Responsive Design', 'Vercel'],
  },
  {
    id: 'buildmvp-agency',
    title: 'BuildMVP Agency',
    category: 'MVP-Focused Agency Site',
    liveUrl: 'https://buildmvp.agency',
    displayUrl: 'buildmvp.agency',
    bullets: [
      'Developed a responsive, high-performance website using Next.js and Tailwind CSS.',
      'Translated product designs into a clean, cohesive user experience.',
      'Structured page layouts specifically around BuildMVP’s MVP-focused services.',
      'Tuned layout responsiveness and page speed across screen sizes.',
    ],
    tech: ['Next.js', 'Tailwind CSS', 'Page Speed', 'Layout Design'],
  },
  {
    id: 'lavogos',
    title: 'Lavogos',
    category: 'Live E-Commerce Debugging',
    liveUrl: 'https://lavogos.com',
    displayUrl: 'Lavogos.com',
    bullets: [
      'Debugged and fixed multiple front-end UI and layout issues on La Vogos’s live e-commerce site.',
      'Diagnosed and resolved back-end server and API bugs affecting storefront behavior.',
      'Restored smooth, reliable product browsing across devices.',
      'Verified uninterrupted order processing flows for end users.',
    ],
    tech: ['UI Debugging', 'Server & API Fixes', 'Browser DevTools', 'Git'],
  },
];

export const STACK_TOOLS: string[] = [
  'HTML',
  'CSS',
  'JavaScript',
  'React.js',
  'Next.js',
  'Redux',
  'Tailwind CSS',
  'MongoDB',
  'Git',
  'GitHub',
  'VS Code',
  'Browser DevTools',
  'Responsive Design',
  'Mobile-first Design',
  'Page Speed Optimization',
  'SEO-friendly Development',
  'Template & Layout Design',
  'MS Word & MS Excel',
];

export const RECORD_TIMELINE: RecordEntry[] = [
  {
    id: 'uap-bsc',
    period: '2024 – On going',
    title: 'B.Sc. in Electrical and Electronic Engineering',
    organization: 'University of Asia Pacific (UAP)',
    category: 'Education',
    highlights: [
      'CGPA 4.89 (2nd year running).',
      'Placed on the Dean’s List of Meritorious Students in Spring Semester 2024.',
    ],
  },
  {
    id: 'yeh-facilitator',
    period: 'September 2024 – Present',
    title: 'Facilitator',
    organization: 'Youth Ending Hunger Narayanganj',
    category: 'Experience',
    highlights: [
      'Facilitating youth training sessions, community workshops, and civic engagement activities.',
    ],
  },
  {
    id: 'ylg-coordinator',
    period: 'June 2024 – Present',
    title: 'Narayanganj District Coordinator',
    organization: 'Youth Lead Global',
    category: 'Experience',
    highlights: [
      'Coordinating district-level youth initiatives, volunteer communication, and program execution.',
    ],
  },
  {
    id: 'beo-2024',
    period: '1 May – 30 June 2024',
    title: 'Organizer & Volunteer',
    organization: 'Bangladesh Economics Olympiad 2024',
    category: 'Competitions & Workshops',
    highlights: [
      'Worked as an Organizer and Volunteer supporting competition logistics and participant coordination.',
    ],
  },
  {
    id: 'e-olympiad',
    period: '2024',
    title: 'Champion — E-Olympiad 1.0',
    organization: 'Save The Student',
    category: 'Competitions & Workshops',
    highlights: [
      'Won Champion title in the “E-Olympiad 1.0 by Save The Student” competition.',
    ],
  },
  {
    id: 'serac-volunteer',
    period: 'November 2023 – March 2025',
    title: 'Volunteer',
    organization: 'SERAC - Bangladesh',
    category: 'Experience',
    highlights: [
      'Supported community outreach, awareness campaigns, and youth-led organizational initiatives.',
    ],
  },
  {
    id: 'yeh-secretary',
    period: 'September 2022 – April 2025',
    title: 'Workshop Secretary',
    organization: 'Youth Ending Hunger Narayanganj',
    category: 'Experience',
    highlights: [
      'Planned and coordinated regional workshops, training schedules, and participant operations.',
    ],
  },
  {
    id: 'dmrc-hsc',
    period: '2021 – 2022',
    title: 'Higher School Certificate (HSC – 23)',
    organization: 'Dr. Mahbubur Rahman Mollah College',
    category: 'Education',
    highlights: [
      'Graduated with GPA 5.00.',
      'Certified participant in “DMRC Science Festival 2.0” organized by DMRC Science Club (DMRCSC).',
    ],
  },
  {
    id: 'workshops-training',
    period: 'Leadership & Training',
    title: 'Workshops, Civic Programs & Certifications',
    organization: 'British Council, The Hunger Project, 10 Billion Strong, The Earth & Muktopaath',
    category: 'Competitions & Workshops',
    highlights: [
      '13th Youth Activist Training (ToF) & Vision, Commitment & Action Workshop (The Hunger Project & Youth Ending Hunger).',
      'LEAD Project Volunteer (British Council & The Hunger Project) & Green Leaders Academy Training (10 Billion Strong).',
      'Clean Air Act and Renewable Energy Workshop (The Earth) & Democracy Olympiad Voter Awareness Volunteer.',
      'Inter School Science Fair 2020 Awardee & National Girl Child Day 2016 Essay Awardee.',
      'Muktopaath Certificates: MS Word & MS Excel Basic, Digital Security Campaign, and Email Etiquette.',
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Web Development',
    items: ['HTML', 'CSS', 'JavaScript', 'Responsive & Mobile-first Design'],
  },
  {
    category: 'Frameworks & Libraries',
    items: ['Next.js', 'React.js', 'Redux', 'Tailwind CSS'],
  },
  {
    category: 'Database & Tooling',
    items: ['MongoDB', 'Git & GitHub', 'VS Code', 'Browser DevTools'],
  },
  {
    category: 'Performance & Design',
    items: ['Page Speed Optimization', 'SEO-friendly Development', 'Template & Layout Design'],
  },
  {
    category: 'Core Strengths & Languages',
    items: [
      'Project Management',
      'Coordination',
      'Presentation Skill',
      'Critical Thinking',
      'Data Entry',
      'Bangla (Fluent)',
      'Hindi (Fluent)',
      'English (Basic)',
    ],
  },
];

export const PRINCIPLES: PrincipleItem[] = [
  {
    number: '01',
    title: 'Mobile-First Structure',
    description:
      'Every interface starts with responsive, mobile-first layout discipline so pages stay crisp across phones and wide screens.',
  },
  {
    number: '02',
    title: 'Speed & Search Readiness',
    description:
      'Clean semantic structure, reusable Next.js components, and page speed optimization are built in from the first commit.',
  },
  {
    number: '03',
    title: 'Root-Cause Debugging',
    description:
      'From subtle UI layout issues to server and API regressions on live storefronts, trace the source and ship verified fixes.',
  },
  {
    number: '04',
    title: 'Disciplined Coordination',
    description:
      'Use clear Git workflows, organized planning, and steady communication to keep projects moving smoothly.',
  },
];
