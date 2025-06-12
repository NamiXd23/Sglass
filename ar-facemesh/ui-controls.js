// ui-controls.js
import { updateGlasses } from './main.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.controls button').forEach(button => {
    button.addEventListener('click', () => {
      const shape = button.getAttribute('data-shape');
      updateGlasses(shape);
    });
  });
});
