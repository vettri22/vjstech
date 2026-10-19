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
  previewUrl: string; // Clearly identified website preview link
  projectUrl?: string; // Compatibility alias
  previewImage: string; // Project screenshot path
  coverImage?: string; // Compatibility alias
  galleryImages?: string[]; // Multiple screenshot previews
  gallery_images?: string[]; // Backend alias
  coverGradient: string;
  architectureHighlights: string[];
  completionDate?: string;
}

export const portfolioData: CaseStudy[] = [
  {
    id: '5f44f40b-a4e7-44e1-960e-76d1b4641836',
    slug: 'komudha-boutique-e-commerce-website',
    name: 'Komudha Boutique',
    title: 'Komudha Boutique',
    role: 'Full Stack Developer',
    category: 'Full-Stack Web Applications',
    shortDesc:
      'Komudha Boutique is a modern women’s fashion e-commerce website featuring an elegant UI, saree and ethnic-wear collections, mobile OTP authentication, product browsing, wishlist, shopping cart, and a seamless online shopping experience. Built with Flask, MySQL, and Razorpay integration.',
    fullDesc:
      'Komudha Boutique is a full-stack fashion e-commerce website designed to deliver an elegant and seamless online shopping experience. Featuring sarees, kurtis, lehengas, and gowns, the platform combines a modern, responsive UI with product browsing, mobile OTP authentication, wishlist, shopping cart, and online payment integration. Built using Python, Flask, MySQL, HTML, CSS, and JavaScript, the project focuses on user-friendly shopping, secure transactions, and efficient store management.',
    challenge:
      'Traditional boutique shopping often requires customers to visit physical stores or browse social media to discover fashion collections. Komudha Boutique addresses this challenge by providing a centralized online platform to explore sarees, kurtis, lehengas, and gowns.',
    solution:
      'Komudha Boutique was developed as a full-stack e-commerce platform using Python Flask for backend logic, MySQL for database management, and HTML, CSS, and JavaScript for an interactive frontend. The system features categorized product browsing, mobile OTP authentication, wishlist and cart functionality, Razorpay payment integration, and administrative product and order management. Its responsive design and modular structure provide a user-friendly shopping experience while allowing future enhancements.',
    results:
      "- Unified Shopping Experience: Integrated fashion categories into a centralized storefront.\n- Responsive UI: Designed a consistent interface for browsing across different screen sizes.\n- Database Integration: Used MySQL to organize and manage application data.\n- Backend Functionality: Implemented server-side application logic using Python and Flask.\n- Payment Readiness: Integrated Razorpay for online payment processing.\n- Maintainable Architecture: Structured the application to support future features and improvements.",
    technologies: ['Python', 'Flask', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Razorpay'],
    githubUrl: 'https://github.com/vettri22/FUTURE_FS_03.git',
    repoUrl: 'https://github.com/vettri22/FUTURE_FS_03.git',
    previewUrl: '',
    projectUrl: '',
    previewImage: '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398610269_0.png',
    coverImage: '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398610269_0.png',
    galleryImages: [
      '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398610269_0.png',
      '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623499_0.png',
      '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623506_1.png',
      '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623509_2.png',
      '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623512_3.png',
      '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623514_4.png',
    ],
    coverGradient: 'from-purple-950 via-slate-900 to-cyan-950',
    architectureHighlights: [
      'Modular Architecture: Flask-based backend separates application logic from the user interface.',
      'Responsive Frontend: HTML, CSS, and JavaScript deliver a consistent shopping experience across devices.',
      'Relational Database: MySQL organizes customer, product, and order data.',
      'Authentication: Mobile OTP-based login supports convenient account access.',
      'Payment Integration: Razorpay enables online payment processing.',
      'Scalable Design: Modular components support future enhancements, including AI-powered customer assistance and advanced store management.',
    ],
    completionDate: 'Delivered',
  },
  {
    id: '0dce8433-0aeb-47ea-8339-52b145800a1d',
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
    previewUrl: '',
    projectUrl: '',
    previewImage: '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483911_0.png',
    coverImage: '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483911_0.png',
    galleryImages: [
      '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483911_0.png',
      '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483916_1.png',
      '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483917_2.png',
    ],
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
    id: '5d0706c9-a1a8-43e3-a98f-295d0509d6aa',
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
    previewUrl: 'https://mineenergyai.onrender.com',
    projectUrl: 'https://mineenergyai.onrender.com',
    previewImage: '/uploads/portfolio/portfolio_5d0706c9-a1a8-43e3-a98f-295d0509d6aa_1792397512877_1.png',
    coverImage: '/uploads/portfolio/portfolio_5d0706c9-a1a8-43e3-a98f-295d0509d6aa_1792397512877_1.png',
    galleryImages: [
      '/uploads/portfolio/portfolio_5d0706c9-a1a8-43e3-a98f-295d0509d6aa_1792397512877_1.png',
      '/uploads/portfolio/portfolio_5d0706c9-a1a8-43e3-a98f-295d0509d6aa_1792397567494_0.png',
    ],
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
    id: 'a54090cb-59fe-46e3-960a-d683a7df6a71',
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
    previewUrl: 'https://neural-x.onrender.com',
    projectUrl: 'https://neural-x.onrender.com',
    previewImage: '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397529700_0.png',
    coverImage: '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397529700_0.png',
    galleryImages: [
      '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397529700_0.png',
      '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397662762_0.png',
      '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397662767_1.png',
    ],
    coverGradient: 'from-slate-950 via-purple-950 to-slate-900',
    architectureHighlights: [
      'Multi-stage machine learning heuristic model for phishing and malicious URL classification',
      'QR code forensic decoding module extracting raw bytecode and malicious payload redirect paths',
      'Automated EXIF forensic analyzer detecting image alteration, anomalies, and structural integrity',
      'Dynamic domain intelligence querying WHOIS records, SSL parameters, and DNS records',
    ],
    completionDate: 'Completed',
  },
];
