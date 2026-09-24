import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import {
  AlertTriangleIcon,
  BoldIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  CommandIcon,
  FileIcon,
  FilterIcon,
  FolderIcon,
  InboxIcon,
  InfoIcon,
  ItalicIcon,
  ListIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PaletteIcon,
  SearchIcon,
  TrophyIcon,
  UnderlineIcon,
  UploadIcon,
  UserIcon,
  XIcon,
  ZapIcon } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { themeColors } from '../utils/theme';

// ---------------------------------------------------------------------------
// Color swatches
// ---------------------------------------------------------------------------

interface Swatch {
  name: string;
  hex: string;
  usage: string;
  className: string;
}

function getBrandColors(theme: 'current' | 'client'): Swatch[] {
  const c = themeColors[theme];
  return [
  { name: 'Primary', hex: c.primary, usage: 'Buttons, links, active states, focus rings', className: 'bg-primary' },
  { name: 'Primary Hover', hex: c.primaryHover, usage: 'Hover state for primary buttons', className: 'bg-primary-hover' },
  { name: 'Primary Tint', hex: c.primaryTint, usage: 'Light backgrounds — selected rows, outline/ghost hover', className: 'bg-primary-tint border border-line' }];

}

function getNavColors(theme: 'current' | 'client'): Swatch[] {
  const c = themeColors[theme];
  return [
  { name: 'Nav Background', hex: c.nav, usage: 'Left sidebar background', className: 'bg-nav' },
  { name: 'Nav Hover', hex: c.navHover, usage: 'Sidebar item hover background', className: 'bg-nav-hover' },
  { name: 'Nav Text', hex: c.navText, usage: 'Sidebar item & section label text', className: 'bg-nav-text' },
  { name: 'Nav Active Background', hex: c.navActiveBg, usage: 'Highlight behind the active sidebar item', className: 'bg-navActive' },
  { name: 'Nav Active Text', hex: c.navActiveText, usage: 'Text on the active sidebar item', className: 'bg-navActive-text' }];

}

const coreColors: Swatch[] = [
{ name: 'Ink', hex: '#111827', usage: 'Primary body & heading text', className: 'bg-ink' },
{ name: 'Muted', hex: '#6B7280', usage: 'Secondary / helper text', className: 'bg-muted' },
{ name: 'Canvas', hex: '#F1F3F5', usage: 'Main page background', className: 'bg-canvas border border-line' },
{ name: 'Line', hex: '#E5E7EB', usage: 'Borders and dividers', className: 'bg-line' }];


const statusColors: Swatch[] = [
{ name: 'Success', hex: '#16A34A', usage: 'Positive states, confirmations', className: 'bg-success' },
{ name: 'Success Tint', hex: '#ECFDF3', usage: 'Success banner background', className: 'bg-success-tint border border-line' },
{ name: 'Warning', hex: '#F59E0B', usage: 'Caution, needs-attention states', className: 'bg-warning' },
{ name: 'Warning Tint', hex: '#FFFBEB', usage: 'Warning banner background', className: 'bg-warning-tint border border-line' },
{ name: 'Danger', hex: '#DC2626', usage: 'Errors, destructive actions', className: 'bg-danger' },
{ name: 'Danger Tint', hex: '#FEF2F2', usage: 'Error banner background', className: 'bg-danger-tint border border-line' }];


const nylStatusColors: Swatch[] = [
{
  name: 'Success (Green)',
  hex: '#28A745',
  usage: 'Success badges, "Active" status, "Resolved" metrics, user role badge (default/VIEWER), positive health scores, closed-rate indicators',
  className: 'bg-[#28A745]'
},
{
  name: 'Success (Green) Tint',
  hex: '#F2FAF4',
  usage: 'Light background for success badges and banners',
  className: 'bg-[#F2FAF4] border border-line'
},
{
  name: 'Warning (Amber)',
  hex: '#F0A500',
  usage: 'Warning banners, "Near SLA" metrics, "Needs Attention" health label, user role badge (CROSS_LOB)',
  className: 'bg-[#F0A500]'
},
{
  name: 'Warning (Amber) Tint',
  hex: '#FEFAF0',
  usage: 'Light background for warning banners and badges',
  className: 'bg-[#FEFAF0] border border-line'
},
{
  name: 'Danger (Red)',
  hex: '#DC3545',
  usage: 'Danger buttons, "Breached/Overdue" metrics, "Critical" health label, error messages, delete actions',
  className: 'bg-[#DC3545]'
},
{
  name: 'Danger (Red) Tint',
  hex: '#FDF3F4',
  usage: 'Light background for error messages and danger badges',
  className: 'bg-[#FDF3F4] border border-line'
}];


function SwatchGrid({ swatches }: {swatches: Swatch[];}): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {swatches.map((s) =>
      <div key={s.name} className="flex items-start gap-3">
          <div className={`h-10 w-10 shrink-0 rounded-md ${s.className}`} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{s.name}</p>
            <p className="text-micro text-muted tnum">{s.hex}</p>
            <p className="mt-0.5 text-micro text-muted">{s.usage}</p>
          </div>
        </div>
      )}
    </div>);

}

function TypeRow({
  sizeLabel,
  sampleClassName,
  weight = 'font-normal'
}: {sizeLabel: string;sampleClassName: string;weight?: string;}): JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
      <p className={`${sampleClassName} ${weight} text-ink`}>
        The quick brown fox jumps over
      </p>
      <span className="shrink-0 text-micro text-muted tnum">{sizeLabel}</span>
    </div>);

}

// ---------------------------------------------------------------------------
// AWS Quick App prompts
// ---------------------------------------------------------------------------

function PromptBlock({ text }: {text: string;}): JSX.Element {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — nothing to do, user can still select the text manually.
    }
  };

  return (
    <div className="mt-4 rounded-md border border-line bg-canvas">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
          Prompt for AWS Quick App
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 text-micro font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          {copied ?
          <CheckIcon className="h-3 w-3" strokeWidth={2} /> :

          <ClipboardIcon className="h-3 w-3" strokeWidth={1.75} />
          }
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap px-3 py-2.5 font-mono text-micro leading-5 text-ink">{text}</pre>
    </div>);

}

function getPrompts(theme: 'current' | 'client'): Record<string, string> {
  const c = themeColors[theme];
  return {
    master: `Design system for "AutoQuote Pricing Portal", a professional B2B insurance pricing tool. Tone: clean, precise, trustworthy, minimal decoration, data-dense but uncluttered.

Font: Inter (fallback Segoe UI, system-ui, sans-serif). Type scale: 22px bold for page titles, 15px semibold for card titles, 14px regular for body text, 13px medium for buttons and secondary text, 12px regular for labels, 11px semibold uppercase with wide letter-spacing for section labels/micro tags, 34px bold for large KPI numbers. Numbers use tabular figures so they align in columns.

Color tokens:
- Primary ${c.primary} — buttons, links, active states, focus rings
- Primary hover ${c.primaryHover}
- Primary tint ${c.primaryTint} — light selected/hover backgrounds
- Ink #111827 — body and heading text
- Muted #6B7280 — secondary/helper text
- Canvas #F1F3F5 — page background
- Line #E5E7EB — borders and dividers
- Success #28A745 (tint #F2FAF4), Warning #F0A500 (tint #FEFAF0), Danger #DC3545 (tint #FDF3F4)
- Left sidebar background ${c.nav}, hover ${c.navHover}, text ${c.navText}, active item background ${c.navActiveBg} with text ${c.navActiveText}

Surfaces: white cards on the canvas background, 10px corner radius, 1px solid Line-colored border, soft shadow (0 1px 3px rgba(0,0,0,0.08)). Cards can show a 2px colored top border (primary/warning/danger) as a status accent.

Interactive elements: every focusable control shows a visible 2px Primary-colored focus ring. All text/background pairs meet WCAG AA contrast (4.5:1 normal text, 3:1 large text/icons). Every form control has a visible label.`,

    typography: `Typography scale for a data-dense enterprise app using Inter font. Page title: 22px bold, text color #111827. Card title: 15px semibold, #111827. Body text: 14px regular, #111827. Button and secondary text: 13px medium, #111827. Field labels and meta text: 12px regular, #6B7280. Section labels / tags: 11px semibold, uppercase, wide letter-spacing, #6B7280. Large KPI numbers: 34px bold, #111827, with tabular figures for alignment. Keep line-height comfortable for scanning dense tables and forms.`,

    buttons: `Button component with 5 variants, 36px tall (32px small size), rounded-md (6-8px) corners, 13px medium-weight label, horizontal icon+label layout with 8px gap.
- Primary: solid fill ${c.primary}, white (#FFFFFF) text, darkens to ${c.primaryHover} on hover.
- Secondary: white (#FFFFFF) background, 1px border #E5E7EB, text #111827, hover fills #F1F3F5.
- Outline: white (#FFFFFF) background, ${c.primary} 1px border and text, hover fills ${c.primaryTint}.
- Ghost: transparent background, ${c.primary} text, hover fills ${c.primaryTint}.
- Danger: white (#FFFFFF) background, text #DC3545, hover fills #FDF3F4.
Disabled state: 50% opacity, not-allowed cursor. Every button shows a 2px ${c.primary} focus ring when tabbed to.`,

    buttonGroups: `Segmented button group for single-selection choices (e.g. Day/Week/Month). Buttons sit edge-to-edge inside one rounded-md container with a shared 1px border #E5E7EB and a 1px divider (#E5E7EB) between segments. Selected segment: solid ${c.primary} background with white (#FFFFFF) text. Unselected segments: white (#FFFFFF) background, #111827 text, hover fills #F1F3F5. Use aria-pressed on each button to expose selection state to screen readers.`,

    avatars: `Circular avatar component in 3 sizes (28px, 36px, 48px). Default style: ${c.primaryTint} background, ${c.primary} initials text (2 letters, semibold), 1px ${c.primary} border at 30% opacity. Fallback (no name known): #F1F3F5 background with a #6B7280 generic person icon instead of initials.`,

    badges: `Pill-shaped badge/tag component, 12px medium text, small rounded-full shape with a 1px border. Tone variants:
- Neutral: background #F1F3F5, text #6B7280, border #E5E7EB.
- Primary: background ${c.primaryTint}, text ${c.primary}, border ${c.primary} at 30% opacity.
- Success: background #F2FAF4, text #15803D, border #28A745 at 40% opacity.
- Warning: background #FEFAF0, text #92400E, border #F0A500 at 40% opacity.
- Danger: background #FDF3F4, text #B91C1C, border #DC3545 at 40% opacity.
Also include a small circular notification-count badge: solid #DC3545 background, white (#FFFFFF) bold number, positioned at the top-right corner of an icon.`,

    tagsTabs: `Two related patterns.
Tags: removable chip with white (#FFFFFF) background, 1px border #E5E7EB, rounded-full shape, 12px medium text #111827, and a small "x" remove button on the right that fills #F1F3F5 on hover.
Tabs: horizontal row of text labels separated by a thin bottom border line (#E5E7EB). Active tab: ${c.primary} text with a 2px ${c.primary} underline. Inactive tabs: #6B7280 text, no underline, turns #111827 on hover.`,

    checkboxes: `Checkbox input, 16x16px, rounded corners (4px), 1px border #E5E7EB. Checked state fills with ${c.primary} and shows a white (#FFFFFF) checkmark (native accent-color set to ${c.primary}). Indeterminate state shows a horizontal white dash instead of a checkmark. Disabled state is 50% opacity with a not-allowed cursor. Label sits to the right of the box in 13px text #111827. Focus shows a 2px ${c.primary} ring with a 1px offset.`,

    radio: `Radio button input, 16x16px circle, 1px border #E5E7EB. Selected state fills the center dot with ${c.primary} (native accent-color set to ${c.primary}). Grouped radios share the same name so only one can be selected at a time. Disabled option is 50% opacity. Label sits to the right in 13px text #111827. Focus shows a 2px ${c.primary} ring with a 1px offset.`,

    toggles: `Toggle switch, pill-shaped track 36x20px with a round 16px white (#FFFFFF) thumb. Off state: track #E5E7EB, thumb on the left. On state: track ${c.primary}, thumb slides to the right with a smooth transition. Disabled: 50% opacity. Use switch semantics (role="switch"). Label sits to the right in 13px text #111827. Focus shows a 2px ${c.primary} ring around the track.`,

    sliders: `Horizontal range slider, 8px tall track with fully rounded ends, unfilled track color #E5E7EB, native browser thumb tinted ${c.primary}. Show the current numeric value above the slider in bold ${c.primary} text, and min/max labels in small #6B7280 text below the track ends.`,

    inputs: `Text input / form field group. Field wrapper: 12px label in #6B7280 above a 36px-tall input with a 1px border #E5E7EB, 6px corner radius, white (#FFFFFF) background, 10px horizontal padding, 14px text #111827.
States: Default (border #E5E7EB). Focus (border turns ${c.primary} plus a soft ${c.primary} glow ring at 20% opacity). Required field shows a red (#DC3545) asterisk after the label. Error state: border #DC3545, glow ring #DC3545 at 20% opacity, and a small helper line below the field in #DC3545 explaining the problem. Disabled: background #F1F3F5, text #6B7280, not-allowed cursor.`,

    select: `Native-style select/dropdown field, same sizing and border treatment as the text input (36px tall, 1px border #E5E7EB, 6px radius, white #FFFFFF background, text #111827). Focus state turns the border ${c.primary} with a soft glow ring at 20% opacity. Disabled state uses background #F1F3F5 and text #6B7280 with a not-allowed cursor.`,

    dropdownDatepicker: `Two components.
Dropdown menu: a button labeled "Actions" with a chevron-down icon opens a floating white (#FFFFFF) panel below it — 1px border #E5E7EB, 8px corner radius, drop shadow (0 8px 24px rgba(0,0,0,0.12)), list of plain-text menu items (#111827) that fill #F1F3F5 on hover/focus.
Date picker: a text input with a small #6B7280 calendar icon on the left side, native browser date picker on click, same border/focus treatment as other inputs (border #E5E7EB, focus border ${c.primary}).`,

    textEditor: `Simple rich-text editor pattern: a bordered container (1px border #E5E7EB) with a compact toolbar strip along the top (background #F1F3F5, bottom border #E5E7EB) containing icon-only buttons for Bold, Italic, Underline, and Bulleted list — each a 28px square button, icon color #6B7280, that turns #111827 and fills white (#FFFFFF) on hover. Below the toolbar, a plain multi-line text area with no visible border, white (#FFFFFF) background, comfortable padding, and placeholder text in #6B7280.`,

    progress: `Linear progress bar: 8px tall, fully rounded, track color #F1F3F5, colored fill that grows from left to right. Tone variants: ${c.primary} (default/in-progress), #F0A500 (needs attention), #28A745 (complete). Show a numeric percentage label above the bar in small #6B7280 text. Also include an indeterminate spinner: a small rotating ring icon in ${c.primary}, paired with a #6B7280 status label like "Processing…".`,

    tooltips: `Tooltip: small rounded rectangle, background #111827, white (#FFFFFF) 11px text, appears above the trigger element on hover or keyboard focus, with a brief fade-in transition. Keep tooltip text short (one line where possible) and attach it to icon buttons or info icons that need extra context.`,

    commandMenu: `Command palette / quick-search overlay: a semi-transparent dark backdrop (#111827 at 50% opacity) covering the screen, with a centered white (#FFFFFF) panel (rounded corners, drop shadow 0 8px 24px rgba(0,0,0,0.12)) near the top of the viewport. Panel header is a borderless search input (text #111827, placeholder #6B7280) with a #6B7280 search icon on the left and an "Esc" hint (background #F1F3F5, text #6B7280) on the right. Below, grouped results are listed under small uppercase #6B7280 section labels, each result row showing an icon, a label (#111827), and a keyboard-shortcut hint on the right; rows highlight with a ${c.primaryTint} background and ${c.primary} text on hover/focus. Closes on Escape or clicking outside the panel.`,

    filters: `Filter bar: a row of pill-shaped toggle buttons for quick status filters (selected pill fills solid ${c.primary} with white #FFFFFF text, unselected pills are white #FFFFFF with a 1px border #E5E7EB and text #111827), plus a rectangular toggle button for a personal filter like "Mine" (selected state uses background ${c.primaryTint} with ${c.primary} text and border). Below, an "Active filters" row shows removable chip tags (white #FFFFFF background, border #E5E7EB) summarizing applied filters, with a "Clear all" text link in ${c.primary} at the end.`,

    fileUpload: `File upload dropzone: a large dashed-border (#E5E7EB) rectangle with background #F1F3F5, a #6B7280 upload-cloud icon, "Drag & drop a file here, or" text in #111827, a "Browse files" outline button (${c.primary} border/text), and small helper text in #6B7280 listing accepted formats/size limit. Once a file is added, show it as a row below (1px border #E5E7EB): file icon in ${c.primary}, file name in #111827, a small progress bar, and a #28A745 checkmark once complete.`,

    emptyState: `Empty state pattern: centered content inside a dashed border (#E5E7EB), background #F1F3F5, rounded box. A circular ${c.primaryTint} badge holds a simple line icon in ${c.primary}. Below it, a short bold heading (15px, #111827) and one line of explanatory text (13px, #6B7280). Optionally include a primary button call-to-action beneath the text. Use one version for "no data yet" (with a CTA button) and one for "no search results" (without a CTA).`,

    modals: `Modal dialog: semi-transparent dark backdrop (#111827 at 50% opacity), centered white (#FFFFFF) panel (max ~420px wide, rounded corners, drop shadow 0 8px 24px rgba(0,0,0,0.12)). Header row has a bold 15px title (#111827) on the left and a small round close (x) button (#6B7280, hover fills #F1F3F5) on the right, separated from the body by a thin bottom border (#E5E7EB). Body has one short paragraph of explanatory text in #6B7280. Footer, separated by a thin top border (#E5E7EB), right-aligns a "Cancel" secondary button and a confirm button. Three tones: Default (neutral secondary-style confirm button), Confirmation (${c.primary} confirm button, e.g. "Submit"), Destructive (#DC3545 confirm button, e.g. "Delete", with a small #DC3545 warning icon on a #FDF3F4 circular badge next to the title). Closes on the Escape key or clicking the backdrop.`,

    tablePagination: `Data table: header row background #F1F3F5, small uppercase column labels in #6B7280. Body rows are separated by thin divider lines (#E5E7EB) and highlight with background #F1F3F5 on hover (row text #111827). Include a status badge column and a right-aligned numeric column with tabular figures. Below the table, a pagination bar shows "Showing X–Y of Z" in #6B7280 on the left and page controls on the right: previous/next chevron buttons (border #E5E7EB, icon #6B7280) plus numbered page buttons (current page filled solid ${c.primary} with white #FFFFFF text, others white #FFFFFF with border #E5E7EB and text #111827).`,

    treeview: `Expandable tree list for hierarchical data (e.g. product categories). Each row has a #6B7280 chevron icon that rotates 90° when expanded, a #6B7280 folder or file icon, and a text label (#111827), indented 20px per depth level. Selected row gets a ${c.primaryTint} background with ${c.primary} bold text. Rows highlight with background #F1F3F5 on hover. Use proper tree/treeitem accessibility roles so screen readers announce expand state and selection.`,

    cards: `Card container: white (#FFFFFF) background, 10px corner radius, 1px border #E5E7EB, soft drop shadow (0 1px 3px rgba(0,0,0,0.08)). Optional header row with a bold 15px title (#111827) and small meta text (#6B7280) beneath it, plus an optional right-aligned action button/link. Optional 2px colored top border strip (${c.primary} for emphasis, #F0A500 for warning, #DC3545 for danger) to flag the card's status at a glance.`,

    layout: `Page layout: background #F1F3F5 (canvas) for the whole app, with white (#FFFFFF) rounded cards floating on top for content sections — this contrast is what gives the app its clean, organized feel. Comfortable spacing between cards (~20px), generous internal card padding (~20px), and a consistent left sidebar (${c.nav} background) + top bar (white #FFFFFF) shell around all pages.`
  };
}

// ---------------------------------------------------------------------------
// Shared section scaffolding
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
{ id: 'colors', label: 'Colors' },
{ id: 'typography', label: 'Typography' },
{ id: 'buttons', label: 'Buttons' },
{ id: 'button-groups', label: 'Button Groups' },
{ id: 'avatars', label: 'Avatars' },
{ id: 'badges', label: 'Badges' },
{ id: 'tags-tabs', label: 'Tags & Tabs' },
{ id: 'checkboxes', label: 'Checkboxes' },
{ id: 'radio-buttons', label: 'Radio Buttons' },
{ id: 'toggles', label: 'Toggles' },
{ id: 'sliders', label: 'Sliders' },
{ id: 'inputs', label: 'Inputs / Form Group' },
{ id: 'select', label: 'Select' },
{ id: 'dropdowns-datepicker', label: 'Dropdowns & Date Picker' },
{ id: 'text-editors', label: 'Text Editors' },
{ id: 'progress', label: 'Progress Indicator' },
{ id: 'tooltips', label: 'Tooltips' },
{ id: 'command-menus', label: 'Command Menus' },
{ id: 'filters', label: 'Filters' },
{ id: 'file-upload', label: 'File Upload' },
{ id: 'empty-state', label: 'Empty State' },
{ id: 'modals', label: 'Modals' },
{ id: 'table-pagination', label: 'Table & Pagination' },
{ id: 'treeview', label: 'Treeview' },
{ id: 'cards', label: 'Cards' },
{ id: 'layout', label: 'Layout' }];


function SectionAnchor({ id, children }: {id: string;children: React.ReactNode;}): JSX.Element {
  return <div id={id} className="scroll-mt-6">{children}</div>;
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({
  initials,
  size = 'md',
  tone = 'primary'
}: {initials?: string;size?: 'sm' | 'md' | 'lg';tone?: 'primary' | 'muted';}): JSX.Element {
  const sizes = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm' };
  const tones = {
    primary: 'border-primary/30 bg-primary-tint text-primary',
    muted: 'border-line bg-canvas text-muted'
  };
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border font-semibold ${sizes[size]} ${tones[tone]}`}>

      {initials ?? <UserIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
    </span>);

}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

function Badge({
  tone = 'neutral',
  children
}: {tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';children: React.ReactNode;}): JSX.Element {
  const tones = {
    neutral: 'bg-canvas text-muted border-line',
    primary: 'bg-primary-tint text-primary border-primary/30',
    success: 'bg-success-tint text-[#15803D] border-success/40',
    warning: 'bg-warning-tint text-[#92400E] border-warning/40',
    danger: 'bg-danger-tint text-[#B91C1C] border-danger/40'
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>);

}

// ---------------------------------------------------------------------------
// Checkbox / Radio / Toggle
// ---------------------------------------------------------------------------

function Checkbox({
  label,
  checked,
  onChange,
  indeterminate = false,
  disabled = false
}: {label: string;checked: boolean;onChange?: (v: boolean) => void;indeterminate?: boolean;disabled?: boolean;}): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);
  const id = `chk-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label htmlFor={id} className={`flex items-center gap-2 text-[13px] text-ink ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-line accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />

      {label}
    </label>);

}

function RadioOption({
  name,
  label,
  value,
  selected,
  onChange,
  disabled = false
}: {name: string;label: string;value: string;selected: string;onChange?: (v: string) => void;disabled?: boolean;}): JSX.Element {
  const id = `${name}-${value}`;
  return (
    <label htmlFor={id} className={`flex items-center gap-2 text-[13px] text-ink ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input
        id={id}
        type="radio"
        name={name}
        checked={selected === value}
        disabled={disabled}
        onChange={() => onChange?.(value)}
        className="h-4 w-4 border-line accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />

      {label}
    </label>);

}

function Toggle({
  label,
  checked,
  onChange,
  disabled = false
}: {label: string;checked: boolean;onChange?: (v: boolean) => void;disabled?: boolean;}): JSX.Element {
  const id = `tgl-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  return (
    <label htmlFor={id} className={`flex items-center gap-2.5 text-[13px] text-ink ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only" />

        <span className="absolute inset-0 rounded-full bg-line transition-colors duration-150 peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1" />
        <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-card transition-transform duration-150 peer-checked:translate-x-4" />
      </span>
      {label}
    </label>);

}

// ---------------------------------------------------------------------------
// Progress / Slider / Tags
// ---------------------------------------------------------------------------

function ProgressBar({ value, tone = 'primary' }: {value: number;tone?: 'primary' | 'success' | 'warning';}): JSX.Element {
  const tones = { primary: 'bg-primary', success: 'bg-success', warning: 'bg-warning' };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-canvas" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${value}%` }} />
    </div>);

}

function Tag({ children, onRemove }: {children: React.ReactNode;onRemove?: () => void;}): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-ink">
      {children}
      {onRemove &&
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${children}`}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-muted hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <XIcon className="h-3 w-3" strokeWidth={2} />
        </button>
      }
    </span>);

}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {icon: React.ElementType;title: string;description: string;action?: React.ReactNode;}): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line bg-canvas px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint">
        <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-[13px] text-muted">{description}</p>
      {action}
    </div>);

}

// ---------------------------------------------------------------------------
// Treeview
// ---------------------------------------------------------------------------

interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
}

const treeData: TreeNodeData[] = [
{
  id: 'eppvul',
  label: 'EPPVUL Products',
  children: [
  { id: 'avme', label: 'EPPVUL AVME' },
  { id: 'gsa', label: 'EPPVUL Gold Standard' }]

},
{
  id: 'boli',
  label: 'BOLI Products',
  children: [
  { id: 'boli-gs', label: 'BOLI Gold Standard' },
  { id: 'boli-internal', label: 'BOLI Internal MVP' }]

},
{ id: 'coli', label: 'COLI Products' }];


function TreeNode({
  node,
  depth,
  expanded,
  onToggle,
  selected,
  onSelect
}: {node: TreeNodeData;depth: number;expanded: Set<string>;onToggle: (id: string) => void;selected: string;onSelect: (id: string) => void;}): JSX.Element {
  const hasChildren = !!node.children?.length;
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;

  return (
    <div>
      <div
        role="treeitem"
        aria-selected={isSelected}
        tabIndex={0}
        onClick={() => onSelect(node.id)}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(node.id)}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        className={`flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-[13px] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isSelected ? 'bg-primary-tint font-medium text-primary' : 'text-ink hover:bg-canvas'}`
        }>

        {hasChildren ?
        <button
          type="button"
          onClick={(e) => {e.stopPropagation();onToggle(node.id);}}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          className="flex h-4 w-4 shrink-0 items-center justify-center text-muted">

            <ChevronRightIcon
            className={`h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
            strokeWidth={2} />

          </button> :

        <span className="h-4 w-4 shrink-0" />
        }
        {hasChildren ?
        <FolderIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} /> :

        <FileIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />
        }
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && isExpanded &&
      <div role="group">
          {node.children!.map((child) =>
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          expanded={expanded}
          onToggle={onToggle}
          selected={selected}
          onSelect={onSelect} />

        )}
        </div>
      }
    </div>);

}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

type ModalKind = 'default' | 'confirm' | 'danger' | null;

function ModalOverlay({
  kind,
  onClose
}: {kind: ModalKind;onClose: () => void;}): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!kind) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [kind, onClose]);

  if (!kind) return null;

  const copy = {
    default: {
      title: 'Case notes',
      body: 'Notes are visible to everyone with access to this case and are included in the audit trail.',
      confirmLabel: 'Save',
      confirmVariant: 'primary' as const,
      icon: null
    },
    confirm: {
      title: 'Submit for approval?',
      body: 'This sends the current round to the next approver in the workflow. You can still edit the case after submitting.',
      confirmLabel: 'Submit',
      confirmVariant: 'primary' as const,
      icon: null
    },
    danger: {
      title: 'Delete this quote?',
      body: 'This permanently removes the case and all of its rounds. This action cannot be undone.',
      confirmLabel: 'Delete',
      confirmVariant: 'danger' as const,
      icon: AlertTriangleIcon
    }
  }[kind];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ds-modal-title"
        tabIndex={-1}
        className="w-full max-w-md rounded-card border border-line bg-white shadow-pop focus:outline-none">

        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            {copy.icon &&
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-tint">
                <copy.icon className="h-4 w-4 text-danger" strokeWidth={1.75} aria-hidden="true" />
              </span>
            }
            <h2 id="ds-modal-title" className="text-[15px] font-semibold text-ink">
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <XIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-muted">{copy.body}</p>
        </div>
        <div className="flex justify-end gap-2.5 border-t border-line px-5 py-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={copy.confirmVariant} onClick={onClose}>{copy.confirmLabel}</Button>
        </div>
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// Command menu
// ---------------------------------------------------------------------------

const commandGroups = [
{
  label: 'Actions',
  items: [
  { icon: ZapIcon, label: 'Re-run pricing', hint: 'R' },
  { icon: CheckIcon, label: 'Submit for approval', hint: 'A' }]

},
{
  label: 'Navigate',
  items: [
  { icon: SearchIcon, label: 'Go to Quotes', hint: 'G Q' },
  { icon: CalendarIcon, label: 'Go to Dashboard', hint: 'G D' }]

}];


function CommandMenuOverlay({ open, onClose }: {open: boolean;onClose: () => void;}): JSX.Element | null {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 p-4 pt-24"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>

      <div role="dialog" aria-modal="true" aria-label="Command menu" className="w-full max-w-lg rounded-card border border-line bg-white shadow-pop">
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <SearchIcon className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="h-6 w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-0" />

          <kbd className="rounded border border-line bg-canvas px-1.5 py-0.5 text-micro text-muted">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto thin-scroll p-2">
          {commandGroups.map((group) =>
          <div key={group.label} className="mb-2 last:mb-0">
              <p className="px-2 py-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">{group.label}</p>
              {group.items.map((item) =>
            <button
              key={item.label}
              type="button"
              onClick={onClose}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-ink hover:bg-primary-tint hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                  <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="flex-1 truncate">{item.label}</span>
                  <kbd className="rounded border border-line bg-canvas px-1.5 py-0.5 text-micro text-muted">{item.hint}</kbd>
                </button>
            )}
            </div>
          )}
        </div>
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// Dropdown menu
// ---------------------------------------------------------------------------

function DropdownMenu(): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const items = ['Duplicate case', 'Export to PDF', 'Archive'];

  return (
    <div ref={ref} className="relative inline-block">
      <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)} icon={<ChevronDownIcon className="h-4 w-4" strokeWidth={1.75} />}>
        Actions
      </Button>
      {open &&
      <div role="menu" className="absolute left-0 z-10 mt-1.5 w-48 rounded-md border border-line bg-white py-1 shadow-pop">
          {items.map((item) =>
        <button
          key={item}
          role="menuitem"
          type="button"
          onClick={() => setOpen(false)}
          className="flex w-full items-center px-3 py-2 text-left text-[13px] text-ink hover:bg-canvas focus-visible:outline-none focus-visible:bg-canvas">

              {item}
            </button>
        )}
        </div>
      }
    </div>);

}

// ---------------------------------------------------------------------------
// Table + pagination
// ---------------------------------------------------------------------------

const tableRows = [
{ name: 'US Bank_01', status: 'Quoted', premium: '$5.0M' },
{ name: 'Regional Health Co.', status: 'Approved', premium: '$12.4M' },
{ name: 'Meridian Trust', status: 'Draft', premium: '$3.2M' },
{ name: 'Atlas Capital', status: 'Won', premium: '$8.7M' },
{ name: 'NorthGate Partners', status: 'Declined', premium: '$1.9M' }];


const tableStatusTone: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
  Quoted: 'primary',
  Approved: 'success',
  Won: 'success',
  Draft: 'warning',
  Declined: 'danger'
};

function TablePaginationDemo(): JSX.Element {
  const pageSize = 3;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tableRows.length / pageSize);
  const rows = tableRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas text-micro font-semibold uppercase tracking-[0.06em] text-muted">
              <th scope="col" className="px-4 py-2.5 text-left">Case</th>
              <th scope="col" className="px-4 py-2.5 text-left">Status</th>
              <th scope="col" className="px-4 py-2.5 text-right">Premium</th>
              <th scope="col" className="w-12 px-4 py-2.5 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
            <tr key={row.name} className="border-b border-line last:border-0 hover:bg-canvas/70">
                <td className="px-4 py-3 text-[13px] font-medium text-ink">{row.name}</td>
                <td className="px-4 py-3"><Badge tone={tableStatusTone[row.status]}>{row.status}</Badge></td>
                <td className="px-4 py-3 text-right text-[13px] font-semibold text-ink tnum">{row.premium}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" aria-label={`More actions for ${row.name}`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <MoreVerticalIcon className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-micro text-muted tnum">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, tableRows.length)} of {tableRows.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <ChevronLeftIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`h-7 min-w-7 rounded-md border px-2 text-xs font-medium tnum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            p === page ? 'border-primary bg-primary text-white' : 'border-line text-ink hover:bg-canvas'}`
            }>

              {p}
            </button>
          )}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <ChevronRightIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

function TooltipDemo({ label, tip }: {label: string;tip: string;}): JSX.Element {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-white px-3 text-[13px] font-medium text-ink hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

        <InfoIcon className="h-4 w-4 text-muted" strokeWidth={1.75} />
        {label}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-2 left-1/2 w-max max-w-[200px] -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2.5 py-1.5 text-micro text-white opacity-0 shadow-pop transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">

        {tip}
      </span>
    </span>);

}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function DesignSystemPage(): JSX.Element {
  const { theme } = useTheme();
  const themeLabel = theme === 'current' ? 'Current' : 'Client';
  const prompts = getPrompts(theme);

  // Interactive demo state
  const [tab, setTab] = useState('overview');
  const [checks, setChecks] = useState({ a: true, b: false, c: false });
  const [radio, setRadio] = useState('annual');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [slider, setSlider] = useState(65);
  const [tags, setTags] = useState(['EPPVUL', 'DE', 'Goldman Sachs']);
  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['eppvul']));
  const [selectedNode, setSelectedNode] = useState('avme');
  const [filterMine, setFilterMine] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['Status: Quoted', 'Product: EPPVUL']);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <PageHeader
        title="Design System"
        subtitle="Reference for colors, typography, and components used across AutoQuote. Purely informational — does not affect other pages." />


      <div className="mb-5 flex items-center gap-2.5 rounded-md border border-primary/30 bg-primary-tint px-3.5 py-2.5 text-[13px] text-primary">
        <PaletteIcon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        Showing the <span className="font-semibold">{themeLabel}</span> theme palette — components below use shared tokens, so every one re-colors automatically when you switch themes in the top bar.
      </div>

      <Card accent="primary" title={`Master Theme Prompt — ${themeLabel} theme`} meta="Paste this once into AWS Quick App before the component prompts below" className="mb-5">
        <p className="text-[13px] text-muted">
          Sets up the overall look and feel (fonts, colors, surfaces, accessibility rules) so every screen you generate afterwards stays consistent. Re-copy this if you switch the theme toggle above.
        </p>
        <PromptBlock text={prompts.master} />
      </Card>

      <Card accent="primary" title="On this page" className="mb-5" bodyClassName="pt-3">
        <nav aria-label="Design system sections" className="flex flex-wrap gap-1.5">
          {sections.map((s) =>
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-line px-2.5 py-1 text-micro font-medium text-muted hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              {s.label}
            </a>
          )}
        </nav>
      </Card>

      <div className="space-y-5">
        <SectionAnchor id="colors">
          <div className="space-y-5">
            <Card accent="primary" title={`Brand Colors — ${themeLabel} theme`} meta="Switches with the top-bar theme toggle">
              <SwatchGrid swatches={getBrandColors(theme)} />
            </Card>
            <Card accent="primary" title={`Navigation Colors — ${themeLabel} theme`} meta="Left sidebar tokens, switches with the theme toggle">
              <SwatchGrid swatches={getNavColors(theme)} />
            </Card>
            <Card accent="primary" title="Core Colors" meta="Text and surface tokens — same across both themes">
              <SwatchGrid swatches={coreColors} />
            </Card>
            {/* <Card accent="primary" title="Status Colors" meta="Success, warning, and danger states — same across both themes">
              <SwatchGrid swatches={statusColors} />
            </Card> */}
            <Card accent="primary" title="Status Colors" meta="NYL-specific status palette and usage mapping">
              <SwatchGrid swatches={nylStatusColors} />
            </Card>
          </div>
        </SectionAnchor>

        <SectionAnchor id="typography">
          <Card accent="primary" title="Typography" meta="Inter, with system-ui fallback">
            <TypeRow sizeLabel="22px · bold — Page title" sampleClassName="text-[22px]" weight="font-bold" />
            <TypeRow sizeLabel="15px · semibold — Card title" sampleClassName="text-[15px]" weight="font-semibold" />
            <TypeRow sizeLabel="14px · regular — Body" sampleClassName="text-sm" />
            <TypeRow sizeLabel="13px · medium — Buttons / secondary text" sampleClassName="text-[13px]" weight="font-medium" />
            <TypeRow sizeLabel="12px · regular — Labels / meta" sampleClassName="text-xs" />
            <TypeRow sizeLabel="11px · semibold uppercase — Micro tags" sampleClassName="text-micro uppercase tracking-[0.06em]" weight="font-semibold" />
            <TypeRow sizeLabel="34px · bold — KPI numbers" sampleClassName="text-[34px] tnum" weight="font-bold" />
            <PromptBlock text={prompts.typography} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="buttons">
          <Card accent="primary" title="Buttons" meta="Variants × sizes">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" icon={<ZapIcon className="h-4 w-4" strokeWidth={1.75} />}>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Primary sm</Button>
                <Button variant="secondary" size="sm">Secondary sm</Button>
                <Button variant="outline" size="sm">Outline sm</Button>
                <Button variant="ghost" size="sm">Ghost sm</Button>
                <Button variant="danger" size="sm">Danger sm</Button>
              </div>
            </div>
            <PromptBlock text={prompts.buttons} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="button-groups">
          <Card accent="primary" title="Button Groups" meta="Segmented, single-selection control">
            <div role="group" aria-label="View" className="inline-flex overflow-hidden rounded-md border border-line">
              {['Day', 'Week', 'Month'].map((opt, i) =>
              <button
                key={opt}
                type="button"
                onClick={() => setTab(opt)}
                aria-pressed={tab === opt}
                className={`px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                i > 0 ? 'border-l border-line' : ''} ${
                tab === opt ? 'bg-primary text-white' : 'bg-white text-ink hover:bg-canvas'}`
                }>

                  {opt}
                </button>
              )}
            </div>
            <PromptBlock text={prompts.buttonGroups} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="avatars">
          <Card accent="primary" title="Avatars" meta="Initials, icon fallback, sizes">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar initials="KY" size="sm" />
              <Avatar initials="KY" size="md" />
              <Avatar initials="KY" size="lg" />
              <Avatar size="md" tone="muted" />
            </div>
            <PromptBlock text={prompts.avatars} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="badges">
          <Card accent="primary" title="Badges" meta="Status pills and notification counts">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="success">Approved</Badge>
              <Badge tone="warning">Draft</Badge>
              <Badge tone="danger">Declined</Badge>
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted">
                <TrophyIcon className="h-4 w-4" strokeWidth={1.75} />
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white tnum">3</span>
              </span>
            </div>
            <PromptBlock text={prompts.badges} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="tags-tabs">
          <Card accent="primary" title="Tags &amp; Tabs" meta="Removable chips and underline tab navigation">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-micro font-semibold uppercase tracking-[0.06em] text-muted">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) =>
                  <Tag key={t} onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}>{t}</Tag>
                  )}
                  {tags.length === 0 && <p className="text-micro text-muted">No tags — removed them all.</p>}
                </div>
              </div>
              <div>
                <p className="mb-2 text-micro font-semibold uppercase tracking-[0.06em] text-muted">Tabs</p>
                <div className="flex gap-1 border-b border-line">
                  {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'pricing', label: 'Pricing' },
                  { id: 'history', label: 'History' }].
                  map((t) =>
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`-mb-px border-b-2 px-3.5 py-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`
                    }>

                      {t.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <PromptBlock text={prompts.tagsTabs} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="checkboxes">
          <Card accent="primary" title="Checkboxes" meta="Default, checked, indeterminate, disabled">
            <div className="flex flex-col gap-3">
              <Checkbox label="Include lapsed cases" checked={checks.a} onChange={(v) => setChecks((p) => ({ ...p, a: v }))} />
              <Checkbox label="Notify approver by email" checked={checks.b} onChange={(v) => setChecks((p) => ({ ...p, b: v }))} />
              <Checkbox label="Select all (indeterminate)" checked={false} indeterminate onChange={() => {}} />
              <Checkbox label="Locked field (disabled)" checked disabled />
            </div>
            <PromptBlock text={prompts.checkboxes} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="radio-buttons">
          <Card accent="primary" title="Radio Buttons" meta="Single-select group">
            <div className="flex flex-col gap-3">
              <RadioOption name="ds-billing" label="Annual premium" value="annual" selected={radio} onChange={setRadio} />
              <RadioOption name="ds-billing" label="Monthly premium" value="monthly" selected={radio} onChange={setRadio} />
              <RadioOption name="ds-billing" label="Single premium (disabled)" value="single" selected={radio} disabled />
            </div>
            <PromptBlock text={prompts.radio} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="toggles">
          <Card accent="primary" title="Toggles" meta="On, off, disabled">
            <div className="flex flex-col gap-3">
              <Toggle label="Auto-recalculate on input change" checked={toggle1} onChange={setToggle1} />
              <Toggle label="Send weekly digest" checked={toggle2} onChange={setToggle2} />
              <Toggle label="Locked setting (disabled)" checked disabled />
            </div>
            <PromptBlock text={prompts.toggles} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="sliders">
          <Card accent="primary" title="Sliders" meta="Range input with live value">
            <div className="max-w-sm">
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <label htmlFor="ds-slider" className="font-medium text-ink">M&amp;E target</label>
                <span className="font-semibold text-primary tnum">{slider} bps</span>
              </div>
              <input
                id="ds-slider"
                type="range"
                min={0}
                max={300}
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />

              <div className="mt-1 flex justify-between text-micro text-muted tnum">
                <span>0</span>
                <span>300</span>
              </div>
            </div>
            <PromptBlock text={prompts.sliders} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="inputs">
          <Card accent="primary" title="Inputs / Form Group" meta="Default, focus, error, disabled, with hint">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="ds-input-default" className="mb-1 text-xs text-muted">Case Name</label>
                <input id="ds-input-default" placeholder="e.g. Regional Bank BOLI 2026" className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink placeholder:text-muted/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="ds-input-required" className="mb-1 text-xs text-muted">Client <span className="font-semibold text-danger">*</span></label>
                <input id="ds-input-required" defaultValue="Regional Bank" className="h-9 rounded-md border border-primary bg-white px-2.5 text-sm text-ink ring-2 ring-primary/20 focus:outline-none" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="ds-input-error" className="mb-1 text-xs text-muted">Due Date</label>
                <input id="ds-input-error" defaultValue="13/45/2026" aria-invalid="true" aria-describedby="ds-input-error-hint" className="h-9 rounded-md border border-danger bg-white px-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-danger/20" />
                <p id="ds-input-error-hint" className="mt-1 text-micro text-danger">Enter a valid date</p>
              </div>
              <div className="flex flex-col">
                <label htmlFor="ds-input-disabled" className="mb-1 text-xs text-muted">Case ID (disabled)</label>
                <input id="ds-input-disabled" defaultValue="CASE-00142" disabled className="h-9 cursor-not-allowed rounded-md border border-line bg-canvas px-2.5 text-sm text-muted" />
              </div>
            </div>
            <PromptBlock text={prompts.inputs} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="select">
          <Card accent="primary" title="Select" meta="Default and disabled">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="ds-select" className="mb-1 text-xs text-muted">Product</label>
                <select id="ds-select" className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>EPPVUL AVME</option>
                  <option>BOLI Gold Standard</option>
                  <option>COLI Internal MVP</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="ds-select-disabled" className="mb-1 text-xs text-muted">Region (disabled)</label>
                <select id="ds-select-disabled" disabled className="h-9 cursor-not-allowed rounded-md border border-line bg-canvas px-2.5 text-sm text-muted">
                  <option>Northeast</option>
                </select>
              </div>
            </div>
            <PromptBlock text={prompts.select} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="dropdowns-datepicker">
          <Card accent="primary" title="Dropdowns &amp; Date Picker" meta="Action menu and native date input">
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="mb-1.5 text-xs text-muted">Dropdown menu</p>
                <DropdownMenu />
              </div>
              <div className="flex flex-col">
                <label htmlFor="ds-date" className="mb-1 text-xs text-muted">Due Date</label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} />
                  <input id="ds-date" type="date" className="h-9 rounded-md border border-line bg-white py-1.5 pl-8 pr-2.5 text-sm text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
            <PromptBlock text={prompts.dropdownDatepicker} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="text-editors">
          <Card accent="primary" title="Text Editors" meta="Rich-text toolbar pattern">
            <div className="rounded-md border border-line">
              <div className="flex items-center gap-1 border-b border-line bg-canvas px-2 py-1.5">
                {[
                { Icon: BoldIcon, label: 'Bold' },
                { Icon: ItalicIcon, label: 'Italic' },
                { Icon: UnderlineIcon, label: 'Underline' },
                { Icon: ListIcon, label: 'Bulleted list' }].
                map(({ Icon, label }) =>
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  title={label}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="Add underwriting notes…"
                className="w-full resize-none rounded-b-md bg-white px-3 py-2.5 text-[13px] text-ink placeholder:text-muted focus:outline-none" />

            </div>
            <PromptBlock text={prompts.textEditor} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="progress">
          <Card accent="primary" title="Progress Indicator" meta="Linear, tone variants, and spinner">
            <div className="max-w-sm space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-micro text-muted"><span>Round completion</span><span className="tnum">72%</span></div>
                <ProgressBar value={72} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-micro text-muted"><span>Governance target</span><span className="tnum">40%</span></div>
                <ProgressBar value={40} tone="warning" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-micro text-muted"><span>Evidence checks</span><span className="tnum">100%</span></div>
                <ProgressBar value={100} tone="success" />
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <Loader2Icon className="h-4 w-4 animate-spin text-primary" strokeWidth={1.75} />
                Running pricing engine…
              </div>
            </div>
            <PromptBlock text={prompts.progress} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="tooltips">
          <Card accent="primary" title="Tooltips" meta="Hover or focus to reveal">
            <div className="flex flex-wrap gap-4 pb-6">
              <TooltipDemo label="MVP" tip="Minimum Viable Profit — governance target for this product." />
              <TooltipDemo label="M&amp;E" tip="Mortality & expense charge, in basis points." />
            </div>
            <PromptBlock text={prompts.tooltips} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="command-menus">
          <Card accent="primary" title="Command Menus" meta="Global search / quick actions overlay">
            <Button variant="secondary" onClick={() => setCommandOpen(true)} icon={<CommandIcon className="h-4 w-4" strokeWidth={1.75} />}>
              Open Command Menu
            </Button>
            <CommandMenuOverlay open={commandOpen} onClose={() => setCommandOpen(false)} />
            <PromptBlock text={prompts.commandMenu} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="filters">
          <Card accent="primary" title="Filters" meta="Pill filters, toggle, and active-filter chips">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted" strokeWidth={1.75} />
                {['All', 'Quoted', 'Approved', 'Draft'].map((s, i) =>
                <button
                  key={s}
                  type="button"
                  aria-pressed={i === 1}
                  className={`h-7 rounded-full border px-3 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  i === 1 ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink hover:bg-canvas'}`
                  }>

                    {s}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFilterMine((v) => !v)}
                  aria-pressed={filterMine}
                  className={`h-7 rounded-md border px-3 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  filterMine ? 'border-primary bg-primary-tint text-primary' : 'border-line bg-white text-ink hover:bg-canvas'}`
                  }>

                  Mine
                </button>
              </div>
              {activeFilters.length > 0 &&
              <div className="flex flex-wrap items-center gap-2">
                  <span className="text-micro text-muted">Active:</span>
                  {activeFilters.map((f) =>
                <Tag key={f} onRemove={() => setActiveFilters((prev) => prev.filter((x) => x !== f))}>{f}</Tag>
                )}
                  <button type="button" onClick={() => setActiveFilters([])} className="text-micro font-medium text-primary hover:underline">Clear all</button>
                </div>
              }
            </div>
            <PromptBlock text={prompts.filters} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="file-upload">
          <Card accent="primary" title="File Upload" meta="Dropzone, browse button, and file row">
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-8 text-center">
                <UploadIcon className="h-6 w-6 text-muted" strokeWidth={1.75} aria-hidden="true" />
                <p className="text-[13px] text-ink">Drag &amp; drop a census file here, or</p>
                <Button variant="outline" size="sm">Browse files</Button>
                <p className="text-micro text-muted">CSV, TSV, XLSX · up to 5MB</p>
              </div>
              <div className="flex items-center justify-between rounded-md border border-line px-3.5 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileIcon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                  <span className="truncate text-[13px] text-ink">NYL_Census_Q2_2024.xlsx</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="w-16"><ProgressBar value={100} tone="success" /></span>
                  <CheckIcon className="h-4 w-4 text-success" strokeWidth={2} />
                </div>
              </div>
            </div>
            <PromptBlock text={prompts.fileUpload} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="empty-state">
          <Card accent="primary" title="Empty State" meta="No data vs. no results">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <EmptyState icon={InboxIcon} title="No quotes yet" description="Create your first quote to see it appear here." action={<Button variant="primary" size="sm">New Quote</Button>} />
              <EmptyState icon={SearchIcon} title="No results found" description="Try adjusting your filters or search terms." />
            </div>
            <PromptBlock text={prompts.emptyState} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="modals">
          <Card accent="primary" title="Modals" meta="Default, confirmation, and destructive states">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setModalKind('default')}>Open Default</Button>
              <Button variant="primary" onClick={() => setModalKind('confirm')}>Open Confirmation</Button>
              <Button variant="danger" onClick={() => setModalKind('danger')}>Open Destructive</Button>
            </div>
            <ModalOverlay kind={modalKind} onClose={() => setModalKind(null)} />
            <PromptBlock text={prompts.modals} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="table-pagination">
          <Card accent="primary" title="Table &amp; Pagination" meta="Row hover, status badges, page controls">
            <TablePaginationDemo />
            <PromptBlock text={prompts.tablePagination} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="treeview">
          <Card accent="primary" title="Treeview" meta="Expandable hierarchy with selection">
            <div role="tree" aria-label="Products" className="max-w-sm">
              {treeData.map((node) =>
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                expanded={expanded}
                onToggle={toggleExpand}
                selected={selectedNode}
                onSelect={setSelectedNode} />

              )}
            </div>
            <PromptBlock text={prompts.treeview} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="cards">
          <Card accent="primary" title="Cards" meta="Rounded 10px · 1px line border · soft shadow · optional 2px top accent">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card title="No accent">
                <p className="text-[13px] text-muted">Default card style</p>
              </Card>
              <Card accent="primary" title="Primary accent">
                <p className="text-[13px] text-muted">Blue top border</p>
              </Card>
              <Card accent="warning" title="Warning accent">
                <p className="text-[13px] text-muted">Amber top border</p>
              </Card>
              <Card accent="danger" title="Danger accent">
                <p className="text-[13px] text-muted">Red top border</p>
              </Card>
            </div>
            <PromptBlock text={prompts.cards} />
          </Card>
        </SectionAnchor>

        <SectionAnchor id="layout">
          <Card accent="primary" title="Layout" meta="Page background vs. surface">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-canvas p-5">
                <p className="text-[13px] font-medium text-ink">Canvas — #F1F3F5</p>
                <p className="mt-1 text-micro text-muted">Main page background</p>
              </div>
              <div className="rounded-card border border-line bg-white p-5 shadow-card">
                <p className="text-[13px] font-medium text-ink">Card surface — white</p>
                <p className="mt-1 text-micro text-muted">shadow-card · rounded-card (10px) · border-line</p>
              </div>
            </div>
            <PromptBlock text={prompts.layout} />
          </Card>
        </SectionAnchor>
      </div>
    </div>);

}
