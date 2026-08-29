// Central data source for the Help system.
// Shared by the navbar mega-menu, the Help Center page, the Resource
// pages and the FAQ page so content only needs to be edited in one place.

export const RESOURCES = [
  {
    slug: "handbooks",
    icon: "book",
    title: "Handbooks",
    subtitle: "Official Land Records Manuals",
    description:
      "Download official manuals covering land record procedures, terminology, mutation workflows and department-wise processes.",
  },
  {
    slug: "bharat-bhoomi",
    icon: "landmark",
    title: "Bharat Bhoomi",
    subtitle: "Verified Land Information and Resources",
    description:
      "Learn how the Bharat Bhoomi platform works, what data it covers, and how records are verified across departments.",
  },
  {
    slug: "mythbusters",
    icon: "shield",
    title: "Land Mythbusters",
    subtitle: "Facts and Myths About Land Records",
    description:
      "Common misconceptions about land ownership, mutation and registration — clarified with facts and official references.",
  },
  {
    slug: "videos",
    icon: "play",
    title: "How-to Videos",
    subtitle: "Step-by-Step Land and Property Guides",
    description:
      "Short video walkthroughs for common tasks such as checking land records, filing a mutation, or submitting a grievance.",
  },
];

export const FAQS = [
  {
    id: "faq-1",
    question: "What is Bharat Bhoomi?",
    answer:
      "Bharat Bhoomi is a unified national platform that brings together land records from multiple state and district departments into a single, verified, searchable system.",
  },
  {
    id: "faq-2",
    question: "How can I check land information?",
    answer:
      "Use the interactive map on the homepage to select a state or district, then search by survey number, owner name, or property ID to view verified land records.",
  },
  {
    id: "faq-3",
    question: "How are land records verified?",
    answer:
      "Records are cross-checked against source data submitted directly by Revenue, Registration and Survey departments, and are periodically re-verified during official updates.",
  },
  {
    id: "faq-4",
    question: "What departments are connected to the platform?",
    answer:
      "Revenue, Registration & Stamps, Survey & Settlement, Panchayati Raj, Urban Local Bodies, and Forest departments are currently connected, with more being onboarded.",
  },
  {
    id: "faq-5",
    question: "How can I report incorrect land information?",
    answer:
      "Open Help → Grievance & Feedback, choose \"Report Incorrect Information\" as the request type, and describe the discrepancy. Our team routes it to the concerned department.",
  },
  {
    id: "faq-6",
    question: "How can I submit a grievance?",
    answer:
      "Go to Help → Grievance & Feedback, select \"Grievance\" as the request type, fill in the details and submit. You'll receive a reference ID for tracking.",
  },
  {
    id: "faq-7",
    question: "How can I track my feedback?",
    answer:
      "Once submitted, every feedback or grievance receives a reference ID. Tracking by reference ID will be available soon on the Help Center page.",
  },
];

// Options used by the Grievance & Feedback form.
export const FEEDBACK_CATEGORIES = [
  "Revenue Department",
  "Registration & Stamps Department",
  "Survey & Settlement Department",
  "Panchayati Raj Department",
  "Urban Local Bodies",
  "Forest Department",
  "General / Other",
];

export const FEEDBACK_TYPES = [
  "Feedback",
  "Grievance",
  "Report Incorrect Information",
  "Technical Issue",
];