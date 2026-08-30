// Central data source for the Features navbar dropdown and the
// dedicated /features page. Edit this array to add, remove, or
// reorder features — both the dropdown and the page read from it.

export const FEATURES = [
  {
    slug: "unified-land-records",
    title: "Unified Land Records",
    shortDesc: "One national database for every state",
    description:
      "Land records from every connected state and district are brought into a single, consistent database — no more chasing separate portals for separate states.",
    icon: "records",
    color: "blue",
  },
  {
    slug: "department-integration",
    title: "Department Integration",
    shortDesc: "Revenue, Registration, Survey & more, connected",
    description:
      "Revenue, Registration & Stamps, Survey & Settlement, Panchayati Raj, Urban Local Bodies and Forest departments all read and write to the same verified source.",
    icon: "integration",
    color: "indigo",
  },
  {
    slug: "conflict-detection",
    title: "Conflict Detection",
    shortDesc: "Catch overlapping claims and disputes early",
    description:
      "Automated checks flag overlapping ownership claims, boundary mismatches and pending litigation before they escalate into disputes.",
    icon: "conflict",
    color: "amber",
  },
  {
    slug: "interactive-land-map",
    title: "Interactive Land Map",
    shortDesc: "GIS-backed map of every state and district",
    description:
      "A GIS-integrated map lets citizens and officers browse land parcels visually, down to district and survey-number level, instead of searching blind.",
    icon: "map",
    color: "teal",
  },
  {
    slug: "land-information-dashboard",
    title: "Land Information Dashboard",
    shortDesc: "Ownership, area and status at a glance",
    description:
      "A single dashboard view of ownership history, land area, classification and current status for any record — built for both citizens and officers.",
    icon: "dashboard",
    color: "green",
  },
  {
    slug: "document-verification",
    title: "Document Verification",
    shortDesc: "Cross-checked against source department data",
    description:
      "Uploaded and requested documents are cross-verified against the issuing department's own records, reducing forged or outdated paperwork.",
    icon: "document",
    color: "blue",
  },
  {
    slug: "real-time-status-tracking",
    title: "Real-Time Status Tracking",
    shortDesc: "Live updates on mutations and applications",
    description:
      "Track mutation requests, applications and grievances in real time, with status updates pushed directly from the department handling them.",
    icon: "tracking",
    color: "indigo",
  },
  {
    slug: "secure-data-management",
    title: "Secure Data Management",
    shortDesc: "Role-based access and full audit trails",
    description:
      "Role-based access control, encrypted storage and full audit logs keep sensitive land data secure while remaining transparent to authorized users.",
    icon: "security",
    color: "green",
  },
];