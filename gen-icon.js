const sharp = require('sharp')
const fs    = require('fs')

// SVG profissional: gradiente roxo + sacola de compras branca + brilho
function svgIcon(size) {
  const s = size
  const r = Math.round(s * 0.22) // raio dos cantos

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#9333ea"/>
      <stop offset="100%" stop-color="#5b21b6"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="round">
      <rect width="${s}" height="${s}" rx="${r}" ry="${r}"/>
    </clipPath>
  </defs>

  <!-- Fundo gradiente -->
  <rect width="${s}" height="${s}" rx="${r}" ry="${r}" fill="url(#bg)"/>

  <!-- Brilho superior -->
  <rect width="${s}" height="${Math.round(s*0.5)}" rx="${r}" ry="${r}" fill="url(#shine)" clip-path="url(#round)"/>

  <!-- Sacola de compras centralizada -->
  <g transform="translate(${s*0.5}, ${s*0.5}) scale(${s/280})">
    <!-- Corpo da sacola -->
    <path d="M-78 -28 Q-88 -28 -92 -18 L-108 68 Q-112 86 -92 86 L92 86 Q112 86 108 68 L92 -18 Q88 -28 78 -28 Z"
      fill="white" opacity="0.95"/>
    <!-- Alça -->
    <path d="M-36 -28 Q-36 -90 0 -90 Q36 -90 36 -28"
      fill="none" stroke="white" stroke-width="16" stroke-linecap="round"/>
    <!-- Brilho interno da sacola -->
    <path d="M-78 -28 Q-88 -28 -92 -18 L-108 68 Q-112 86 -92 86 L92 86 Q112 86 108 68 L92 -18 Q88 -28 78 -28 Z"
      fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    <!-- Detalhe: ponto central -->
    <circle cx="0" cy="28" r="9" fill="#9333ea" opacity="0.7"/>
  </g>
</svg>`
}

async function gerar(size, out) {
  const svg = Buffer.from(svgIcon(size))
  await sharp(svg).png({ quality: 100, compressionLevel: 9 }).toFile(out)
  console.log('✅', out)
}

Promise.all([
  gerar(192, 'icon-192.png'),
  gerar(512, 'icon-512.png')
]).catch(console.error)
