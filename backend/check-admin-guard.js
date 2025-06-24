const fs = require('fs');
const path = require('path');

function searchFilesForAdminGuard(dir) {
  console.log('Searching for admin-specific guards...\n');
  
  const results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...searchFilesForAdminGuard(filePath));
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('ADMIN') && (content.includes('Guard') || content.includes('guard'))) {
        results.push({
          file: path.relative(__dirname, filePath),
          content: content
        });
      }
    }
  }
  
  return results;
}

function main() {
  const srcDir = path.join(__dirname, 'src');
  const adminGuards = searchFilesForAdminGuard(srcDir);
  
  if (adminGuards.length > 0) {
    console.log('Found potential admin guards:');
    for (const guard of adminGuards) {
      console.log(`\nFile: ${guard.file}`);
      
      // Extract relevant sections
      const lines = guard.content.split('\n');
      let relevantLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('ADMIN') && (lines[i].includes('Guard') || lines[i].includes('guard'))) {
          // Get context (5 lines before and after)
          const start = Math.max(0, i - 5);
          const end = Math.min(lines.length - 1, i + 5);
          
          relevantLines.push(...lines.slice(start, end + 1));
          relevantLines.push('---');
        }
      }
      
      console.log(relevantLines.join('\n'));
    }
  } else {
    console.log('No admin-specific guards found.');
    console.log('\nThe current authorization system:');
    console.log('1. Uses JwtAuthGuard to protect routes requiring authentication');
    console.log('2. The JWT token contains the user role (USER or ADMIN)');
    console.log('3. No server-side role-based authorization is implemented');
    console.log('4. Frontend is responsible for restricting access based on user role');
    
    console.log('\nRecommendation:');
    console.log('Implement a RolesGuard to enforce role-based access control on the server side.');
  }
}

main(); 