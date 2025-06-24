const fs = require('fs');
const path = require('path');

function findControllerFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...findControllerFiles(filePath));
    } else if (file.includes('controller.ts')) {
      results.push(filePath);
    }
  }
  
  return results;
}

function findAdminRoutes(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const adminRoutes = [];
  let currentRoute = null;
  let isProtected = false;
  
  for (const line of lines) {
    if (line.includes('@Controller')) {
      const match = line.match(/@Controller\(['"](.+?)['"]\)/);
      currentRoute = match ? match[1] : '';
    } else if (line.includes('@UseGuards') && line.includes('JwtAuthGuard')) {
      isProtected = true;
    } else if (line.includes('@Get') || line.includes('@Post') || line.includes('@Patch') || line.includes('@Delete')) {
      const methodMatch = line.match(/@(Get|Post|Patch|Delete)\(['"]?(.+?)['"]?\)/);
      
      if (methodMatch && isProtected) {
        const method = methodMatch[1];
        const endpoint = methodMatch[2] || '';
        adminRoutes.push({
          method,
          route: `/${currentRoute}/${endpoint}`.replace(/\/+/g, '/'),
          protected: isProtected
        });
      }
      
      isProtected = false;
    }
  }
  
  return adminRoutes;
}

function main() {
  console.log('Analyzing admin routes...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const controllerFiles = findControllerFiles(srcDir);
  
  const allAdminRoutes = [];
  
  for (const file of controllerFiles) {
    const routes = findAdminRoutes(file);
    if (routes.length > 0) {
      allAdminRoutes.push({
        controller: path.relative(__dirname, file),
        routes
      });
    }
  }
  
  console.log('Admin Routes (Protected by JwtAuthGuard):');
  console.log(JSON.stringify(allAdminRoutes, null, 2));
  
  console.log('\nSummary:');
  const totalProtectedRoutes = allAdminRoutes.reduce((sum, controller) => sum + controller.routes.length, 0);
  console.log(`- Total protected routes: ${totalProtectedRoutes}`);
  
  console.log('\nNote: These routes require JWT authentication. Admin role-specific authorization is not explicitly implemented.');
  console.log('The current system relies on frontend to control access based on the user role stored in the JWT token.');
}

main(); 