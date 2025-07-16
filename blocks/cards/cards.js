import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });

  // Optimize pictures
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  // Clear original block content and append new list
  block.textContent = '';
  block.append(ul);

  // ✅ Add click redirects only to first 3 cards
  const redirectUrls = [
    'https://main--aemdemo--singh-priya608.aem.live/gym',
    'https://main--aemdemo--singh-priya608.aem.live/yoga',
    'https://main--aemdemo--singh-priya608.aem.live/nutrition',
  ];

  ul.querySelectorAll('li').forEach((li, index) => {
    if (index < redirectUrls.length) {
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        window.location.href = redirectUrls[index];
      });
    }
  });
}
