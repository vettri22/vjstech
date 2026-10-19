import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  // Always include Home as first element if not already present
  const allItems: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    ...items,
  ];

  // Generate Schema.org BreadcrumbList JSON-LD
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.to ? `https://vjstech.in${item.to}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumbs" className={`mb-6 ${className}`}>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-vjs-muted">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-vjs-subtle shrink-0" aria-hidden="true" />
                )}
                {isLast || !item.to ? (
                  <span
                    aria-current="page"
                    className="text-[#00E5FF] font-medium truncate max-w-[200px] sm:max-w-xs"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className="text-vjs-secondary hover:text-vjs-primary transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
