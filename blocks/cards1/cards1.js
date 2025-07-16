import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  // Convert each child row into an <li>
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

  // Optimize all images inside picture tags
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(
    createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
  ));

  // Clear original block content and append the new <ul>
  block.textContent = '';
  block.append(ul);

  // ===== CUSTOM INTERACTION LOGIC STARTS HERE =====

  const cardItems = ul.querySelectorAll('li');
  const carouselDivs = document.querySelectorAll('.carousel-container');

  function showOnlySelectedDiv(index) {
    let scrollToDiv = null;
    carouselDivs.forEach((div, i) => {
      if (i === index) {
        div.style.display = 'block';
        scrollToDiv = div;
      } else {
        div.style.display = 'none';
      }
    });

    if (scrollToDiv) {
      scrollToDiv.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cardItems.forEach((card, index) => {
    card.addEventListener('click', () => {
      showOnlySelectedDiv(index);
    });
  });

  // ===== CUSTOM INTERACTION LOGIC ENDS HERE =====
}
