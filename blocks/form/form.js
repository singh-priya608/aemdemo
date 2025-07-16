import createField from './form-fields.js';

async function createForm(formHref, submitHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  form.dataset.action = submitHref;

  const fields = await Promise.all(json.data.map((fd) => createField(fd, form)));
  fields.forEach((field) => {
    if (field) {
      form.append(field);
    }
  });

  // group fields into fieldsets
  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    form.querySelectorAll(`[data-fieldset="${fieldset.name}"`).forEach((field) => {
      fieldset.append(field);
    });
  });

  return form;
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') {
    return;
  }

  const navFormContainer = form.closest('.navform');
  if (navFormContainer === null) {
    const age = parseInt(form.querySelector('#form-age').value, 10);
    const gender = form.querySelector('#form-gender').value;
    const weight = parseFloat(form.querySelector('#form-weight-kgs').value);
    const height = parseInt(form.querySelector('#form-height-cm').value, 10);

    const activityString = form.querySelector('#form-activity-level').value;
    const activityMap = {
      'Sedentary (little/no exercise)': 1.2,
      'Light (1-3 days/week)': 1.375,
      'Moderate (3-5 days/week)': 1.55,
      'Very Active (6-7 days/week)': 1.725,
      'Extra Active (2x/day, intense)': 1.9,
    };
    const activity = activityMap[activityString];

    if (!age || !gender || !weight || !height || !activity) {
      console.alert('Please fill in all fields correctly.');
      return;
    }

    // Calculate BMR
    let bmr;
    if (gender.toLowerCase() === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const tdee = bmr * activity;
    const protein = Math.round((tdee * 0.25) / 4);
    const carbs = Math.round((tdee * 0.45) / 4);
    const fats = Math.round((tdee * 0.30) / 9);
    const bmi = weight / ((height / 100) ** 2);

    let bmiCategory = '';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
    } else if (bmi < 25) {
      bmiCategory = 'Normal weight';
    } else if (bmi < 30) {
      bmiCategory = 'Overweight';
    } else {
      bmiCategory = 'Obese';
    }

    const waterIntake = Math.round(weight * 35);

    // Show results below form
    const resultContainer = document.createElement('div');
    resultContainer.id = 'calculator-results';

    resultContainer.innerHTML = `
      <h3>Your Nutrition Needs</h3>
      <div class="results-content">
        <div class="result-item"><span class="result-label">Daily Calories:</span><span class="result-value">${Math.round(tdee)} kcal</span></div>
        <div class="result-item"><span class="result-label">Protein:</span><span class="result-value">${protein} g</span></div>
        <div class="result-item"><span class="result-label">Carbohydrates:</span><span class="result-value">${carbs} g</span></div>
        <div class="result-item"><span class="result-label">Fats:</span><span class="result-value">${fats} g</span></div>
        <div class="result-item"><span class="result-label">BMI:</span><span class="result-value">${bmi.toFixed(1)} (${bmiCategory})</span></div>
        <div class="result-item"><span class="result-label">Water Intake:</span><span class="result-value">${waterIntake} ml</span></div>
      </div>
    `;

    const rBlock = document.querySelector('.result');
    rBlock.children[0].style.display = 'none';
    rBlock.appendChild(resultContainer);
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = '/';
  }
}

export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')].map((a) => a.href);
  const formLink = links.find((link) => link.startsWith(window.location.origin) && link.endsWith('.json'));
  const submitLink = links.find((link) => link !== formLink);
  if (!formLink || !submitLink) return;

  const form = await createForm(formLink, submitLink);
  block.replaceChildren(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    if (valid) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
