console.log('mark.js file loaded.');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const response = document.getElementById('feedbackResponse');

  if (!form || !response) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, message })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      response.textContent = data.message;
      response.className = 'form-response success';
      form.reset();
    } catch (error) {
      response.textContent = error.message;
      response.className = 'form-response error';
    }
  });
});



