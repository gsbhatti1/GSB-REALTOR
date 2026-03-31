# GSB Realtor — Social Media Automation Plan
*Generated: March 31, 2026*

---

## 1. Daily Content Schedule (n8n Cron Workflows to Build)

Three n8n workflows run daily against the content API at `https://www.gsbrealtor.com/api/daily-content`. The API returns all three time slots in a single response under `posts.morning`, `posts.noon`, and `posts.evening`. Each slot contains `facebook`, `instagram`, `twitter`, `tiktok_script`, `linkedin`, and `hashtags` fields.

### Workflow A: "GSB — Morning Social Post" (7:00 AM MT = 13:00 UTC)

- **Trigger:** Cron at `0 13 * * *` (daily 13:00 UTC)
- **Step 1:** HTTP GET `https://www.gsbrealtor.com/api/daily-content`
- **Step 2:** Extract `{{ $json.posts.morning }}` from the response
- **Step 3:** Format and send Telegram message to bot `8787916937`, chat `8441233388`

### Workflow B: "GSB — Noon Social Post" (12:00 PM MT = 18:00 UTC)

- **Trigger:** Cron at `0 18 * * *` (daily 18:00 UTC)
- **Step 1:** HTTP GET `https://www.gsbrealtor.com/api/daily-content`
- **Step 2:** Extract `{{ $json.posts.noon }}` from the response
- **Step 3:** Format and send Telegram message (same bot/chat)

### Workflow C: "GSB — Evening Social Post" (6:00 PM MT = 00:00 UTC next day)

- **Trigger:** Cron at `0 0 * * *` (daily 00:00 UTC — midnight UTC = 6 PM MT prev day)
- **Step 1:** HTTP GET `https://www.gsbrealtor.com/api/daily-content`
- **Step 2:** Extract `{{ $json.posts.evening }}` from the response
- **Step 3:** Format and send Telegram message (same bot/chat)

---

## 2. Telegram Message Format

When content is generated, send to Telegram in this exact format. The n8n Code node builds this string before passing to the Telegram node.

```
📱 GSB REALTOR DAILY POST — [Morning/Noon/Evening]
Type: [listing/tip/market_update/etc]

📘 FACEBOOK:
[facebook content]

📸 INSTAGRAM:
[instagram content]

🐦 X/TWITTER:
[twitter content]

💼 LINKEDIN:
[linkedin content]

🎵 TIKTOK SCRIPT:
[tiktok_script]

#️⃣ HASHTAGS:
[hashtags joined by space]
```

### n8n Code Node (JavaScript) — Morning example

```javascript
const slot = $input.first().json.posts.morning;
const label = slot.slot.charAt(0).toUpperCase() + slot.slot.slice(1);
const hashtags = Array.isArray(slot.content.hashtags)
  ? slot.content.hashtags.join(' ')
  : slot.content.hashtags;

const message = `📱 GSB REALTOR DAILY POST — ${label}
Type: ${slot.type}

📘 FACEBOOK:
${slot.content.facebook}

📸 INSTAGRAM:
${slot.content.instagram}

🐦 X/TWITTER:
${slot.content.twitter}

💼 LINKEDIN:
${slot.content.linkedin}

🎵 TIKTOK SCRIPT:
${slot.content.tiktok_script}

#️⃣ HASHTAGS:
${hashtags}`;

return [{ json: { text: message } }];
```

Replace `morning` with `noon` or `evening` for the other workflows.

---

## 3. Direct Posting via n8n (When Accounts Are Connected)

Once API credentials are obtained for each platform, replace the Telegram notification step with direct HTTP Request nodes:

### Facebook
- **Node:** HTTP Request
- **Method:** POST
- **URL:** `https://graph.facebook.com/v19.0/{PAGE_ID}/feed`
- **Auth:** OAuth2 / Page Access Token (stored in n8n credentials)
- **Body:**
  ```json
  { "message": "{{ $json.posts.morning.content.facebook }}", "access_token": "{{ $credentials.facebookAccessToken }}" }
  ```

### Instagram
- **Node:** HTTP Request
- **Method:** POST (two-step: create container, then publish)
- **URL Step 1:** `https://graph.facebook.com/v19.0/{IG_USER_ID}/media`
- **URL Step 2:** `https://graph.facebook.com/v19.0/{IG_USER_ID}/media_publish`
- **Note:** Requires Facebook Business account and connected Instagram Professional account via Meta Business Suite.

### Twitter / X
- **Node:** HTTP Request
- **Method:** POST
- **URL:** `https://api.twitter.com/2/tweets`
- **Auth:** OAuth 1.0a (Consumer Key + Secret + Access Token + Secret stored in n8n credentials)
- **Body:**
  ```json
  { "text": "{{ $json.posts.morning.content.twitter }}" }
  ```

