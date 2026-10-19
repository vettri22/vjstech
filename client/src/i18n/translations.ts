export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  nav: {
    home: string;
    services: string;
    work: string;
    about: string;
    team: string;
    process: string;
    contact: string;
    clientLogin: string;
    clientPortal: string;
    getQuote: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stackTitle: string;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    viewAll: string;
    exploreService: string;
    deliverables: string;
  };
  team: {
    badge: string;
    title: string;
    subtitle: string;
    assignedResponsibilities: string;
    skills: string;
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    step1: string;
    step1Desc: string;
    step2: string;
    step2Desc: string;
    step3: string;
    step3Desc: string;
    step4: string;
    step4Desc: string;
    step5: string;
    step5Desc: string;
    step6: string;
    step6Desc: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    fullName: string;
    email: string;
    phone: string;
    organization: string;
    clientCategory: string;
    serviceRequired: string;
    projectTitle: string;
    projectDescription: string;
    budgetRange: string;
    desiredTimeline: string;
    preferredContact: string;
    additionalNotes: string;
    privacyConsent: string;
    submitButton: string;
    submitting: string;
    directWhatsApp: string;
    directEmail: string;
  };
  footer: {
    tagline: string;
    companyDesc: string;
    servicesHeading: string;
    companyHeading: string;
    contactHeading: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePolicy: string;
    refundPolicy: string;
    allRightsReserved: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      work: 'Work',
      about: 'About',
      team: 'Team',
      process: 'Process',
      contact: 'Contact',
      clientLogin: 'Client Login',
      clientPortal: 'Portal',
      getQuote: 'Get a Quote',
    },
    hero: {
      badge: 'Freelance Software Solutions Agency • India',
      headline: 'Software built around your next big idea.',
      subheadline:
        'VJS TECH helps individuals, startups, and businesses turn ideas into thoughtfully designed digital products — from websites and web applications to automation and AI-powered solutions.',
      ctaPrimary: 'Discuss Your Project',
      ctaSecondary: 'Explore Our Work',
      stackTitle: 'Architected for Resilience & Scale',
    },
    services: {
      sectionTitle: 'Technical Capabilities',
      sectionSubtitle:
        'End-to-end software engineering, architecture, and UI/UX design tailored specifically to your project requirements.',
      viewAll: 'Explore All 11 Services',
      exploreService: 'View Service Details',
      deliverables: 'Key Deliverables',
    },
    team: {
      badge: 'Engineering & Delivery',
      title: 'Our Team',
      subtitle:
        'Meet the core software solutions team driving architecture, interface design, backend systems, database operations, and quality engineering.',
      assignedResponsibilities: 'Assigned Responsibilities',
      skills: 'Core Focus Areas',
    },
    process: {
      badge: 'Transparent Delivery',
      title: 'How We Work',
      subtitle: 'A disciplined, milestone-based engineering approach from initial discovery to production handover.',
      step1: '1. Discovery & Requirements',
      step1Desc: 'We analyze your business objectives, target audience, technical constraints, and project scope.',
      step2: '2. Scope & Technical Proposal',
      step2Desc: 'Clear milestone breakdown, architecture recommendations, transparent timelines, and fixed quotations.',
      step3: '3. UI/UX & System Architecture',
      step3Desc: 'User journeys, wireframes, database schema design, and interactive responsive design tokens.',
      step4: '4. Full-Stack Development',
      step4Desc: 'Clean, modular implementation with modern frameworks, parameterized data access, and automated tests.',
      step5: '5. Testing, Security & Review',
      step5Desc: 'Comprehensive cross-device testing, authorization verification, WCAG accessibility checks, and staging review.',
      step6: '6. Deployment & Handover',
      step6Desc: 'Production deployment, environment configuration, database migration verification, and complete documentation handover.',
    },
    contact: {
      badge: 'Start a Conversation',
      title: 'Discuss Your Next Project',
      subtitle:
        'Tell us what you want to build. We will review your technical requirements and respond with a structured project discussion.',
      fullName: 'Full Name *',
      email: 'Email Address *',
      phone: 'WhatsApp / Phone Number (Optional)',
      organization: 'Company or Institution (Optional)',
      clientCategory: 'Client Category *',
      serviceRequired: 'Services Required * (Select all that apply)',
      projectTitle: 'Project Name / One-Line Summary *',
      projectDescription: 'Project Description & Objectives *',
      budgetRange: 'Expected Budget Range (Optional)',
      desiredTimeline: 'Desired Timeline (Optional)',
      preferredContact: 'Preferred Contact Method *',
      additionalNotes: 'Additional Requirements or Technical Notes',
      privacyConsent: 'I acknowledge that my submitted details will be processed in accordance with the Privacy Policy.',
      submitButton: 'Submit Project Enquiry',
      submitting: 'Submitting Enquiry...',
      directWhatsApp: 'Chat on WhatsApp',
      directEmail: 'Email Directly',
    },
    footer: {
      tagline: 'Ideas to Intelligent Software.',
      companyDesc:
        'VJS TECH is a freelance software solutions agency based in India. We engineer purposeful web applications, custom digital tools, and scalable software architectures.',
      servicesHeading: 'Services',
      companyHeading: 'Company',
      contactHeading: 'Direct Contact',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
      refundPolicy: 'Refund & Cancellation',
      allRightsReserved: 'All rights reserved.',
    },
  },

  ta: {
    nav: {
      home: 'முகப்பு',
      services: 'சேவைகள்',
      work: 'பணிகள்',
      about: 'எங்களை பற்றி',
      team: 'குழு',
      process: 'செயல்முறை',
      contact: 'தொடர்பு',
      clientLogin: 'வாடிக்கையாளர் உள்நுழைவு',
      clientPortal: 'போர்டல்',
      getQuote: 'திட்டம் தொடங்க',
    },
    hero: {
      badge: 'மென்பொருள் தீர்வுகள் நிறுவனம் • இந்தியா',
      headline: 'உங்கள் அடுத்த பெரிய யோசனைக்கான மென்பொருள் வடிவமைப்பு.',
      subheadline:
        'வலைத்தளங்கள், வலை பயன்பாடுகள் முதல் ஆட்டோமேஷன் மற்றும் செயற்கை நுண்ணறிவு தீர்வுகள் வரை உங்கள் யோசனைகளை தரமான டிஜிட்டல் தயாரிப்புகளாக VJS TECH உருவாக்குகிறது.',
      ctaPrimary: 'உங்கள் திட்டத்தை விவாதிக்க',
      ctaSecondary: 'எங்கள் பணிகளை ஆராயுங்கள்',
      stackTitle: 'உறுதியான மற்றும் அளவிடக்கூடிய கட்டமைப்பு',
    },
    services: {
      sectionTitle: 'தொழில்நுட்ப திறன்கள்',
      sectionSubtitle:
        'உங்கள் திட்டத் தேவைகளுக்கேற்ப வடிவமைக்கப்பட்ட விரிவான மென்பொருள் பொறியியல் மற்றும் UI/UX வடிவமைப்பு.',
      viewAll: 'அனைத்து 11 சேவைகளையும் பார்க்க',
      exploreService: 'சேவை விவரங்கள்',
      deliverables: 'வழங்கப்படும் அம்சங்கள்',
    },
    team: {
      badge: 'பொறியியல் & விநியோகம்',
      title: 'எங்கள் குழு',
      subtitle:
        'மென்பொருள் கட்டமைப்பு, பயனர் இடைமுகம், பின்தள அமைப்புகள், தரவுத்தளம் மற்றும் தர உறுதிப்பாட்டை வழிநடத்தும் எங்கள் முதன்மை குழுவை சந்தியுங்கள்.',
      assignedResponsibilities: 'ஒதுக்கப்பட்ட பொறுப்புகள்',
      skills: 'முதன்மை திறன்கள்',
    },
    process: {
      badge: 'வெளிப்படையான செயல்முறை',
      title: 'நாங்கள் எவ்வாறு செயல்படுகிறோம்',
      subtitle: 'ஆரம்ப திட்டமிடல் முதல் உற்பத்தி பயன்பாடு வரை ஒழுங்குபடுத்தப்பட்ட விநியோக கட்டமைப்பு.',
      step1: '1. தேவைகள் மற்றும் பகுப்பாய்வு',
      step1Desc: 'உங்கள் வணிக இலக்குகள் மற்றும் தொழில்நுட்ப தேவைகளை விரிவாக ஆராய்கிறோம்.',
      step2: '2. திட்ட வரைவு & முன்மொழிவு',
      step2Desc: 'தெளிவான மைல்கற்கள், தொழில்நுட்ப பரிந்துரைகள் மற்றும் வெளிப்படையான காலவரிசை.',
      step3: '3. UI/UX & கணினி கட்டமைப்பு',
      step3Desc: 'பயனர் பயணங்கள், கம்பி வடிவமைப்பு மற்றும் நவீன வடிவமைப்பு கூறுகள்.',
      step4: '4. முழுமையான வளர்ச்சி',
      step4Desc: 'நவீன கட்டமைப்புகளுடன் தூய்மையான மற்றும் அளவிடக்கூடிய குறியீட்டு உருவாக்கம்.',
      step5: '5. சோதனை & பாதுகாப்பு ஆய்வு',
      step5Desc: 'விரிவான பாதுகாப்பு ஆய்வுகள் மற்றும் தர உறுதிப்பாடு சோதனைகள்.',
      step6: '6. வெளியீடு & ஆவணங்கள் ஒப்படைப்பு',
      step6Desc: 'நேரடி சேவையக பயன்பாடு மற்றும் முழுமையான திட்ட ஆவணங்கள் ஒப்படைப்பு.',
    },
    contact: {
      badge: 'தொடர்பு கொள்ளுங்கள்',
      title: 'உங்கள் அடுத்த திட்டத்தை விவாதிக்கவும்',
      subtitle: 'நீங்கள் உருவாக்க விரும்பும் திட்டத்தை பகிருங்கள். நாங்கள் ஆய்வு செய்து வழிகாட்டுகிறோம்.',
      fullName: 'முழு பெயர் *',
      email: 'மின்னஞ்சல் முகவரி *',
      phone: 'வாட்ஸ்அப் / தொலைபேசி எண் (விருப்பத்தேர்வு)',
      organization: 'நிறுவனம் / கல்வி நிறுவனம் (விருப்பத்தேர்வு)',
      clientCategory: 'பிரிவு *',
      serviceRequired: 'தேவையான சேவைகள் *',
      projectTitle: 'திட்டத்தின் தலைப்பு *',
      projectDescription: 'திட்டத்தின் விளக்கம் & தேவைகள் *',
      budgetRange: 'மதிப்பிடப்பட்ட நிதி அளவு (விருப்பத்தேர்வு)',
      desiredTimeline: 'எதிர்பார்க்கப்படும் கால அளவு (விருப்பத்தேர்வு)',
      preferredContact: 'விரும்பும் தொடர்பு முறை *',
      additionalNotes: 'கூடுதல் குறிப்புகள்',
      privacyConsent: 'தனியுரிமைக் கொள்கையின்படி எனது விவரங்கள் செயலாக்கப்படுவதை ஒப்புக்கொள்கிறேன்.',
      submitButton: 'திட்ட விசாரணையை சமர்ப்பிக்கவும்',
      submitting: 'சமர்ப்பிக்கப்படுகிறது...',
      directWhatsApp: 'வாட்ஸ்அப்பில் உரையாட',
      directEmail: 'மின்னஞ்சல் அனுப்ப',
    },
    footer: {
      tagline: 'யோசனைகள் முதல் நுண்ணறிவு மென்பொருள் வரை.',
      companyDesc:
        'VJS TECH என்பது இந்தியாவில் உள்ள ஒரு சுயாதீன மென்பொருள் தீர்வுகள் நிறுவனம் ஆகும். நாங்கள் தரமான வலை பயன்பாடுகள் மற்றும் தனிப்பயன் டிஜிட்டல் கருவிகளை உருவாக்குகிறோம்.',
      servicesHeading: 'சேவைகள்',
      companyHeading: 'நிறுவனம்',
      contactHeading: 'நேரடி தொடர்பு',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      termsOfService: 'சேவை விதிமுறைகள்',
      cookiePolicy: 'குக்கீ கொள்கை',
      refundPolicy: 'திரும்பப்பெறுதல் & ரத்து கொள்கை',
      allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    },
  },

  hi: {
    nav: {
      home: 'होम',
      services: 'सेवाएं',
      work: 'कार्य',
      about: 'परिचय',
      team: 'टीम',
      process: 'प्रक्रिया',
      contact: 'संपर्क',
      clientLogin: 'क्लाइंट लॉगिन',
      clientPortal: 'पोर्टल',
      getQuote: 'कोटेशन प्राप्त करें',
    },
    hero: {
      badge: 'फ्रीलांस सॉफ्टवेयर सॉल्यूशंस एजेंसी • भारत',
      headline: 'आपके अगले बड़े विचार के लिए निर्मित सॉफ्टवेयर।',
      subheadline:
        'VJS TECH व्यक्तियों, स्टार्टअप्स और व्यवसायों को विचारों को वेबसाइटों, वेब अनुप्रयोगों, स्वचालन और AI-संचालित समाधानों में बदलने में मदद करता है।',
      ctaPrimary: 'अपने प्रोजेक्ट पर चर्चा करें',
      ctaSecondary: 'हमारा काम देखें',
      stackTitle: 'सटीक और स्केलेबल आर्किटेक्चर',
    },
    services: {
      sectionTitle: 'तकनीकी क्षमताएं',
      sectionSubtitle:
        'आपकी विशिष्ट आवश्यकताओं के अनुरूप सॉफ्टवेयर इंजीनियरिंग और आधुनिक UI/UX डिज़ाइन।',
      viewAll: 'सभी 11 सेवाएं देखें',
      exploreService: 'सेवा विवरण',
      deliverables: 'प्रमुख परिणाम',
    },
    team: {
      badge: 'इंजीनियरिंग और डिलीवरी',
      title: 'हमारी टीम',
      subtitle:
        'आर्किटेक्चर, इंटरफेस डिज़ाइन, बैकएंड सिस्टम, डेटाबेस और सुरक्षा इंजीनियरिंग का नेतृत्व करने वाली हमारी मुख्य टीम से मिलें।',
      assignedResponsibilities: 'निर्धारित जिम्मेदारियां',
      skills: 'मुख्य कौशल',
    },
    process: {
      badge: 'पारदर्शी डिलीवरी',
      title: 'हम कैसे काम करते हैं',
      subtitle: 'आवश्यकता विश्लेषण से लेकर उत्पादन परिनियोजन तक अनुशासित चरणबद्ध प्रक्रिया।',
      step1: '1. आवश्यकता विश्लेषण',
      step1Desc: 'व्यावसायिक उद्देश्यों और तकनीकी आवश्यकताओं का गहन मूल्यांकन।',
      step2: '2. तकनीकी प्रस्ताव',
      step2Desc: 'स्पष्ट मील के पत्थर, समयसीमा और पारदर्शी कोटेशन।',
      step3: '3. UI/UX और सिस्टम आर्किटेक्चर',
      step3Desc: 'उपयोगकर्ता प्रवाह, वायरफ्रेम और डेटाबेस स्कीमा डिज़ाइन।',
      step4: '4. फुल-स्टैक विकास',
      step4Desc: 'आधुनिक तकनीकों के साथ सुरक्षित और मॉड्यूलर कोडिंग।',
      step5: '5. परीक्षण और सुरक्षा समीक्षा',
      step5Desc: 'सख्त गुणवत्ता और सुरक्षा जांच।',
      step6: '6. परिनियोजन और हैंडओवर',
      step6Desc: 'उत्पादन रिलीज और संपूर्ण तकनीकी प्रलेखन का हस्तांतरण।',
    },
    contact: {
      badge: 'बातचीत शुरू करें',
      title: 'अपने प्रोजेक्ट पर चर्चा करें',
      subtitle: 'बताएं कि आप क्या बनाना चाहते हैं। हम समीक्षा करेंगे और आगे के चरणों पर चर्चा करेंगे।',
      fullName: 'पूरा नाम *',
      email: 'ईमेल पता *',
      phone: 'व्हाट्सएप / फोन नंबर (वैकल्पिक)',
      organization: 'कंपनी या संस्थान (वैकल्पिक)',
      clientCategory: 'क्लाइंट श्रेणी *',
      serviceRequired: 'आवश्यक सेवाएं *',
      projectTitle: 'प्रोजेक्ट का नाम *',
      projectDescription: 'प्रोजेक्ट का विवरण *',
      budgetRange: 'अपेक्षित बजट सीमा (वैकल्पिक)',
      desiredTimeline: 'अपेक्षित समयसीमा (वैकल्पिक)',
      preferredContact: 'पसंदीदा संपर्क माध्यम *',
      additionalNotes: 'अतिरिक्त आवश्यकताएं',
      privacyConsent: 'मैं स्वीकार करता हूं कि मेरा डेटा गोपनीयता नीति के अनुसार संसाधित किया जाएगा।',
      submitButton: 'प्रोजेक्ट पूछताछ सबमिट करें',
      submitting: 'सबमिट हो रहा है...',
      directWhatsApp: 'व्हाट्सएप पर चैट करें',
      directEmail: 'सीधे ईमेल करें',
    },
    footer: {
      tagline: 'विचारों से बुद्धिमान सॉफ्टवेयर तक।',
      companyDesc:
        'VJS TECH भारत में स्थित एक स्वतंत्र सॉफ्टवेयर समाधान एजेंसी है। हम उद्देश्यपूर्ण वेब एप्लिकेशन और कस्टम डिजिटल टूल बनाते हैं।',
      servicesHeading: 'सेवाएं',
      companyHeading: 'कंपनी',
      contactHeading: 'सीधा संपर्क',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें',
      cookiePolicy: 'कुकी नीति',
      refundPolicy: 'रिफंड और रद्दीकरण नीति',
      allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    },
  },
};
