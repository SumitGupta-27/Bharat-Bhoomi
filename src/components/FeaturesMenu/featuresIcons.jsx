// Minimal line icons matching the style already used in Features.jsx
// (stroke="currentColor", ~1.8px stroke, rounded caps). Kept separate so
// the Features dropdown/page stays self-contained.

function base(children, props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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

export function IconRecords(props) {
  return base(
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </>,
    props
  );
}

export function IconIntegration(props) {
  return base(
    <>
      <rect x="3" y="4" width="7" height="7" rx="1" />
      <rect x="14" y="4" width="7" height="7" rx="1" />
      <rect x="3" y="15" width="7" height="7" rx="1" />
      <rect x="14" y="15" width="7" height="7" rx="1" />
      <path d="M10 7.5h4M10 18.5h4M7.5 11v4M17.5 11v4" />
    </>,
    props
  );
}

export function IconConflict(props) {
  return base(
    <>
      <path d="M12 3l9 16H3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </>,
    props
  );
}

export function IconMap(props) {
  return base(
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="17" r="2" />
      <circle cx="19" cy="17" r="2" />
      <path d="M12 7v4M12 11L6.5 15.3M12 11l5.5 4.3" />
    </>,
    props
  );
}

export function IconDashboard(props) {
  return base(
    <>
      <rect x="3" y="3" width="8" height="10" rx="1.5" />
      <rect x="13" y="3" width="8" height="6" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="15" width="8" height="6" rx="1.5" />
    </>,
    props
  );
}

export function IconDocument(props) {
  return base(
    <>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 13.5l1.8 1.8L15 11.5" />
    </>,
    props
  );
}

export function IconTracking(props) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 1.9" />
    </>,
    props
  );
}

export function IconSecurity(props) {
  return base(
    <>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="M9.5 12l1.8 1.8L14.5 10" />
    </>,
    props
  );
}

export const FEATURE_ICONS = {
  records: IconRecords,
  integration: IconIntegration,
  conflict: IconConflict,
  map: IconMap,
  dashboard: IconDashboard,
  document: IconDocument,
  tracking: IconTracking,
  security: IconSecurity,
};