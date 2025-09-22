import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copier le SVG comme favicon.svg
const svgSource = path.join(__dirname, 'public', 'Terra_logo.svg');
const svgDest = path.join(__dirname, 'public', 'favicon.svg');

console.log('🎯 Génération du favicon à partir de Terra_logo.svg...');

// Copier le fichier SVG
fs.copyFileSync(svgSource, svgDest);
console.log('✅ favicon.svg créé');

// Lire le contenu du SVG pour créer un favicon ICO simple
const svgContent = fs.readFileSync(svgSource, 'utf8');

// Créer un HTML simple pour tester le favicon
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.ico">
    <title>Test Favicon TERRA</title>
</head>
<body>
    <h1>Test du favicon TERRA</h1>
    <p>Vérifiez l'onglet du navigateur pour voir le nouveau favicon.</p>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon-test.html'), htmlContent);
console.log('✅ Fichier de test créé: public/favicon-test.html');

console.log('🎯 Favicon généré avec succès !');
console.log('📝 Le favicon SVG moderne est maintenant disponible');
console.log('📝 Les navigateurs modernes utiliseront automatiquement le SVG');
