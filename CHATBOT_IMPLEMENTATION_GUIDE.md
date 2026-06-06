# CHATBOT IMPLEMENTATION GUIDE
**Quick Start: Get Your Chatbot Working in 5 Minutes**

---

## IMMEDIATE FIX (Required)

### Step 1: Get OpenAI API Key (2 minutes)

1. Go to https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)

### Step 2: Add Key to Local Environment (1 minute)

```bash
# Create .dev.vars file in project root
cat > .dev.vars << 'EOF'
OPENAI_API_KEY=sk-proj-your-actual-key-here
EOF
```

Replace `sk-proj-your-actual-key-here` with your real key.

### Step 3: Test Locally (2 minutes)

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Click "Let's talk" button in bottom right
# Type: "I need a website for my business"
# You should see AI response (not placeholder)
```

✅ **If chatbot responds naturally → SUCCESS!**  
❌ **If you see placeholder responses → check .dev.vars file**

---

## DEPLOY TO PRODUCTION

### Option A: Via Cloudflare Dashboard (Recommended)

1. Go to https://dash.cloudflare.com
2. Navigate to: Workers & Pages → sep-web → Settings → Variables
3. Add environment variable:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-your-actual-key`
   - Environment: Production
4. Click "Save"
5. Redeploy:
   ```bash
   npm run build
   wrangler deploy
   ```

### Option B: Via Wrangler CLI

```bash
# Set secret (more secure)
wrangler secret put OPENAI_API_KEY
# Paste your key when prompted

# Deploy
wrangler deploy
```

---

## VERIFY DEPLOYMENT

```bash
# Visit your production site
open https://your-domain.com

# Test chatbot:
1. Click "Let's talk"
2. Send message: "I need a website"
3. Verify AI response (not placeholder)
4. Complete conversation
5. Verify form pre-fill works
```

---

## OPTIONAL ENHANCEMENTS

### Enhancement 1: Upgrade System Prompt (10 minutes)

Current prompt is good, but the enhanced version has better qualification logic.

**File to edit:** `src/routes/api/chat.ts`

**Replace this:**
```typescript
const SYSTEM_PROMPT = `You are the intake assistant for Sepehr...`;
```

**With the content from:** `chatbot-system-prompt-enhanced.txt`

**Test:**
1. Restart dev server
2. Try different conversation scenarios:
   - Say "I'm an agency looking for a developer"
   - Say "My budget is $15K"
   - Say "I need a simple $2K site"
3. Verify bot qualifies/disqualifies correctly

---

### Enhancement 2: Add Conversation Analytics (30 minutes)

Track chatbot performance in D1 database.

**Step 1: Create Migration**

```bash
# Create new migration file
cat > migrations/0006_create_chat_analytics.sql << 'EOF'
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  message_count INTEGER DEFAULT 0,
  qualified BOOLEAN DEFAULT NULL,
  converted BOOLEAN DEFAULT FALSE,
  budget_range TEXT,
  project_type TEXT,
  visitor_ip TEXT,
  user_agent TEXT,
  ended_at DATETIME
);

CREATE INDEX idx_session_id ON chat_sessions(session_id);
CREATE INDEX idx_started_at ON chat_sessions(started_at);
EOF
```

**Step 2: Run Migration**

```bash
# Local
npx wrangler d1 execute sep-web-db --local --file=migrations/0006_create_chat_analytics.sql

# Production
npx wrangler d1 execute sep-web-db --remote --file=migrations/0006_create_chat_analytics.sql
```

**Step 3: Add Tracking to useChatbot.ts**

```typescript
// Add this function to useChatbot.ts
const trackSession = useCallback(async (action: 'start' | 'message' | 'qualify' | 'convert', data?: any) => {
  const sessionId = sessionStorage.getItem('chatSessionId') || Math.random().toString(36);
  if (action === 'start') {
    sessionStorage.setItem('chatSessionId', sessionId);
  }
  
  try {
    await fetch('/api/chat/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action, data }),
    });
  } catch (err) {
    console.error('Analytics tracking failed:', err);
  }
}, []);

// Call trackSession in appropriate places:
// - On openChat: trackSession('start')
// - On sendMessage: trackSession('message')
// - When form CTA shows: trackSession('qualify', { collectedData })
// - When prefillContactForm called: trackSession('convert')
```

