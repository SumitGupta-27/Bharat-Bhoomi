// Central data source for the About mega-menu and the /about/:slug pages.
// Each top-level section is either:
//  - type "cards": shows a set of sub-cards on hover, each with its own page
//  - type "simple": shows a short preview + a single CTA to its own page

export const ABOUT_SECTIONS = [
  {
    slug: "who-we-are",
    label: "Who We Are",
    type: "cards",
    summary:
      "Our vision, mission and the commitments we make to every citizen who relies on Bharat Bhoomi.",
    cards: [
      {
        slug: "vision",
        title: "Vision",
        subtitle: "Where we're headed",
        description:
          "A future where every citizen can access accurate, verified land records from anywhere, without friction or uncertainty.",
      },
      {
        slug: "mission",
        title: "Mission",
        subtitle: "How we get there",
        description:
          "To unify land record systems across states and departments into one transparent, real-time and secure platform.",
      },
      {
        slug: "citizen-charter",
        title: "Citizen Charter",
        subtitle: "Our commitment to you",
        description:
          "Our published standards of service — response times, accuracy commitments and how to hold us accountable.",
      },
    ],
  },
  {
    slug: "people",
    label: "People at Bharat Bhoomi",
    type: "cards",
    summary:
      "The departments, officers and past leadership who help run the platform.",
    cards: [
      {
        slug: "departments",
        title: "Departments",
        subtitle: "Connected government departments",
        description:
          "Revenue, Registration & Stamps, Survey & Settlement, Panchayati Raj, Urban Local Bodies and Forest departments currently connected to Bharat Bhoomi.",
      },
      {
        slug: "officers",
        title: "Officers",
        subtitle: "Nodal officers and administrators",
        description:
          "The nodal officers and administrators responsible for data accuracy and grievance resolution across states.",
      },
      {
        slug: "past-composition",
        title: "Past Composition",
        subtitle: "Previous leadership of Bharat Bhoomi",
        description:
          "A record of the committees and leadership that have overseen Bharat Bhoomi since its inception.",
      },
    ],
  },
  {
    slug: "offices",
    label: "Our Offices",
    type: "simple",
    summary:
      "Find Bharat Bhoomi's headquarters and state / district-level office locations.",
    description:
      "Bharat Bhoomi operates through a central office and coordinating offices in every state, working directly with district-level Revenue and Registration departments.",
    ctaLabel: "View Our Offices",
  },
  {
    slug: "careers",
    label: "Careers",
    type: "simple",
    summary: "Explore open roles and opportunities with Bharat Bhoomi.",
    description:
      "We're building the team behind India's unified land records platform — from GIS engineers to policy analysts. Open positions are listed on this page as they become available.",
    ctaLabel: "Explore Careers",
  },
  {
    slug: "transparency",
    label: "Transparency & Accountability",
    type: "simple",
    summary:
      "Our approach to open governance, public accountability and data transparency.",
    description:
      "Bharat Bhoomi publishes its data-verification standards, audit processes and grievance-resolution timelines so departments and citizens can hold the platform accountable.",
    ctaLabel: "Learn More",
  },
  {
    slug: "circulars",
    label: "Circulars, Notifications and Official Memorandums",
    type: "simple",
    summary:
      "Official circulars, notifications and memorandums issued for the platform.",
    description:
      "This section will list official circulars, notifications and memorandums issued by the departments connected to Bharat Bhoomi, as they are published.",
    ctaLabel: "View All Documents",
  },
];

/**
 * Looks up a section OR a card by slug, for the /about/:slug route.
 * Returns null if nothing matches.
 */
export function findAboutEntry(slug) {
  for (const section of ABOUT_SECTIONS) {
    if (section.slug === slug) {
      return { ...section, isSection: true };
    }
    if (section.cards) {
      const card = section.cards.find((item) => item.slug === slug);
      if (card) {
        return {
          ...card,
          isSection: false,
          parentLabel: section.label,
          parentSlug: section.slug,
          siblings: section.cards.filter((item) => item.slug !== slug),
        };
      }
    }
  }
  return null;
}