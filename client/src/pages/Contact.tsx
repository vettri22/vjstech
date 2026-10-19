import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, MessageSquare, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    clientCategory: 'Startup',
    services: preselectedService ? [preselectedService] : ['Website Development'],
    projectTitle: '',
    projectDescription: '',
    budgetRange: 'Under ₹50,000 / $600',
    desiredTimeline: '1 to 2 Months',
    preferredContactMethod: 'Email',
    additionalNotes: '',
    consentGiven: false,
    website_hp: '', // Anti-spam honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceCode: string;
    message: string;
    emailNotice?: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService && !formData.services.includes(preselectedService)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, preselectedService],
      }));
    }
  }, [preselectedService]);

  const clientCategories = [
    'Individual / Solo Founder',
    'Startup',
    'Small or Medium Business',
    'Educational Institution',
    'Enterprise',
    'International Client',
  ];

  const availableServices = [
    'Website Development',
    'Full-Stack Web Applications',
    'UI/UX Design',
    'AI-Powered Solutions',
    'Database Development',
    'API Development and Integration',
    'Automation and Business Tools',
    'E-commerce Development',
    'Cybersecurity Solutions',
    'Custom Software Development',
    'Mobile App Development',
  ];

  const budgetOptions = [
    'Under ₹25,000 / $300 (Micro Scope)',
    '₹25,000 - ₹50,000 / $300 - $600',
    '₹50,000 - ₹1,00,000 / $600 - $1,200',
    '₹1,00,000 - ₹2,50,000 / $1,200 - $3,000',
    '₹2,50,000+ / $3,000+ (Enterprise Scope)',
    'Not yet determined / Need technical scoping',
  ];

  const timelineOptions = [
    'Urgent (< 2 weeks)',
    '2 to 4 Weeks',
    '1 to 2 Months',
    '2 to 3 Months',
    'Flexible / Milestone-based',
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const exists = prev.services.includes(service);
      if (exists) {
        if (prev.services.length === 1) return prev; // At least one service required
        return { ...prev, services: prev.services.filter(s => s !== service) };
      } else {
        return { ...prev, services: [...prev.services, service] };
      }
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.projectTitle.trim() || formData.projectTitle.trim().length < 3) {
      newErrors.projectTitle = 'Project title must be at least 3 characters long.';
    }

    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = 'Please describe your project requirements in at least 10 characters.';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one required service.';
    }

    if (!formData.consentGiven) {
      newErrors.consentGiven = 'You must acknowledge the Privacy Policy to submit your enquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmissionSuccess({
          referenceCode: data.referenceCode,
          message: data.message,
          emailNotice: data.emailNotice,
        });
      } else {
        setServerError(data.error || 'Failed to submit enquiry. Please check your inputs and try again.');
      }
    } catch (err: any) {
      setServerError('Network error while connecting to server. Please try again or reach out directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl =
    'https://wa.me/919360761552?text=Hello%20VJS%20TECH%2C%20I%20would%20like%20to%20discuss%20a%20new%20software%20project.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <Mail className="w-3.5 h-3.5" />
          <span>{t.contact.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          {t.contact.title}
        </h1>
        <p className="text-base sm:text-lg text-vjs-secondary leading-relaxed">
          {t.contact.subtitle}
        </p>

        {/* Domain Infrastructure Notice */}
        <div className="p-3.5 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated text-xs text-vjs-secondary flex items-start gap-2.5">
          <span className="font-mono text-[#00E5FF] font-bold">ℹ</span>
          <p className="text-[12px] leading-relaxed text-vjs-muted">
            <strong className="text-vjs-primary">Domain Cost Notice:</strong> Domain name registration and yearly registrar renewals are a <strong className="text-vjs-primary">separate third-party cost</strong> billed directly at registrar pricing, or you may point an existing domain you already own to your project.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Contacts & Operational Next Steps */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Contact Cards */}
          <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-5">
            <h2 className="text-base font-bold text-vjs-primary font-mono uppercase tracking-wider">
              Direct Contact Options
            </h2>

            <div className="space-y-4">
              {/* WhatsApp */}
              <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-vjs-primary">
                    <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>WhatsApp Direct</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10">
                    Fastest Response
                  </span>
                </div>
                <p className="text-xs text-vjs-secondary">
                  Chat directly with Project Lead Vijay Vasanthan K S:
                </p>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E5FF] hover:underline"
                >
                  <span>+91 9360761552</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Email */}
              <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-vjs-primary">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Primary Official Email</span>
                </div>
                <p className="text-xs text-vjs-secondary">
                  Send formal RFP documents, project briefs, or specifications:
                </p>
                <a
                  href="mailto:vjstechofficial@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-vjs-primary hover:text-[#00E5FF] transition-colors"
                >
                  <span>vjstechofficial@gmail.com</span>
                  <ArrowRight className="w-3.5 h-3.5 text-vjs-muted" />
                </a>
              </div>
            </div>
          </div>

          {/* Transparent Next Steps */}
          <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
            <h3 className="text-sm font-bold text-vjs-primary font-mono uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00E5FF]" />
              <span>What Happens After You Submit?</span>
            </h3>
            <ol className="space-y-3 text-xs text-vjs-secondary">
              <li className="flex items-start gap-2.5">
                <span className="font-mono font-bold text-[#00E5FF]">1.</span>
                <span>
                  <strong>Technical Review:</strong> We examine your scope, target users, and architectural feasibility.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono font-bold text-[#00E5FF]">2.</span>
                <span>
                  <strong>Discovery Discussion:</strong> We coordinate a 30-minute requirement session to align on edge cases.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono font-bold text-[#00E5FF]">3.</span>
                <span>
                  <strong>Formal Proposal:</strong> We provide milestone breakdowns, delivery timelines, and transparent quotations.
                </span>
              </li>
            </ol>
          </div>

          {/* Privacy Assurance */}
          <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface text-[11px] text-vjs-muted space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-vjs-primary">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Confidentiality & Privacy</span>
            </div>
            <p className="leading-relaxed">
              We never share your business concepts, specifications, or contact details with third-party advertisers. All information is handled strictly under the VJS TECH Privacy Policy.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface shadow-xl">
            {submissionSuccess ? (
              <div className="py-10 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#00E5FF]/20 border border-[#00E5FF] flex items-center justify-center text-[#00E5FF]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-vjs-primary">
                    Project Enquiry Received
                  </h3>
                  <p className="text-sm text-vjs-secondary max-w-md mx-auto">
                    {submissionSuccess.message}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated max-w-sm mx-auto font-mono text-center">
                  <div className="text-xs text-vjs-muted">Unique Tracking Reference</div>
                  <div className="text-lg font-bold text-[#00E5FF] mt-1">
                    {submissionSuccess.referenceCode}
                  </div>
                </div>

                {submissionSuccess.emailNotice && (
                  <p className="text-xs text-vjs-muted max-w-md mx-auto">
                    {submissionSuccess.emailNotice}
                  </p>
                )}

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        organization: '',
                        clientCategory: 'Startup',
                        services: ['Website Development'],
                        projectTitle: '',
                        projectDescription: '',
                        budgetRange: 'Under ₹50,000 / $600',
                        desiredTimeline: '1 to 2 Months',
                        preferredContactMethod: 'Email',
                        additionalNotes: '',
                        consentGiven: false,
                        website_hp: '',
                      });
                    }}
                    className="px-4 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface text-xs font-semibold text-vjs-primary hover:bg-vjs-surface-hover transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-lg bg-[#00E5FF] text-[#050505] text-xs font-bold hover:bg-[#33EBFF] transition-colors"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="border-b border-vjs-subtle pb-4">
                  <h2 className="text-xl font-bold text-vjs-primary">
                    Project Enquiry & Quotation Form
                  </h2>
                  <p className="text-xs text-vjs-secondary mt-1">
                    Fields marked with * are required.
                  </p>
                </div>

                {serverError && (
                  <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Honeypot field - hidden from human view */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave empty</label>
                  <input
                    id="website_hp"
                    name="website_hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website_hp}
                    onChange={e => setFormData({ ...formData, website_hp: e.target.value })}
                  />
                </div>

                {/* Personal / Organization Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium text-vjs-primary mb-1">
                      {t.contact.fullName}
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                        errors.fullName ? 'border-red-500' : 'border-vjs-subtle'
                      }`}
                    />
                    {errors.fullName && <p className="mt-1 text-[11px] text-red-400">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-vjs-primary mb-1">
                      {t.contact.email}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@company.com"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                        errors.email ? 'border-red-500' : 'border-vjs-subtle'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-vjs-primary mb-1">
                      {t.contact.phone}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-xs font-medium text-vjs-primary mb-1">
                      {t.contact.organization}
                    </label>
                    <input
                      id="organization"
                      type="text"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Apex Dynamics Ltd"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                    />
                  </div>
                </div>

                {/* Client Category */}
                <div>
                  <label htmlFor="clientCategory" className="block text-xs font-medium text-vjs-primary mb-1">
                    {t.contact.clientCategory}
                  </label>
                  <select
                    id="clientCategory"
                    value={formData.clientCategory}
                    onChange={e => setFormData({ ...formData, clientCategory: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                  >
                    {clientCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Multiple Services Checkboxes */}
                <div>
                  <label className="block text-xs font-medium text-vjs-primary mb-2">
                    {t.contact.serviceRequired}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated">
                    {availableServices.map(service => {
                      const isChecked = formData.services.includes(service);
                      return (
                        <label
                          key={service}
                          className="flex items-center gap-2 text-xs text-vjs-secondary cursor-pointer hover:text-vjs-primary"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleServiceToggle(service)}
                            className="rounded border-vjs-subtle text-[#00E5FF] focus:ring-[#00E5FF]"
                          />
                          <span className={isChecked ? 'text-[#00E5FF] font-semibold' : ''}>
                            {service}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.services && <p className="mt-1 text-[11px] text-red-400">{errors.services}</p>}
                </div>

                {/* Project Title & Description */}
                <div>
                  <label htmlFor="projectTitle" className="block text-xs font-medium text-vjs-primary mb-1">
                    {t.contact.projectTitle}
                  </label>
                  <input
                    id="projectTitle"
                    type="text"
                    required
                    value={formData.projectTitle}
                    onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                    placeholder="e.g. Multi-tenant Logistics Tracking Portal"
                    className={`w-full px-3 py-2 text-xs rounded-lg border bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                      errors.projectTitle ? 'border-red-500' : 'border-vjs-subtle'
                    }`}
                  />
                  {errors.projectTitle && <p className="mt-1 text-[11px] text-red-400">{errors.projectTitle}</p>}
                </div>

                <div>
                  <label htmlFor="projectDescription" className="block text-xs font-medium text-vjs-primary mb-1">
                    {t.contact.projectDescription}
                  </label>
                  <textarea
                    id="projectDescription"
                    rows={4}
                    required
                    value={formData.projectDescription}
                    onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="Describe your user journeys, core features, expected scale, or specific operational challenges..."
                    className={`w-full px-3 py-2 text-xs rounded-lg border bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                      errors.projectDescription ? 'border-red-500' : 'border-vjs-subtle'
                    }`}
                  />
                  {errors.projectDescription && (
                    <p className="mt-1 text-[11px] text-red-400">{errors.projectDescription}</p>
                  )}
                </div>

                {/* Budget, Timeline & Contact Method */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="budgetRange" className="block text-xs font-medium text-vjs-primary mb-1">
                      {t.contact.budgetRange}
                    </label>
                    <select
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                    >
                      {budgetOptions.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="desiredTimeline" className="block text-xs font-medium text-vjs-primary mb-1">
                      {t.contact.desiredTimeline}
                    </label>
                    <select
                      id="desiredTimeline"
                      value={formData.desiredTimeline}
                      onChange={e => setFormData({ ...formData, desiredTimeline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                    >
                      {timelineOptions.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredContactMethod" className="block text-xs font-medium text-vjs-primary mb-1">
                      {t.contact.preferredContact}
                    </label>
                    <select
                      id="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={e => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                    >
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="Any">Any Contact Method</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label htmlFor="additionalNotes" className="block text-xs font-medium text-vjs-primary mb-1">
                    {t.contact.additionalNotes}
                  </label>
                  <input
                    id="additionalNotes"
                    type="text"
                    value={formData.additionalNotes}
                    onChange={e => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Existing system links, API documentation, or deadline constraints..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                  />
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consentGiven}
                      onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
                      className="mt-0.5 rounded border-vjs-subtle text-[#00E5FF] focus:ring-[#00E5FF]"
                    />
                    <span className="text-xs text-vjs-secondary">
                      I acknowledge that my submitted details will be processed exclusively to assess my enquiry in accordance with the{' '}
                      <Link to="/privacy" className="text-[#00E5FF] underline" target="_blank">
                        VJS TECH Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.consentGiven && (
                    <p className="mt-1 text-[11px] text-red-400">{errors.consentGiven}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] disabled:opacity-50 text-[#050505] font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                  >
                    <span>{isSubmitting ? t.contact.submitting : t.contact.submitButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
