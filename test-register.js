const fetch = require('node-fetch');

async function testRegistration() {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '0712345678',
        location: 'Nairobi'
      })
    });

    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRegistration();