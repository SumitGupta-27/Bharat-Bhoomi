// Minimal line icons in the same visual style used across the project
// (stroke="currentColor", 2px stroke, rounded caps). Kept separate from
// HelpMenu/icons.jsx so the About feature stays self-contained.

function base(children, props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconChevronDown(props) {
  return base(<path d="M6 9l6 6 6-6" />, props);
}

export function IconChevronRight(props) {
  return base(<path d="M9 6l6 6-6 6" />, props);
}

export function IconArrowRight(props) {
  return base(<path d="M5 12h14M13 6l6 6-6 6" />, props);
}

export function IconInfo(props) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.5h.01" />
    </>,
    props
  );
}

export function IconUsers(props) {
  return base(
    <>
      <path d="M17 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 5 18.5V20" />
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.36" />
      <path d="M14.5 4.6a3.5 3.5 0 0 1 0 6.8" />
    </>,
    props
  );
}

export function IconBuilding(props) {
  return base(
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
    </>,
    props
  );
}

export function IconBriefcase(props) {
  return base(
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </>,
    props
  );
}

export function IconShieldCheck(props) {
  return base(
    <>
      <path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4.5" />
    </>,
    props
  );
}

export function IconFileText(props) {
  return base(
    <>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9 12h6M9 15.5h6M9 8.5h2" />
    </>,
    props
  );
}

export function IconEye(props) {
  return base(
    <>
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    props
  );
}

export function IconTarget(props) {
  return base(
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" />
    </>,
    props
  );
}

export function IconScroll(props) {
  return base(
    <>
      <path d="M6 4h10a2 2 0 0 1 2 2v12" />
      <path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12" />
      <path d="M9 9h6M9 13h4" />
    </>,
    props
  );
}