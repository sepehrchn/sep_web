#!/usr/bin/env node
// Safe local test for chatbot placeholder + redaction logic.
// This script DOES NOT call OpenAI and NEVER reads your API key.

const SYSTEM_PROMPT = `You are the intake assistant for Sepehr, a senior software engineer and web developer based in Yerevan, Armenia. You pre-qualify project inquiries on his behalf.`;

function redactPII(text) {
  if (!text) return text;
  text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]");
  text = text.replace(/\+?\d[\d\-\s()]{6,}\d/g, "[REDACTED_PHONE]");
  text = text.replace(/\b\d{12,19}\b/g, "[REDACTED_NUMBER]");
  return text;
}

function placeholderReply(sanitizedMessages) {
  const userMsgs = sanitizedMessages.filter((m) => m.role === 'user');
  const stepIndex = userMsgs.length;
  let replyText = '';
  if (stepIndex === 1) {
    replyText = 'That sounds interesting. Is this a brand new greenfield project, or are we adding to/overhauling an existing system?';
  } else if (stepIndex === 2) {
    replyText = 'Understood. What is your target timeline for starting and launching this project?';
  } else if (stepIndex === 3) {
    replyText = 'Got it. What is your estimated budget range for this work? The typical options are: Under $8K, $8K–$20K, $20K–$50K, or Over $50K.';
  } else if (stepIndex === 4) {
    replyText = 'Perfect. Could you also share your name and company name if you have one?';
  } else {
    const name = (userMsgs.map((m) => (m.content.match(/\b(?:my name is|i am|i'm)\s+([A-Z][a-z]+)/i)) || [])[0] || ['there'])[1] || 'there';
    replyText = `Thanks ${name}! I've noted down all the details of your request. Based on what you've shared, this sounds like a great fit for my services. Please use the contact form below to submit your inquiry, and I'll follow up within 24 hours.`;
  }
  return replyText;
}

function simulateStream(text) {
  const words = text.split(' ');
  let out = '';
  for (let i = 0; i < words.length; i++) {
    out += words[i] + (i === words.length - 1 ? '' : ' ');
  }
  return out;
}

function runScenario(name, messages) {
  console.log(`\n=== Scenario: ${name} ===`);
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      console.log('Response: 400 Bad Request - Invalid payload: messages array is required.');
      return;
    }

    const sliced = messages.slice(-20);
    const sanitized = [{ role: 'system', content: SYSTEM_PROMPT }];
    for (const msg of sliced) {
      if (msg.role !== 'user' && msg.role !== 'assistant') continue;
      if (msg.role === 'user' && String(msg.content).length > 500) {
        console.log('Response: 400 Bad Request - Message exceeds character limit of 500.');
        return;
      }
      const content = msg.role === 'user' ? redactPII(String(msg.content)) : String(msg.content);
      sanitized.push({ role: msg.role, content });
    }

    const reply = placeholderReply(sanitized);
    const streamed = simulateStream(reply);
    console.log('Streamed Response:');
    console.log(streamed);
  } catch (err) {
    console.error('Test error:', err);
  }
}

// Test scenarios
const scenarios = [
  [
    'General greeting',
    [{ role: 'user', content: 'Hi there' }],
  ],
  [
    'Website inquiry',
    [{ role: 'user', content: "I need a new website for my agency, about 2 months timeline, budget $20k" }],
  ],
  [
    'AI project inquiry',
    [{ role: 'user', content: 'We want to add an AI chatbot to our docs to automate support. Is that possible?' }],
  ],
  [
    'Pricing question',
    [{ role: 'user', content: 'How much do you charge for a full redesign? We have $30,000 budget.' }],
  ],
  [
    'Service question',
    [{ role: 'user', content: "Do you do integrations with Zapier or Make?" }],
  ],
  [
    'Long conversation',
    [
      { role: 'user', content: 'We have an old monolith and need a new frontend.' },
      { role: 'user', content: 'Timeline is around 8 weeks.' },
      { role: 'user', content: 'Budget around $35k' },
      { role: 'user', content: "My name is Alex and company is BrightApps" },
    ],
  ],
  [
    'Invalid request',
    [],
  ],
];

for (const s of scenarios) runScenario(s[0], s[1]);

// End
process.exit(0);
