# Contact form flow: build in GHL + test end-to-end

> The contact form is deployed and applies `act-inquiry` + `project-goods` + saves the message as a Note. The Universal Inquiry pipeline already exists. You build ONE workflow, then test.

## Build the workflow

**Step 1 — New workflow**
Automation → Workflows → **+ Create Workflow → Start from Scratch**. Name it **"Contact → Universal Inquiry"**.
*(Shortcut: if a workflow already creates the "Website Contact Form" cards, just open it and add `act-inquiry` to its trigger — skip to Step 7.)*

**Step 2 — Trigger**
**+ Add New Trigger** → choose **Contact Tag**. Set: Tag **is** **`act-inquiry`**.
- If `act-inquiry` is not in the dropdown yet, **type it to create it**, or do one test submission first (Step 7) so it exists, then come back.

**Step 3 — Create the opportunity**
**+** (add action) → **Create Opportunity** (the new dedicated action; the old "Create/Update Opportunity" is being deprecated — use **Create Opportunity** since each submission is a fresh lead):
- Pipeline: **Universal Inquiry** · Stage: **New Inquiry**
- Opportunity name: `{{contact.first_name | "New"}} – Inquiry`
- Source: `Goods Website Contact Form` · Status: **Open**

**Step 4 — Notify the team**
**+** → **Send Internal Notification → Email**:
- To: **hi@act.place**
- Subject: `New inquiry – {{contact.first_name | "someone"}}`
- Body: name / email / phone + "Full message is in the contact's Notes."

**Step 5 — Acknowledge the sender**
**+** → **Send Email** → To: **Contact**:
- Subject: `Thanks, we've got your message`
- Body (paste): Hi {{contact.first_name | "there"}}, thanks for reaching out to Goods on Country. Your message has landed with us and a real person will get back to you, usually within a couple of business days. We read every message properly; if yours is time-sensitive, just reply to this email. Talk soon, The Goods on Country team.

**Step 6 — Publish**
Top right: toggle **Publish ON**, then **Save**. (A saved-but-unpublished workflow will NOT fire.)

## Test the full flow

**Step 7 — Submit a real test**
Go to **https://www.goodsoncountry.com/contact**, fill it in with an email you can check, pick a Subject, write a message, submit.

**Step 8 — Verify all five land:**
1. **Contact created** (GHL → Contacts): tags include `act-inquiry` + `project-goods` + the subject tag. *(Confirms the deploy is live.)*
2. **Message readable**: open the contact → Notes → your message is there.
3. **Opportunity**: Opportunities → Universal Inquiry → **New Inquiry** has a new card.
4. **Internal notification**: an email arrived at **hi@act.place**.
5. **Acknowledgement**: the test inbox got the "Thanks, we've got your message" email.

All five = the flow works.

## If something doesn't fire
- **No `act-inquiry` tag on the contact** → the deploy may not be live yet, or you submitted before it deployed. Re-submit; check again.
- **Tag there but no opportunity/emails** → the workflow wasn't **Published**, or the trigger tag isn't exactly `act-inquiry`.
- **No emails at all** → check GHL's email sending is configured (from-address verified) under Settings → Email Services.
- **Opportunity but no card visible** → check the board filter isn't hiding it (clear filters, or filter `project-goods`).
