import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

export const navigation = {
  categories: [
    {
      id: 'products',
      name: 'Products',
      sections: [
        {
          id: 'features',
          name: 'Features',
          items: [
            { name: 'Automation',description:'Automate your workflows and save time', href: '/Automation' },
            { name: 'Integrations', href: '/integrations' },
            { name: 'Apps', href: '/apps' },
          ],
        },
        {
          id: 'integrations',
          name: 'Integrations', 
          items: [
            { name: 'Popular Apps', href: '/popular-apps' },
            { name: 'New Integrations', href: '/new-integrations' },
            { name: 'App Directory', href: '/app-directory' },
          ],
        },
        {
          id: 'apps',
          name: 'Apps',
          items: [
            { name: 'Featured Apps', href: '/featured-apps' },
            { name: 'App Categories', href: '/app-categories' },
            { name: 'Build an App', href: '/build' },
          ],
        },
      ],
    },
    {
      id: 'solutions',
      name: 'Solutions',
      sections: [
        {
          id: 'by-team',
          name: 'By Team',
          items: [
            { name: 'Marketing', href: '/solutions/marketing' },
            { name: 'Sales', href: '/solutions/sales' },
            { name: 'Finance', href: '/solutions/finance' },
            { name: 'HR', href: '/solutions/hr' },
            { name: 'IT', href: '/solutions/it' },
            { name: 'Operations', href: '/solutions/operations' },
          ],
        },
      ],
    },
    {
      id: 'resources',
      name: 'Resources',
      sections: [
        {
          id: 'learn',
          name: 'Learn',
          items: [
            { name: 'Blog', href: '/blog' },
            { name: 'Help Center', href: '/help' },
            { name: 'Community', href: '/community' },
            { name: 'Webinars', href: '/webinars' },
            { name: 'Experts', href: '/experts' },
          ],
        },
      ],
    },
    {
      id: 'partners',
      name: 'Partners',
      sections: [
        {
          id: 'partner-programs',
          name: 'Partner Programs',
          items: [
            { name: 'Become a Partner', href: '/partners' },
            { name: 'Find a Partner', href: '/find-partner' },
            { name: 'Partner Portal', href: '/partner-portal' },
          ],
        },
      ],
    },
  ]
}

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];



export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Drag-and-Drop Interface",
    description:
      "Easily design and arrange your VR environments with a user-friendly drag-and-drop interface.",
  },
  {
    icon: <Fingerprint />,
    text: "Multi-Platform Compatibility",
    description:
      "Build VR applications that run seamlessly across multiple platforms, including mobile, desktop, and VR headsets.",
  },
  {
    icon: <ShieldHalf />,
    text: "Built-in Templates",
    description:
      "Jumpstart your VR projects with a variety of built-in templates for different types of applications and environments.",
  },
  {
    icon: <BatteryCharging />,
    text: "Real-Time Preview",
    description:
      "Preview your VR application in real-time as you make changes, allowing for quick iterations and adjustments.",
  },
  {
    icon: <PlugZap />,
    text: "Collaboration Tools",
    description:
      "Work together with your team in real-time on VR projects, enabling seamless collaboration and idea sharing.",
  },
  {
    icon: <GlobeLock />,
    text: "Analytics Dashboard",
    description:
      "Gain valuable insights into user interactions and behavior within your VR applications with an integrated analytics dashboard.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "₹0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "₹999",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "₹2999",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const TopSearches = [
{ href: "#", text: "Slack integrations" },
{ href: "#", text: "Salesforce integrations" },
{ href: "#", text: "HubSpot CRM integrations" },
{ href: "#", text: "PayPal integrations" },
{ href: "#", text: "Asana integrations" },
{ href: "#", text: "Show more" }
];

export const PopularApps = [
  { href: "#", text: "Dropbox" },
  { href: "#", text: "Google Sheets" },
  { href: "#", text: "DocuSign" },
  { href: "#", text: "WordPress" },
  { href: "#", text: "Office 365" },
  { href: "#", text: "Show more" },
];

export const ExplorePlatform = [
  { href: "#", text: "Pricing" },
  { href: "#", text: "Lifetime Deal" },
  { href: "#", text: "How it works" },
  { href: "#", text: "Ai Copilot" },
  { href: "#", text: "Advertising and Marketing" },
  { href: "#", text: "Development Tools" },
  { href: "#", text: "Apps & Integrations" },

  { href: "#", text: "Videos" },

];
export const Company = [
  { href: "/privacy-policy", text: "Privacy Policy" },
  { href: "/terms-of-service", text: "Terms of Service" },
  
  { href: "/manage-cookie-preferences", text: "Manage Cookie Preferences" },
];