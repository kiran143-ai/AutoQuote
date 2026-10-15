import { readinessChecks, readinessSummary } from './caseDerived';
import { governanceThresholds } from '../data/analysisTools';
import { productLabel } from '../data/products';
import { premiumShort, signedPct } from './format';
import { TARGET_MVP } from './pricing';
import { themeColors } from './theme';
import type { Theme } from '../contexts/ThemeContext';
import type { QuoteCase } from '../types';
import logoUrl from '../nyl-logo-1.svg';

const INK = '#111827';
const MUTED = '#6B7280';
const CANVAS = '#F1F3F5';
const LINE = '#E5E7EB';
const SUCCESS = '#28A745';
const SUCCESS_TXT = '#15803D';
const SUCCESS_TINT = '#F2FAF4';
const WARN = '#F0A500';
const WARN_TXT = '#92400E';
const WARN_TINT = '#FEFAF0';
const DANGER = '#DC3545';
const DANGER_TXT = '#B91C1C';
const DANGER_TINT = '#FDF3F4';

const W = 612;
const H = 792;
const M = 42;
const CW = W - M * 2;

// Standard PDF fonts cannot draw these symbols, so swap them for readable equivalents.
function safe(text: string): string {
  return text.
  replace(/≥/g, '>=').
  replace(/≤/g, '<=').
  replace(/−/g, '-').
  replace(/[–]/g, '-').
  replace(/→/g, 'to').
  replace(/[^\x20-\x7E -ÿ—•]/g, '');
}

function loadLogo(): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 192;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 192, 192);
        ctx.drawImage(img, 0, 0, 192, 192);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = logoUrl;
  });
}

