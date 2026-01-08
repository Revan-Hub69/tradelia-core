/**
 * Fuzzy Search Library - Tradelia 2026
 * 
 * Algoritmo di ricerca fuzzy per command palette
 * Ottimizzato per performance e accuratezza
 */

import type { Command, CommandSearchResult } from '@/entities/command';

export function fuzzySearch(query: string, commands: Command[]): CommandSearchResult[] {
  if (!query.trim()) {
    return commands.map(command => ({
      command,
      score: 0,
      matchedKeywords: []
    }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: CommandSearchResult[] = [];

  for (const command of commands) {
    if (command.hidden || command.disabled) continue;

    const searchResult = calculateCommandScore(normalizedQuery, command);
    if (searchResult.score > 0) {
      results.push(searchResult);
    }
  }

  // Sort by score (highest first), then by label length (shorter first)
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.command.label.length - b.command.label.length;
  });
}

function calculateCommandScore(query: string, command: Command): CommandSearchResult {
  const searchTexts = [
    { text: command.label, weight: 10 },
    { text: command.description || '', weight: 5 },
    ...command.keywords.map(keyword => ({ text: keyword, weight: 7 }))
  ];

  let totalScore = 0;
  const matchedKeywords: string[] = [];

  for (const { text, weight } of searchTexts) {
    const normalizedText = text.toLowerCase();
    
    // Exact match gets highest score
    if (normalizedText === query) {
      totalScore += weight * 100;
      matchedKeywords.push(text);
      continue;
    }

    // Starts with query gets high score
    if (normalizedText.startsWith(query)) {
      totalScore += weight * 80;
      matchedKeywords.push(text);
      continue;
    }

    // Contains query gets medium score
    if (normalizedText.includes(query)) {
      totalScore += weight * 60;
      matchedKeywords.push(text);
      continue;
    }

    // Fuzzy match gets lower score
    const fuzzyScore = calculateFuzzyScore(query, normalizedText);
    if (fuzzyScore > 0) {
      totalScore += weight * fuzzyScore;
      matchedKeywords.push(text);
    }
  }

  return {
    command,
    score: totalScore,
    matchedKeywords: [...new Set(matchedKeywords)] // Remove duplicates
  };
}

function calculateFuzzyScore(query: string, text: string): number {
  if (query.length === 0) return 0;
  if (text.length === 0) return 0;

  let queryIndex = 0;
  let matches = 0;
  let consecutiveMatches = 0;
  let maxConsecutive = 0;

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      matches++;
      consecutiveMatches++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
      queryIndex++;
    } else {
      consecutiveMatches = 0;
    }
  }

  // Must match all characters in query
  if (queryIndex !== query.length) return 0;

  // Score based on match ratio and consecutive matches
  const matchRatio = matches / query.length;
  const consecutiveBonus = maxConsecutive / query.length;
  
  return Math.round((matchRatio * 50) + (consecutiveBonus * 30));
}

export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;

  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  
  // Simple highlighting for exact matches and starts-with
  if (normalizedText.includes(normalizedQuery)) {
    const index = normalizedText.indexOf(normalizedQuery);
    return (
      text.slice(0, index) +
      `<mark class="bg-primary/20 text-foreground">${text.slice(index, index + query.length)}</mark>` +
      text.slice(index + query.length)
    );
  }

  return text;
}