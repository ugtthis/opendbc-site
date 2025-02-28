import { createSignal } from 'solid-js';

/**
 * Simple store for managing InfoCard expand states
 */
export const [expandedCards, setExpandedCards] = createSignal<Set<string>>(new Set());

/**
 * Initialize a new card with its default state
 */
export const initializeCard = (id: string, defaultExpanded: boolean = true) => {
  setExpandedCards(prev => {
    const next = new Set(prev);
    if (defaultExpanded) next.add(id);
    return next;
  });
};

/**
 * Toggle a single card's state
 */
export const toggleCard = (id: string) => {
  setExpandedCards(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

/**
 * Toggle all cards
 */
export const toggleAllCards = () => {
  setExpandedCards(prev => {
    if (prev.size > 0) return new Set<string>();
    return new Set(Array.from(document.querySelectorAll('[data-info-card]')).map(el => el.id));
  });
};

/**
 * Check if a card is expanded
 */
export const isCardExpanded = (id: string) => expandedCards().has(id); 