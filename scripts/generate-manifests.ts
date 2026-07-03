import * as fs from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '..');
const outDir = path.resolve(root, 'apps/dashboard/public/generated');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function scanArsenal() {
  const packagesPath = path.resolve(root, '../Arsenal/packages');
  const packages = fs.readdirSync(packagesPath);
  
  const manifest = packages.map((pkg) => {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.resolve(packagesPath, pkg, 'package.json'), 'utf-8')
    );
    return {
      name: pkg,
      purpose: pkgJson.description || `${pkg} module`,
      version: pkgJson.version || '0.1.0',
      status: 'stable',
      exports: ['default'],
      dependencies: Object.keys(pkgJson.dependencies || {})
    };
  });

  fs.writeFileSync(
    path.resolve(outDir, 'arsenal-manifest.json'),
    JSON.stringify({ packages: manifest }, null, 2)
  );
  console.log('Generated arsenal-manifest.json');
}

function scanForge() {
  const packagesPath = path.resolve(root, 'packages');
  const packages = fs.readdirSync(packagesPath);

  const manifest = packages.map((pkg) => {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.resolve(packagesPath, pkg, 'package.json'), 'utf-8')
    );
    return {
      name: pkg,
      purpose: pkgJson.description || `${pkg} workspace implementation`,
      exports: ['default'],
      composes: ['core'],
      dependencies: Object.keys(pkgJson.dependencies || {})
    };
  });

  fs.writeFileSync(
    path.resolve(outDir, 'forge-manifest.json'),
    JSON.stringify({ packages: manifest }, null, 2)
  );
  console.log('Generated forge-manifest.json');
}

function scanRules() {
  const rulesPath = path.resolve(root, 'rules');
  const files = fs.readdirSync(rulesPath).filter(f => f.endsWith('.md'));
  
  const manifest = files.map((file) => {
    const content = fs.readFileSync(path.resolve(rulesPath, file), 'utf-8');
    const sections = content.split('\n').filter(l => l.startsWith('#')).map(l => l.replace(/#/g, '').trim());
    return {
      name: file,
      status: 'compiled',
      lastLoaded: new Date().toISOString(),
      hash: 'cf-' + Math.random().toString(16).slice(2, 8),
      sections,
      affectedArtisans: ['PlannerArtisan', 'BuilderArtisan'],
      constraints: ['Respect boundaries and layout naming conventions']
    };
  });

  fs.writeFileSync(
    path.resolve(outDir, 'rule-manifest.json'),
    JSON.stringify({ files: manifest }, null, 2)
  );
  console.log('Generated rule-manifest.json');
}

try {
  scanArsenal();
  scanForge();
  scanRules();
  console.log('All manifests generated successfully!');
} catch (error) {
  console.error('Failed to generate manifests:', error);
}