### TikTok
- **Note:** TikTok's Content Posting API requires Business Account verification and app review. Until approved, use the Telegram notification workflow for manual posting from the TikTok mobile app.
- **Future:** Once approved, use HTTP Request to `https://open.tiktokapis.com/v2/post/publish/video/init/` with OAuth 2.0.

### LinkedIn
- **Node:** HTTP Request
- **Method:** POST
- **URL:** `https://api.linkedin.com/v2/ugcPosts`
- **Auth:** OAuth 2.0 (stored in n8n credentials)
- **Body:**
  ```json
  {
    "author": "urn:li:person:{PERSON_ID}",
    "lifecycleState": "PUBLISHED",
    "specificContent": {
      "com.linkedin.ugc.ShareContent": {
        "shareCommentary": { "text": "{{ $json.posts.morning.content.linkedin }}" },
        "shareMediaCategory": "NONE"
      }
    },
    "visibility": { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
  }
  ```

---

## 4. Content Calendar Strategy

The daily-content API rotates content type by day of week. Here is the rotation for manual reference and content planning:

| Day       | Content Type              | Focus                                      |
|-----------|---------------------------|--------------------------------------------|
| Monday    | New listing spotlight     | Highlight a current active listing         |
| Tuesday   | Market update             | Utah market stats, trends, interest rates  |
| Wednesday | Real estate tip           | Buyer/seller education, process tips       |
| Thursday  | Neighborhood spotlight    | Feature a Utah city or neighborhood        |
| Friday    | Commercial/investor       | Investment properties, ROI, cap rates      |
| Saturday  | Success story / sold      | Celebrate a closed deal, client win        |
| Sunday    | Lifestyle / community     | Utah living, community events, lifestyle   |

**Post timing (Mountain Time):**
- 7:00 AM — Morning post (highest organic reach for real estate)
- 12:00 PM — Noon post (lunch-hour scroll)
- 6:00 PM — Evening post (after-work peak engagement)

---

## 5. What to Do Now (Action Items)

Complete these steps in order to fully activate the social media automation:

1. **Create Instagram account** on phone with username `gsbrealtorUtah`
   - Set as Professional (Creator or Business) account
   - Add bio, profile photo (Gurpreet's headshot), and website `gsbrealtor.com`

2. **Create TikTok account** on phone with username `gsbrealtorUtah`
   - Set as Business account for future API access
   - Add bio linking to `gsbrealtor.com`

3. **Add LinkedIn connections then create company page**
   - Personal profile: connect with 50+ Utah real estate contacts first (required for company page)
   - Create company page: "GSB Realtor" — add logo, description, website

4. **Connect Facebook page to Instagram** via Meta Business Suite
   - Go to business.facebook.com → Settings → Accounts → Instagram
   - This unlocks the Instagram Graph API for automated posting

5. **Build the 3 n8n cron workflows** (see `n8n-social-workflows.json` for importable configs)
   - Import each workflow JSON into https://gsb-realtor.app.n8n.cloud
   - Add Telegram bot token to n8n credentials (Telegram API)
   - Activate all three workflows

6. **Connect Twitter/X API to n8n**
   - Go to developer.twitter.com → Create project & app
   - Generate OAuth 1.0a keys (Consumer Key/Secret + Access Token/Secret)
   - Add to n8n: Settings → Credentials → Twitter OAuth1 API
   - Replace Telegram step with Twitter HTTP Request node once ready

---

## API Response Structure Reference

The `GET https://www.gsbrealtor.com/api/daily-content` endpoint returns:

```json
{
  "date": "2026-03-31",
  "posts": {
    "morning": {
      "slot": "morning",
      "type": "listing|tip|market_update|commercial|neighborhood|success_story|lifestyle",
      "content": {
        "facebook": "...",
        "instagram": "...",
        "twitter": "...",
        "tiktok_script": "...",
        "linkedin": "...",
        "hashtags": ["#tag1", "#tag2"]
      },
      "generated_at": "2026-03-31T19:13:09.498Z"
    },
    "noon": { "...same structure..." },
    "evening": { "...same structure..." }
  },
  "schedule": {
    "morning": "2026-03-31T13:00:00.000Z",
    "noon": "2026-03-31T18:00:00.000Z",
    "evening": "2026-04-01T00:00:00.000Z"
  },
  "ready_to_post": true
}
```

**n8n expression path examples:**
- Facebook morning: `{{ $json.posts.morning.content.facebook }}`
- Instagram noon: `{{ $json.posts.noon.content.instagram }}`
- Twitter evening: `{{ $json.posts.evening.content.twitter }}`
- Hashtags (array): `{{ $json.posts.morning.content.hashtags.join(' ') }}`
- Post type: `{{ $json.posts.morning.type }}`