**Step 4: Create Analytics API Endpoint**

```typescript
// src/routes/api/chat/analytics.ts
import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "@/lib/db/client";

export const Route = createFileRoute("/api/chat/analytics")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { sessionId, action, data } = await request.json();
          const db = await getDb();
          
          if (action === 'start') {
            await db.run(
              `INSERT INTO chat_sessions (session_id, visitor_ip, user_agent)
               VALUES (?, ?, ?)
               ON CONFLICT(session_id) DO NOTHING`,
              [sessionId, request.headers.get('cf-connecting-ip'), request.headers.get('user-agent')]
            );
          } else if (action === 'message') {
            await db.run(
              `UPDATE chat_sessions SET message_count = message_count + 1 WHERE session_id = ?`,
              [sessionId]
            );
          } else if (action === 'qualify') {
            await db.run(
              `UPDATE chat_sessions 
               SET qualified = TRUE, budget_range = ?, project_type = ?
               WHERE session_id = ?`,
              [data?.collectedData?.budget, data?.collectedData?.project, sessionId]
            );
          } else if (action === 'convert') {
            await db.run(
              `UPDATE chat_sessions SET converted = TRUE, ended_at = CURRENT_TIMESTAMP WHERE session_id = ?`,
              [sessionId]
            );
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error('Analytics error:', err);
          return new Response(JSON.stringify({ error: 'Analytics failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
  },
});
```

**Step 5: View Analytics**

```bash
# Query analytics
npx wrangler d1 execute sep-web-db --command "
SELECT 
  DATE(started_at) as date,
  COUNT(*) as total_sessions,
  SUM(CASE WHEN qualified = 1 THEN 1 ELSE 0 END) as qualified,
  SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as converted,
  AVG(message_count) as avg_messages
FROM chat_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC
LIMIT 30;
"
```

---

### Enhancement 3: Improve Mobile Experience (20 minutes)

Current chatbot is responsive, but these tweaks improve mobile UX:

**File:** `src/components/site/Chatbot.tsx`

**Changes:**

1. **Fix iOS keyboard issue:**
```typescript
// Add this useEffect
useEffect(() => {
  if (isOpen && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Prevent iOS keyboard from shrinking viewport
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.position = '';
    document.body.style.width = '';
  }
}, [isOpen]);
```

2. **Better mobile sizing:**
```typescript
// Update the motion.div className
className="fixed bottom-20 right-4 z-50 flex h-[520px] max-h-[80vh] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-bg shadow-2xl md:right-6 md:w-[360px] md:max-h-[70vh]"
```

3. **Auto-focus input on mobile:**
```typescript
const handleOpen = useCallback(() => {
  openChat();
  // Delay focus to prevent iOS keyboard jump
  setTimeout(() => {
    if (textareaRef.current && !/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      textareaRef.current.focus();
    }
  }, 300);
}, [openChat]);
```

---

## MONITORING & OPTIMIZATION

### Week 1: Monitor Conversations

```bash
# Check API usage (OpenAI)
# Go to: https://platform.openai.com/usage

# Expected costs:
# - 100 conversations/month ≈ $10-15
# - 500 conversations/month ≈ $50-75
# - 1000 conversations/month ≈ $100-150

# If costs are too high, adjust:
max_tokens: 300 → 200  # Shorter responses
temperature: 0.4 → 0.3  # More predictable
```

### Week 2: Analyze Qualification Rate

```bash
# If using analytics table:
npx wrangler d1 execute sep-web-db --command "
SELECT 
  ROUND(AVG(qualified) * 100, 1) as qualification_rate,
  ROUND(AVG(converted) * 100, 1) as conversion_rate,
  ROUND(AVG(message_count), 1) as avg_messages
FROM chat_sessions
WHERE started_at > datetime('now', '-7 days');
"

# Good targets:
# - Qualification rate: 30-50%
# - Conversion rate: 60-80% of qualified
# - Avg messages: 5-8 (not too long, not too short)
```

