export interface CaseStudy {
  id: string;
  slug: string;
  name: string; // Project name
  title: string; // Alias for name
  role: string; // Author's role from resume
  category: string;
  shortDesc: string;
  fullDesc: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: string[];
  githubUrl: string; // Official GitHub repository URL
  repoUrl?: string; // Compatibility alias
  previewUrl: string; // Clearly identified website preview link (empty initially for owner to fill in later)
  projectUrl?: string; // Compatibility alias
  previewImage: string; // Clearly identified project screenshot path (empty initially for owner to upload later)
  coverImage?: string; // Compatibility alias
  galleryImages?: string[]; // Multiple screenshot previews
  gallery_images?: string[]; // Backend alias
  coverGradient: string;
  architectureHighlights: string[];
  completionDate?: string;
}

export const portfolioData: CaseStudy[] = [
  {
    id: 'devbites',
    slug: 'devbites',
    name: 'DevBites',
    title: 'DevBites',
    role: 'Full Stack Developer',
    category: 'Full-Stack Web Applications',
    shortDesc:
      'A full-stack application for bite-sized developer learning and interactive quizzes, with XP and streak-based gamification, automated PDF certificate generation, an administrative panel, analytics dashboards, and a rule-based recommendation system.',
    fullDesc:
      'DevBites is a full-stack educational web application designed for developer micro-learning and interactive quizzes. The platform features an XP and streak-based gamification engine, automated on-demand PDF certificate generation, an administrative management panel, student performance analytics dashboards, and an intelligent rule-based recommendation system that personalizes learning progression.',
    challenge:
      'Designing an engaging developer micro-learning environment that balances fast interactive quizzes with streak gamification, dynamic PDF certificate generation on completion, and insightful instructor analytics without performance lag.',
    solution:
      'Architected a modular Python Flask backend with rule-based topic recommendation algorithms, Chart.js learning curve visualization, server-side PDF certificate compilation, and a responsive frontend dashboard.',
    results:
      'Delivered gamified XP and streak mechanics, automated on-demand PDF certificate generation, and an administrative analytics portal.',
    technologies: ['Python', 'Flask', 'Chart.js', 'PDF Generation', 'Gamification', 'REST APIs'],
    githubUrl: 'https://github.com/vettri22/devbites',
    repoUrl: 'https://github.com/vettri22/devbites',
    // Website preview URL: Leave empty until owner provides live link
    previewUrl: '',
    projectUrl: '',
    // Project screenshot: Direct image upload managed via Admin Portal
    previewImage: '',
    coverImage: '',
    coverGradient: 'from-purple-950 via-slate-900 to-cyan-950',
    architectureHighlights: [
      'Rule-based recommendation engine tailoring quizzes to individual progression',
      'Gamification subsystem tracking XP, levels, and consecutive day streaks',
      'Automated server-side PDF certificate generation and verification pipeline',
      'Interactive Chart.js analytics dashboard for administrative oversight',
    ],
    completionDate: 'Completed',
  },
  {
    id: 'mine-energy-ai',
    slug: 'mine-energy-ai',
    name: 'MineEnergyAI',
    title: 'MineEnergyAI',
    role: 'Full Stack & AI Developer',
    category: 'AI & Data Analytics',
    shortDesc:
      'An AI-assisted energy-management platform for iron ore mining operations. The project focuses on monitoring and analyzing energy consumption across crushers, conveyors, excavators, pumps, drills, and processing plants, with analytics and prediction-oriented functionality to support energy optimization.',
    fullDesc:
      'MineEnergyAI is an AI-assisted industrial energy-management platform specifically engineered for iron ore mining operations. It enables granular monitoring and analysis of electrical energy consumption across key machinery—crushers, conveyors, excavators, pumps, drills, and processing plants—providing analytical and prediction-oriented functionality to uncover power waste and support operational energy optimization.',
    challenge:
      'Heavy mining equipment displays erratic and massive energy consumption curves across varied shifts and ore densities. Identifying energy waste, peak demand surges, and mechanical anomalies requires continuous data modeling across disparate machinery.',
    solution:
      'Developed an AI/ML-driven analytics platform with Python and Flask that benchmarks equipment-specific baseline consumption, visualizes multi-tier power usage distributions, and applies predictive models to support proactive energy management.',
    results:
      'Delivered multi-equipment energy monitoring across 6 distinct machinery classes with automated outlier detection and predictive optimization analytics.',
    technologies: ['Python', 'Flask', 'AI/ML', 'Data Analytics', 'Prediction Models'],
    githubUrl: 'https://github.com/vettri22/MineEnergyAI',
    repoUrl: 'https://github.com/vettri22/MineEnergyAI',
    // Website preview URL: Leave empty until owner activates preview (Existing live website: https://mineenergyai.onrender.com)
    previewUrl: '',
    projectUrl: '',
    // Project screenshot: Direct image upload managed via Admin Portal
    previewImage: '',
    coverImage: '',
    coverGradient: 'from-cyan-950 via-slate-900 to-purple-950',
    architectureHighlights: [
      'Dedicated telemetry monitoring for crushers, conveyors, excavators, pumps, and drills',
      'AI/ML predictive models forecasting industrial energy consumption trends',
      'Interactive visual analytics tracking machine load profiles and peak power windows',
      'Data-driven recommendations to minimize energy waste in mining processing plants',
    ],
    completionDate: 'Completed',
  },
  {
    id: 'neural-x',
    slug: 'neural-x',
    name: 'Neural-X',
    title: 'Neural-X',
    role: 'Python & Web Developer',
    category: 'Cybersecurity & Machine Learning',
    shortDesc:
      'A cybersecurity-focused web platform integrating URL threat detection, QR code intelligence, image forensics, domain intelligence, automated PDF reporting, and security-dashboard features.',
    fullDesc:
      'Neural-X is a unified cybersecurity and threat intelligence web platform that consolidates essential threat-detection tools into a single operational interface. The system features machine learning-powered URL threat detection, QR code payload extraction and safety analysis, EXIF and structural image forensics, domain DNS/WHOIS intelligence, automated PDF audit reporting, and interactive visual security dashboards.',
    challenge:
      'Investigating modern multi-stage cyber threats requires switching between multiple fragmented utilities for URL scanning, QR analysis, image manipulation checks, and domain lookups, leading to slow incident response.',
    solution:
      'Constructed a multi-engine security workbench in Python and Flask utilizing machine learning models for URL risk classification, image forensic metadata parsing, QR code verification, domain intelligence gathering, and instant PDF report generation.',
    results:
      'Integrated 5 core threat analysis modules into a responsive, real-time security dashboard with automated PDF compliance reports.',
    technologies: ['Python', 'Flask', 'Machine Learning', 'Chart.js', 'Threat Detection', 'Image Forensics'],
    githubUrl: 'https://github.com/vettri22/neural-x',
    repoUrl: 'https://github.com/vettri22/neural-x',
    // Website preview URL: Leave empty until owner provides live link
    previewUrl: '',
    projectUrl: '',
    // Project screenshot: Direct image upload managed via Admin Portal
    previewImage: '',
    coverImage: '',
    coverGradient: 'from-slate-950 via-purple-950 to-slate-900',
    architectureHighlights: [
      'Machine learning URL threat classifier detecting malicious heuristics and phishing',
      'QR code intelligence analyzer parsing nested redirects and payload safety',
      'Image forensics module checking metadata integrity and tampering markers',
      'Automated PDF security incident dossiers and real-time Chart.js visual telemetry',
    ],
    completionDate: 'Completed',
  },
];
