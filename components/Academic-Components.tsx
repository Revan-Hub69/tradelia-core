'use client';

import { ReactNode } from 'react';

// Academic Section Component - Clean and Minimal
interface AcademicSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const AcademicSection = ({ children, className = '', id }: AcademicSectionProps) => {
  return (
    <section 
      className={`section-academic ${className}`}
      id={id}
    >
      <div className="container-academic">
        {children}
      </div>
    </section>
  );
};

// Academic Card - No shadows, no effects
interface AcademicCardProps {
  children: ReactNode;
  className?: string;
}

export const AcademicCard = ({ children, className = '' }: AcademicCardProps) => {
  return (
    <div className={`card-academic ${className}`}>
      {children}
    </div>
  );
};

// Academic Button - Minimal styling
interface AcademicButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const AcademicButton = ({ children, href, onClick, className = '' }: AcademicButtonProps) => {
  if (href) {
    return (
      <a href={href} className={`button-academic ${className}`}>
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={`button-academic ${className}`}>
      {children}
    </button>
  );
};

// Citation Block Component
interface CitationProps {
  children: ReactNode;
  author?: string;
  year?: string;
  source?: string;
}

export const Citation = ({ children, author, year, source }: CitationProps) => {
  return (
    <div className="citation-block">
      <div className="text-body-sm italic mb-2">
        {children}
      </div>
      {(author || year || source) && (
        <div className="text-citation">
          {author && year && `${author} (${year})`}
          {source && `. ${source}`}
        </div>
      )}
    </div>
  );
};

// Methodology Box Component
interface MethodologyBoxProps {
  title: string;
  children: ReactNode;
}

export const MethodologyBox = ({ title, children }: MethodologyBoxProps) => {
  return (
    <div className="methodology-box">
      <h4 className="text-heading mb-4">{title}</h4>
      {children}
    </div>
  );
};

// Academic List Component
interface AcademicListProps {
  items: string[];
  className?: string;
}

export const AcademicList = ({ items, className = '' }: AcademicListProps) => {
  return (
    <ul className={`list-academic ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="text-body">
          {item}
        </li>
      ))}
    </ul>
  );
};

// Bibliography Entry Component
interface BibliographyEntryProps {
  authors: string;
  year: string;
  title: string;
  journal?: string;
  publisher?: string;
  volume?: string;
  pages?: string;
  doi?: string;
  isbn?: string;
}

export const BibliographyEntry = ({ 
  authors, 
  year, 
  title, 
  journal, 
  publisher, 
  volume, 
  pages, 
  doi, 
  isbn 
}: BibliographyEntryProps) => {
  return (
    <div className="mb-4 text-body-sm">
      <span className="emphasis-academic">{authors}</span> ({year}). 
      <span className="italic"> {title}</span>.
      {journal && <span className="emphasis-academic"> {journal}</span>}
      {publisher && <span className="emphasis-academic"> {publisher}</span>}
      {volume && <span>, {volume}</span>}
      {pages && <span>, {pages}</span>}
      {doi && <span className="text-caption">. DOI: {doi}</span>}
      {isbn && <span className="text-caption">. ISBN: {isbn}</span>}
    </div>
  );
};

// Academic Table Component
interface AcademicTableProps {
  headers: string[];
  rows: string[][];
  className?: string;
}

export const AcademicTable = ({ headers, rows, className = '' }: AcademicTableProps) => {
  return (
    <table className={`table-academic ${className}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="text-body-sm">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="text-body-sm">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Research Finding Component
interface ResearchFindingProps {
  category: string;
  scenario: string;
  instrument: string;
  issue: string;
  reference: string;
}

export const ResearchFinding = ({ 
  category, 
  scenario, 
  instrument, 
  issue, 
  reference 
}: ResearchFindingProps) => {
  return (
    <AcademicCard className="mb-6">
      <div className="mb-3">
        <span className="text-caption uppercase tracking-wide text-primary font-medium">
          {category}
        </span>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-caption mb-1">Scenario</div>
          <div className="text-body-sm emphasis-academic">{scenario}</div>
        </div>
        
        <div>
          <div className="text-caption mb-1">Strumento</div>
          <div className="text-body-sm emphasis-academic">{instrument}</div>
        </div>
        
        <div>
          <div className="text-caption mb-1">Incompatibilità</div>
          <div className="text-body-sm text-primary emphasis-academic">{issue}</div>
        </div>
      </div>
      
      <div className="border-t border-border pt-3">
        <div className="text-citation">{reference}</div>
      </div>
    </AcademicCard>
  );
};

// Process Step Component - Academic Style
interface ProcessStepProps {
  number: string;
  phase: string;
  description: string;
}

export const ProcessStep = ({ number, phase, description }: ProcessStepProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-8 h-8 border border-primary text-primary text-sm font-medium flex items-center justify-center">
        {number}
      </div>
      <div>
        <div className="text-heading mb-2">{phase}</div>
        <div className="text-body-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
};