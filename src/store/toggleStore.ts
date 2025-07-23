import { createSignal } from 'solid-js';

export const [expandedCards, setExpandedCards] = createSignal<Set<string>>(new Set());

export const initializeCard = (id: string, defaultExpanded: boolean = true) => {
  setExpandedCards(prev => {
    const next = new Set(prev);
    if (defaultExpanded) next.add(id);
    return next;
  });
};

export const toggleCard = (id: string) => {
  setExpandedCards(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

export const toggleAllCards = () => {
  setExpandedCards(prev => {
    if (prev.size > 0) return new Set<string>();
    return new Set(Array.from(document.querySelectorAll('[data-info-card]')).map(el => el.id));
  });
};

export const isCardExpanded = (id: string) => expandedCards().has(id); 