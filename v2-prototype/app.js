document.querySelectorAll('[data-choice]').forEach(button => {
  button.addEventListener('click', () => {
    const feedback = document.getElementById('feedback');
    if (button.dataset.choice === 'strong') {
      feedback.textContent = 'Good choice. This keeps the learner responsible for trying, checking, and explaining.';
      feedback.style.background = '#ecfdf5';
      feedback.style.color = '#047857';
    } else {
      feedback.textContent = 'Fast, but weak. It gives the answer away and makes the learner dependent.';
      feedback.style.background = '#fff7ed';
      feedback.style.color = '#c2410c';
    }
  });
});

document.getElementById('card-builder')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const card = [
    'Study Coach Card',
    '',
    `Subject: ${data.subject || 'Not set'}`,
    `Learning goal: ${data.goal || 'Not set'}`,
    '',
    'AI should:',
    data.should || 'Not set',
    '',
    'AI should not:',
    data.should_not || 'Not set'
  ].join('\n');
  localStorage.setItem('learningai-v2-study-coach-card', card);
  document.getElementById('card-output').textContent = card;
});

const saved = localStorage.getItem('learningai-v2-study-coach-card');
if (saved) {
  document.getElementById('card-output').textContent = saved;
}
