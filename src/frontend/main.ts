// Frontend entry point
// Add your frontend logic here

async function checkHealth() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    console.info('API Health:', data);
  } catch (err) {
    console.error('API not available:', err);
  }
}

checkHealth();
