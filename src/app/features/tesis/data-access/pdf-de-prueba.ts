/**
 * PDF mínimo de una página con dos líneas de texto, para abrir los documentos de tesis en el prototipo (no hay
 * archivos reales). Solo existe en la Iteración 4: en la Iteración 5 el archivo llega del backend.
 */
export function pdfDePrueba(lineas: readonly string[]): Blob {
  const texto = lineas
    .map((linea, i) => `BT /F1 14 Tf 72 ${760 - i * 24} Td (${escapar(linea)}) Tj ET`)
    .join('\n');
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R ' +
      '/Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${texto.length} >>\nstream\n${texto}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  ];
  let pdf = '%PDF-1.4\n';
  const posiciones: number[] = [];
  objetos.forEach((objeto, i) => {
    posiciones.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objeto}\nendobj\n`;
  });
  const inicioXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  pdf += posiciones.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;
  // Latin-1, como la codificación WinAnsi de la fuente: un byte por carácter (las posiciones del xref cuadran).
  const bytes = Uint8Array.from(pdf, (c) => (c.charCodeAt(0) <= 255 ? c.charCodeAt(0) : 63));
  return new Blob([bytes], { type: 'application/pdf' });
}

/** Paréntesis y barras invertidas se escapan dentro de un texto de PDF. */
function escapar(texto: string): string {
  return texto.replace(/[\\()]/g, (c) => `\\${c}`);
}
