// Minimal line icons in the same visual style already used across the
// project (stroke="currentColor", 2px stroke, rounded caps).

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

export function IconHelp(props) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2-2.4 3.4" />
      <path d="M12 17.5h.01" />
    </>,
    props
  );
}

export function IconChevronDown(props) {
  return base(<path d="M6 9l6 6 6-6" />, props);
}

export function IconChevronRight(props) {
  return base(<path d="M9 6l6 6-6 6" />, props);
}

export function IconFolder(props) {
  return base(
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    props
  );
}

export function IconMessageSquare(props) {
  return base(
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />,
    props
  );
}

export function IconBook(props) {
  return base(
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </>,
    props
  );
}

export function IconLandmark(props) {
  return base(
    <>
      <path d="M4 21h16" />
      <path d="M6 21V9l6-5 6 5v12" />
      <path d="M10 21v-6h4v6" />
      <path d="M9 9h.01M12 9h.01M15 9h.01" />
    </>,
    props
  );
}

export function IconShield(props) {
  return base(
    <>
      <path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6l7-3Z" />
      <path d="M12 8v5M12 16h.01" />
    </>,
    props
  );
}

export function IconPlay(props) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 9l4.5 3-4.5 3V9Z" />
    </>,
    props
  );
}

export function IconSearch(props) {
  return base(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>,
    props
  );
}

export function IconArrowRight(props) {
  return base(<path d="M5 12h14M13 6l6 6-6 6" />, props);
}

export function IconCheckCircle(props) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5.5" />
    </>,
    props
  );
}

export function IconUpload(props) {
  return base(
    <>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>,
    props
  );
}

export function IconX(props) {
  return base(<path d="M6 6l12 12M18 6L6 18" />, props);
}

export function IconAlertCircle(props) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>,
    props
  );
}