### Week 3: Refine System Prompt

Based on real conversations, adjust:

**If qualification rate too low (<20%):**
- Make qualification criteria more lenient
- Add more "maybe" responses
- Ask budget later in conversation

**If qualification rate too high (>70%):**
- Tighten qualification criteria
- Disqualify low budgets earlier
- Be more direct about minimum requirements

**If avg messages too high (>10):**
- Shorten responses
- Ask combined questions ("What + when")
- Trigger form CTA earlier

**If avg messages too low (<4):**
- Visitors dropping off early
- Opening message may be too aggressive
- Try softer opener

---

## COMMON ISSUES & FIXES

### Issue 1: Chatbot Not Responding

**Symptom:** Click "Send", nothing happens

**Fix:**
```bash
# Check browser console for errors
# Likely causes:
# 1. OPENAI_API_KEY not set
# 2. Rate limit exceeded
# 3. Network error

# Verify key is set:
echo $OPENAI_API_KEY  # Local
wrangler secret list  # Production
```

### Issue 2: Placeholder Responses

**Symptom:** Bot gives scripted responses like "That sounds interesting..."

**Fix:**
```bash
# OPENAI_API_KEY is missing or invalid
# Check .dev.vars file exists
ls -la .dev.vars

# Check key is valid (should start with sk-proj-)
head -1 .dev.vars
```

### Issue 3: Rate Limit Error

**Symptom:** "Too many messages. Please use the contact form."

**Fix:**
```bash
# Adjust rate limit in src/routes/api/chat.ts
# Current: 20 messages per 10 minutes
# Increase if needed:

const rateLimit = await checkRateLimit(env.RATE_LIMIT, ip, 30); // 30 messages
```

### Issue 4: Form Pre-fill Not Working

**Symptom:** Click "Fill form" but fields stay empty

**Fix:**
```typescript
// Check form field name attributes match
// File: src/components/site/Contact.tsx
// Should have:
// <input name="name" ... />
// <input name="company" ... />
// <select name="budget" ... />
// <textarea name="message" ... />

// If names don't match, update useChatbot.ts
```

### Issue 5: Mobile Keyboard Issues

**Symptom:** Keyboard covers input field on iOS

**Fix:**
```typescript
// Add viewport meta tag (if not present)
// File: src/routes/__root.tsx
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

// Or use the iOS keyboard fix from Enhancement 3 above
```

---

## TESTING CHECKLIST

### Pre-Deployment Tests

```bash
□ Local chatbot works with real API key
□ Placeholder mode works when key is missing
□ Rate limiting works (test 21 messages rapidly)
□ Form pre-fill works (name, company, budget, project)
□ Form CTA shows when conversation ready
□ Mobile responsive (test on phone)
□ Keyboard doesn't obscure input (iOS test)
□ Conversation history persists during page scroll
```

### Post-Deployment Tests

```bash
□ Production chatbot works
□ No console errors
□ OpenAI API calls successful
□ Rate limiting works
□ Form integration works
□ Analytics tracking works (if enabled)
□ Costs are reasonable (check OpenAI usage)
```

---

## NEXT STEPS

1. ✅ **Immediate:** Add OpenAI API key and deploy
2. ⏱ **Week 1:** Monitor conversations, check costs
3. 🔧 **Week 2:** Refine system prompt based on real data
4. 📊 **Week 3:** Add analytics if seeing good traction
5. 🎨 **Week 4:** A/B test different opening messages

---

## SUPPORT

**Questions?**
- Check `CHATBOT_AUDIT_REPORT.md` for detailed analysis
- Review `chatbot-system-prompt-enhanced.txt` for prompt examples
- Test locally before deploying to production

**Still stuck?**
- Check Cloudflare logs: `wrangler tail`
- Check OpenAI usage: https://platform.openai.com/usage
- Verify environment variables are set correctly

Good luck! 🚀
