import React from 'react';

export const animateFlyTo = (
  startEvent: React.MouseEvent,
  targetIdDesktop: string,
  targetIdMobile: string,
  iconType: 'cart' | 'heart'
) => {
  // Check screen size to determine target (lg breakpoint in Tailwind is 1024px)
  const isMobile = window.innerWidth < 1024;
  const targetId = isMobile ? targetIdMobile : targetIdDesktop;
  
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  // Calculate start coordinates
  const startRect = (startEvent.currentTarget as HTMLElement).getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  // Create flying element
  const flyingEl = document.createElement('div');
  flyingEl.style.position = 'fixed';
  flyingEl.style.zIndex = '999999';
  flyingEl.style.left = `${startRect.left + startRect.width / 2 - 15}px`;
  flyingEl.style.top = `${startRect.top + startRect.height / 2 - 15}px`;
  flyingEl.style.width = '30px';
  flyingEl.style.height = '30px';
  flyingEl.style.borderRadius = '50%';
  flyingEl.style.display = 'flex';
  flyingEl.style.alignItems = 'center';
  flyingEl.style.justifyContent = 'center';
  flyingEl.style.backgroundColor = iconType === 'cart' ? '#3b63f6' : '#ef4444';
  flyingEl.style.color = 'white';
  flyingEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  flyingEl.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  flyingEl.style.pointerEvents = 'none'; // so it doesn't block clicks
  
  // Icon SVG inside
  flyingEl.innerHTML = iconType === 'cart' 
    ? `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`
    : `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`;

  document.body.appendChild(flyingEl);

  // Trigger animation after a tiny delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyingEl.style.left = `${targetRect.left + targetRect.width / 2 - 15}px`;
      flyingEl.style.top = `${targetRect.top + targetRect.height / 2 - 15}px`;
      flyingEl.style.transform = 'scale(0.3)';
      flyingEl.style.opacity = '0.5';
    });
  });

  // Remove element after animation
  setTimeout(() => {
    if (document.body.contains(flyingEl)) {
      document.body.removeChild(flyingEl);
      
      // Optional: Add a little bump animation to the target element
      targetEl.style.transform = 'scale(1.2)';
      targetEl.style.transition = 'transform 0.2s';
      setTimeout(() => {
        targetEl.style.transform = 'scale(1)';
      }, 200);
    }
  }, 800);
};
