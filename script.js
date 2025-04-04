// Przełączanie kategorii (zakładek)
const links = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.recipe-category');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const category = link.dataset.category;

    sections.forEach(section => {
      section.classList.remove('active');
    });

    document.getElementById(category).classList.add('active');
  });
});

// Filtrowanie składników
const filterInput = document.getElementById('filterInput');

filterInput.addEventListener('input', () => {
  const filter = filterInput.value.toLowerCase();

  document.querySelectorAll('.recipe-category.active .recipe-card').forEach(card => {
    const ingredients = card.querySelectorAll('ul li');
    const found = Array.from(ingredients).some(ing =>
      ing.textContent.toLowerCase().includes(filter)
    );
    card.style.display = found ? 'flex' : 'none';
  });
});

// Tryb ciemny
const toggleTheme = document.getElementById('toggleTheme');

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