export async function generateEvidencePdf(quote: QuoteCase, theme: Theme): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pal = themeColors[theme];
  const checks = readinessChecks(quote);
  const summary = readinessSummary(quote);
  const m = quote.metrics;
  const logo = await loadLogo();
  const now = new Date();
  const dateLong = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const stamp = now.toLocaleString('en-US');

  const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16)];

  const fill = (hex: string) => {const [r, g, b] = rgb(hex);doc.setFillColor(r, g, b);};
  const stroke = (hex: string) => {const [r, g, b] = rgb(hex);doc.setDrawColor(r, g, b);};
  const ink = (hex: string) => {const [r, g, b] = rgb(hex);doc.setTextColor(r, g, b);};
  const text = (t: string, x: number, yy: number, opts?: Parameters<typeof doc.text>[3]) => doc.text(safe(t), x, yy, opts);

  let y = 0;

  const drawCoverHeader = () => {
    fill(pal.primary);
    doc.rect(0, 0, W, 98, 'F');
    fill(pal.navActiveBg);
    doc.rect(0, 98, W, 3, 'F');

    fill('#FFFFFF');
    doc.roundedRect(M, 26, 46, 46, 6, 6, 'F');
    if (logo) doc.addImage(logo, 'PNG', M + 3, 29, 40, 40);

    ink('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(21);
    text('EVIDENCE PACKET', M + 62, 50);
    ink(pal.primaryTint);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    text('Pricing Submission Snapshot - Compliance & Audit Record', M + 62, 67);

    ink('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    text(quote.name, W - M, 34, { align: 'right' });
    ink(pal.primaryTint);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    text(dateLong, W - M, 48, { align: 'right' });

    fill('#FFFFFF');
    doc.roundedRect(W - M - 104, 58, 104, 26, 6, 6, 'F');
    ink(summary.failed ? WARN_TXT : SUCCESS_TXT);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    text(`${summary.score}%`, W - M - 92, 77);
    ink(MUTED);
    doc.setFontSize(7);
    text('READINESS', W - M - 52, 75, { charSpace: 0.5 });
  };

  const drawRunningHeader = () => {
    fill(pal.primary);
    doc.rect(0, 0, W, 30, 'F');
    ink('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    text('EVIDENCE PACKET', M, 19, { charSpace: 0.6 });
    ink(pal.primaryTint);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    text(quote.name, W - M, 19, { align: 'right' });
  };

  const ensure = (needed: number) => {
    if (y + needed > H - 62) {
      doc.addPage();
      drawRunningHeader();
      y = 58;
    }
  };

  const sectionTitle = (title: string, sub?: string) => {
    ensure(40);
    ink(pal.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    text(title.toUpperCase(), M, y, { charSpace: 0.4 });
    if (sub) {
      const w = doc.getTextWidth(safe(title.toUpperCase())) + title.length * 0.4;
      ink(MUTED);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      text(sub, M + w + 10, y);
    }
    stroke(LINE);
    doc.setLineWidth(0.8);
    doc.line(M, y + 7, W - M, y + 7);
    stroke(pal.primary);
    doc.setLineWidth(2);
    doc.line(M, y + 7, M + 44, y + 7);
    y += 26;
  };

  // ---- Cover header ----
  drawCoverHeader();
  y = 138;

  // ---- Executive summary ----
  sectionTitle('Executive Summary');
  const summaryTop = y;
  const kv: [string, string][] = [
  ['Case', quote.name],
  ['Client', quote.client],
  ['Product', productLabel(quote.product)],
  ['Producer', quote.producer],
  ['Submitted by', 'Scott (Actuary)'],
  ['Submission date', stamp],
  ['Round', `#${quote.round}`]];

  kv.forEach(([k, v], i) => {
    const yy = summaryTop + 8 + i * 22;
    ink(MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    text(k, M, yy);
    ink(INK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    const line = doc.splitTextToSize(safe(v), 182)[0] as string;
    doc.text(line, M + 92, yy);
  });

  const tiles: {label: string;value: string;accent: string;color: string;}[] = [
  {
    label: 'MVP',
    value: m ? signedPct(m.mvp, 2) : '-',
    accent: m && m.mvp >= TARGET_MVP ? SUCCESS : DANGER,
    color: m && m.mvp >= TARGET_MVP ? SUCCESS_TXT : DANGER_TXT
  },
  { label: 'Strain', value: m ? signedPct(m.strain, 2) : '-', accent: WARN, color: WARN_TXT },
  { label: 'M&E', value: `${quote.inputs.me} bps`, accent: pal.primary, color: INK },
  { label: 'Premium', value: premiumShort(quote.inputs.premium), accent: pal.primary, color: INK },
  { label: 'Lives', value: `${quote.inputs.lives}`, accent: pal.primary, color: INK },
  { label: 'Break-even', value: m ? `Month ${m.breakEven}` : '-', accent: pal.primary, color: INK }];

  const tileW = 118;
  const tileH = 54;
  const tileX = W - M - tileW * 2 - 10;
  tiles.forEach((t, i) => {
    const tx = tileX + i % 2 * (tileW + 10);
    const ty = summaryTop - 4 + Math.floor(i / 2) * (tileH + 10);
    fill(CANVAS);
    doc.roundedRect(tx, ty, tileW, tileH, 4, 4, 'F');
    fill(t.accent);
    doc.rect(tx, ty + 4, 2.5, tileH - 8, 'F');
    ink(MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    text(t.label.toUpperCase(), tx + 12, ty + 18, { charSpace: 0.5 });
    ink(t.color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    text(t.value, tx + 12, ty + 40);
  });
  y = summaryTop - 4 + (tileH * 3 + 20) + 26;

  // ---- Governance thresholds ----
  sectionTitle('Governance Thresholds', '(frozen at submission)');
  ensure(22 + governanceThresholds.length * 22);
  fill(CANVAS);
  doc.rect(M, y - 14, CW, 22, 'F');
  ink(MUTED);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  text('THRESHOLD', M + 10, y, { charSpace: 0.5 });
  text('VALUE', M + 300, y, { charSpace: 0.5 });
  y += 22;
  governanceThresholds.forEach((g) => {
    ink(INK);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    text(g.label, M + 10, y);
    doc.setFont('helvetica', 'bold');
    text(g.value, M + 300, y);
    stroke(LINE);
    doc.setLineWidth(0.6);
    doc.line(M, y + 8, W - M, y + 8);
    y += 22;
  });
  y += 18;

  // ---- Readiness checks ----
  sectionTitle('Readiness Checks');
  const pills: {label: string;fill: string;stroke: string;color: string;}[] = [
  { label: `${summary.passed} PASS`, fill: SUCCESS_TINT, stroke: SUCCESS, color: SUCCESS_TXT },
  { label: `${summary.failed} FAIL`, fill: DANGER_TINT, stroke: DANGER, color: DANGER_TXT },
  { label: `${summary.warned} WARN`, fill: WARN_TINT, stroke: WARN, color: WARN_TXT }];

  let px = M;
  pills.forEach((p) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const w = doc.getTextWidth(p.label) + p.label.length * 0.5 + 24;
    fill(p.fill);
    stroke(p.stroke);
    doc.setLineWidth(0.8);
    doc.roundedRect(px, y - 12, w, 20, 10, 10, 'FD');
    ink(p.color);
    text(p.label, px + 12, y + 1, { charSpace: 0.5 });
    px += w + 8;
  });
  y += 26;

  checks.forEach((c) => {
    ensure(34);
    const base = c.state === 'pass' ? SUCCESS : c.state === 'fail' ? DANGER : WARN;
    if (c.state === 'fail') {
      fill(DANGER_TINT);
      doc.roundedRect(M, y - 14, CW, 32, 3, 3, 'F');
    } else if (c.state === 'warn') {
      fill(WARN_TINT);
      doc.roundedRect(M, y - 14, CW, 32, 3, 3, 'F');
    }
    const cx = M + 12;
    const cy = y - 1;
    fill(base);
    doc.circle(cx, cy, 7, 'F');
    stroke('#FFFFFF');
    doc.setLineWidth(1.4);
    if (c.state === 'pass') {
      doc.line(cx - 3, cy, cx - 0.8, cy + 2.4);
      doc.line(cx - 0.8, cy + 2.4, cx + 3.2, cy - 2.6);
    } else if (c.state === 'fail') {
      doc.line(cx - 2.5, cy - 2.5, cx + 2.5, cy + 2.5);
      doc.line(cx - 2.5, cy + 2.5, cx + 2.5, cy - 2.5);
    } else {
      doc.line(cx, cy - 3, cx, cy + 0.6);
      fill('#FFFFFF');
      doc.circle(cx, cy + 3, 0.8, 'F');
    }
    ink(c.state === 'fail' ? DANGER_TXT : c.state === 'warn' ? WARN_TXT : INK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    text(c.label, M + 28, y - 3);
    ink(MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const val = doc.splitTextToSize(safe(c.value), CW - 40)[0] as string;
    doc.text(val, M + 28, y + 9);
    if (c.state === 'pass') {
      stroke(LINE);
      doc.setLineWidth(0.5);
      doc.line(M + 28, y + 15, W - M, y + 15);
    }
    y += 34;
  });

  // ---- Attestation ----
  y += 6;
  const attestation = safe(
    `This evidence packet represents a frozen snapshot of the case at submission time. All metrics, thresholds, and readiness checks reflect the state as of ${stamp}. Generated ${dateLong} by the NYL AutoQuote Pricing Engine.`
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const lines = doc.splitTextToSize(attestation, CW - 32) as string[];
  const boxH = 38 + lines.length * 12;
  ensure(boxH + 8);
  fill(pal.primaryTint);
  stroke(pal.primary);
  doc.setLineWidth(1);
  doc.roundedRect(M, y, CW, boxH, 6, 6, 'FD');
  ink(pal.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  text('ATTESTATION', M + 16, y + 20, { charSpace: 0.6 });
  ink(INK);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(lines, M + 16, y + 36);

  // ---- Footers ----
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    stroke(LINE);
    doc.setLineWidth(0.6);
    doc.line(M, H - 46, W - M, H - 46);
    ink(MUTED);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    text('CONFIDENTIAL - For Internal Use Only', M, H - 32, { charSpace: 0.3 });
    doc.setFont('helvetica', 'normal');
    text(`Generated ${stamp} - NYL AutoQuote Pricing Engine`, M, H - 20);
    doc.setFont('helvetica', 'bold');
    text(`Page ${i} of ${pages}`, W - M, H - 32, { align: 'right' });
  }

  doc.setProperties({
    title: `Evidence Packet - ${quote.name}`,
    subject: 'Pricing Submission Snapshot',
    author: 'NYL AutoQuote Pricing Engine'
  });

  const file = `Evidence_Packet_${quote.name.replace(/[^a-z0-9]+/gi, '_')}_R${quote.round}.pdf`;
  doc.save(file);
}
