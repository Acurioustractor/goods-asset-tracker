# Universal Inquiry: stage descriptions + auto-acknowledge email

> Paste-ready. Stage descriptions go on each GHL pipeline stage (Pipelines → edit stage → Description). The acknowledge email goes in the entry workflow's "Send Email" action (to the contact). Brand voice: warm, grounded, no em dashes, "On Country" capitalised.

## Stage descriptions (Universal Inquiry)

**1. New Inquiry**
> A fresh inquiry just arrived from a website contact form and nobody has looked at it yet. Read it (the full message is in the contact's Notes), then within one business day move it to Needs Assessment, or straight to Routed to Project if the owner is obvious. SLA: triaged within 1 business day.

**2. Needs Assessment**
> We've read it and are working out what it's about and who should own it. Clarify with the person if needed, confirm the owning project, and check it's something we can help with. Move to Routed to Project once an owner is clear, or Out of Scope if it isn't a fit.

**3. Routed to Project**
> Handed to the owning project (filter by the `project-` tag, e.g. `project-goods`). That project's owner now leads the reply and any follow-up in their own pipeline. Close this card once the hand-over is done.

**4. Out of Scope**
> Not something we can act on (spam, unrelated, or politely declined). Send a courteous close if appropriate, set a lost reason, and archive. We keep the contact on record, there's just no active work.

## Auto-acknowledge email (sent to the person on submit)

Add a **Send Email** action in the entry workflow, to the contact. From a monitored address, reply-to monitored.

### Goods version (when `project-goods`)
**Subject:** Thanks, we've got your message

> Hi {{contact.first_name}},
>
> Thanks for reaching out to Goods on Country. Your message has landed with us, and a real person on the team will get back to you, usually within a couple of business days.
>
> We read every message properly. If yours is time-sensitive, just reply to this email and tell us, and we'll move it up.
>
> While you're here, this is where the work is at: https://www.goodsoncountry.com/story
>
> Talk soon,
> The Goods on Country team
> www.goodsoncountry.com

### ACT-neutral version (any project / fallback)
**Subject:** Thanks, we've got your message

> Hi {{contact.first_name}},
>
> Thanks for getting in touch with A Curious Tractor. Your message is with us and a real person will get back to you, usually within a couple of business days.
>
> We read everything that comes through. If it's time-sensitive, just reply here and let us know.
>
> Talk soon,
> The A Curious Tractor team

## Notes for setup
- **Name fallback:** if some contacts have no first name, use GHL's fallback syntax so it doesn't read "Hi ,": `{{contact.first_name | "there"}}`.
- **From / reply-to:** send from a monitored inbox (e.g. hi@act.place) so replies are seen.
- **Project-aware (optional):** in the workflow, add an If/Else on tag `project-goods` → send the Goods version; else → the ACT-neutral version. One workflow, right voice per project.
- **Keep it plain:** plain-text style reads more personal than a heavy template for an acknowledgement.
- Pair this with the **internal notification** to hi@act.place (separate action in the same workflow) so the team is alerted while the sender is acknowledged.
