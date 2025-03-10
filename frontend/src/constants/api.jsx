import { RiWhatsappFill } from "react-icons/ri";


export const apps = [
  { id: 1, name: 'WhatsApp Cloud API', icon: <RiWhatsappFill className='text-green-400' /> },
  { id: 2, name: 'Router (Pabbly)', icon: '📍' },
  { id: 3, name: 'Iterator (Pabbly)', icon: '🔄' },
  { id: 4, name: 'Delay (Pabbly)', icon: '⌛' },
  { id: 5, name: 'API (Pabbly)', icon: '🔌' },
  { id: 6, name: 'Pabbly Email Marketing', icon: '📧' },
  { id: 7, name: 'Mailchimp', icon: '🐵' },
  { id: 8, name: 'Trello', icon: '📋' },
  { id: 9, name: 'SendFox', icon: '🦊' },
  { id: 10, name: 'MailerLite Classic', icon: '✉️' },
  { id: 11, name: 'Moosend', icon: '📬' },
  { id: 12, name: 'Twilio', icon: '📱' },
  { id: 13, name: 'Vonage', icon: '📞' },
  { id: 14, name: 'Kit', icon: '🛠️' },
];

export const defaultActions = {
  'WhatsApp Cloud API': [
    { name: 'Send Template Message', description: 'Send a pre-approved message template' },
    { name: 'Send Text Message', description: 'Send a simple text message' },
    { name: 'Send Media Message', description: 'Send images, videos, or documents' },
    { name: 'Send Location', description: 'Share a location' },
    { name: 'Send Contact', description: 'Share a contact card' }
  ],
  'Router (Pabbly)': [
    { name: 'Route A', description: 'First routing path' },
    { name: 'Route B', description: 'Second routing path' },
    { name: 'Custom Route', description: 'Define custom routing logic' }
  ],
  'Iterator (Pabbly)': [
    { name: 'Loop Items', description: 'Iterate through a list of items' },
    { name: 'Map Data', description: 'Transform data while iterating' },
    { name: 'Filter Items', description: 'Filter items based on conditions' }
  ],
};

