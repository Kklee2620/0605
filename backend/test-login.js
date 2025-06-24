const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  email: 'admin@example.com',
  password: 'admin123'
});

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:');
    try {
      const parsedData = JSON.parse(responseData);
      console.log(JSON.stringify(parsedData, null, 2));
      
      if (parsedData.access_token) {
        console.log('\nLogin successful!');
        console.log('Access Token:', parsedData.access_token);
        console.log('\nTo access admin panel:');
        console.log('1. Open browser to http://localhost:5173/#/admin');
        console.log('2. Open browser developer tools (F12)');
        console.log('3. In Console tab, run:');
        console.log(`   localStorage.setItem('modernstore-jwt', '${parsedData.access_token}')`);
        console.log('4. Refresh the page');
      }
    } catch (e) {
      console.log('Could not parse response as JSON:');
      console.log(responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();

console.log('Sending login request to http://localhost:3000/auth/login');
console.log('Request Body:', data); 