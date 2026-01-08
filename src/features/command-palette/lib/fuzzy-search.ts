import { Command } from '../store/command-store';
import React from 'react';

export function fuzzySearch(query: string, items: Command[]): Command[] {
  if (!query.trim()) return items;
  
  const normalizedQuery = query.toLowerCase();
  
  return items
    .map(item => ({
      item,
      score: calculateScore(normalizedQuery, item)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

function calculateScore(query: string, command: Command): number {
  const searchText = [
    command.label,
    command.description || '',
    ...command.keywords
  ].join(' ').toLowerCase();
  
  // Exact match gets highest score
  if (searchText.includes(query)) {
    return 100;
  }
  
  // Fuzzy matching logic
  let score = 0;
  let queryIndex = 0;
  
  for (let i = 0; i < searchText.length && queryIndex < query.length; i++) {
    if (searchText[i] === query[queryIndex]) {
      score += 1;
      queryIndex++;
    }
  }
  
  return queryIndex === query.length ? score : 0;
}

export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(normalizedQuery);
  
  if (index === -1) return text;
  
  return React.createElement(React.Fragment, null,
    text.slice(0, index),
    React.createElement('mark', {
      className: 'bg-primary/20 text-foreground rounded px-0.5'
    }, text.slice(index, index + query.length)),
    text.slice(index + query.length)
  );
}