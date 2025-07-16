const wrapper = document.querySelector('.svg-wrapper');

const bodyFigure = document.createElement('div');
bodyFigure.className = 'human-body-div';

bodyFigure.innerHTML = `
  <!-- SHOULDERS -->
  <div class="body-part shoulders" data-part="shoulder">
    <div class="circle left"></div>
    <div class="circle right"></div>
    <div class="label">SHOULDER</div>
  </div>

  <!-- CHEST -->
  <div class="body-part chests" data-part="chest">
    <div class="rect"></div>
    <div class="label">CHEST</div>
  </div>

  <!-- ARMS -->
  <div class="body-part armss" data-part="arms">
    <div class="rect left"></div>
    <div class="rect right"></div>
    <div class="label">ARM</div>
  </div>

  <!-- CORE -->
  <div class="body-part cores" data-part="core">
    <div class="rect"></div>
    <div class="label">CORE</div>
  </div>

  <!-- BACK -->
  <div class="body-part backs" data-part="back">
    <div class="rect"></div>
    <div class="label">BACK</div>
  </div>

  <!-- LEGS -->
  <div class="body-part legss" data-part="legs">
    <div class="rect left"></div>
    <div class="rect right"></div>
    <div class="label">LEG</div>
  </div>
`;

wrapper.appendChild(bodyFigure);

// Show all cards-containers by default
const allCardsContainers = document.querySelectorAll('.cards-container');
allCardsContainers.forEach((container) => {
  container.style.display = 'block';
});

// Attach click handlers to each body part
document.querySelectorAll('.body-part').forEach((part) => {
  part.style.cursor = 'pointer';
  part.addEventListener('click', () => {
    const selectedPart = part.getAttribute('data-part'); // e.g. "arms"

    let scrolledToContainer = null;

    allCardsContainers.forEach((container) => {
      const cardBlock = container.querySelector('.cards-wrapper .cards');
      if (cardBlock && cardBlock.classList.contains(selectedPart)) {
        container.style.display = 'block';
        scrolledToContainer = container; // save this to scroll later
      } else {
        container.style.display = 'none';
      }
    });

    // Scroll to the matched container smoothly
    if (scrolledToContainer) {
      scrolledToContainer.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
