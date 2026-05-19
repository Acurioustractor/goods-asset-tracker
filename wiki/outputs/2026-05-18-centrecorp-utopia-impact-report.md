# Centrecorp and Utopia Homelands Impact Report

Prepared: 18 May 2026

## Executive readout

Centrecorp's latest email makes the immediate need clear: the Board needs application forms, a report from the January 2026 bed funding, visible recognition for Centrecorp, and a better process than sending invoices before approval.

The strongest next step is to send one clean package:

- the three Donation Application forms as attachments, not invoices
- a one-page impact report on the January 2026 Utopia / Central Australia bed pathway
- the public recognition link: `/partners/centrecorp`
- a short note acknowledging the invoice confusion and confirming future requests will be sent as applications or quotes until approved

## Verified facts

### From Gmail

- User-provided email text from Nic to Randle records the first Utopia Homelands delivery plan as 60 beds, delivered with community on 7, 8 and 9 October. It says a local Aboriginal Corporation would lead cultural training and delivery, working with the Mayor and Councillors.
- 26 November 2025: Nic told Randle that the Utopia Homelands community had requested another 160 bed sets so every young person could have a bed off the ground.
- 2 December 2025: Nic sent an Oonchiumpa "Good News Story" PDF to Randle and Jodie. The attached letter says Oonchiumpa and A Curious Tractor had delivered beds to Alparra and Ampilatwatja, and that Elders Frank and Casey Holmes from Antarrengeny were grateful because they were no longer experiencing back pains after receiving beds.
- 13 April 2026: Nic told Randle the team was full steam ahead on Utopia Homelands beds and looking to deliver them the week of 18 May 2026.
- 18 May 2026: Randle replied that he had received only the three invoices, not the three applications. He said the third application had the best chance, but the Board would likely need reporting from the January 2026 funding: photos, community feedback, and community involvement in construction, delivery or maintenance.
- 18 May 2026: Randle also asked for public recognition for Centrecorp Foundation because searching "A Curious Tractor" and "Centrecorp" together produced no combined result.
- 18 May 2026: Randle asked why invoices were issued at application stage, warning that it could send the wrong signal to the Board.

### From Notion

- "107 Beds for Utopia Homelands" is recorded as Status: In production, What: Stretch Bed, Why: CentreCorp Funded.
- Centrecorp Foundation's Utopia Homelands opportunity is recorded as won / paid with value A$85,712 and Xero Invoice ID `94c64eb0-507c-4c8a-a84e-676c8c1baaec`.
- The photo library gap page says Utopia Homelands has 24 beds delivered but no photography on file, and needs at least three approved images: wide homeland context, bed in a homeland home where consent permits, and family using bed.

### From v2 Supabase, using curl not MCP

- The live `assets` schema does not match the generated TypeScript type exactly: the live table uses fields such as `product`, `community`, `supply_date`, `status`, `quantity` and `partner_name`; it does not have the local type's `type` column.
- Exact live count query found 8 Utopia Homelands `Stretch Bed` asset rows, all marked `deployed`, with `supply_date` 2 December 2025. These rows still contain stale notes saying "New Weave Bed batch", so the notes need cleanup before external use.
- Exact live count query found 60 Utopia Homelands `Basket Bed` asset rows, all marked `deployed`, with `supply_date` 8 October 2025 and place `Utopia Urapuntja Health Centre`. This aligns with the first October 2025 Utopia proof-point trip, not the next 107-bed Stretch Bed round.
- Exact live count query found 1 Centrecorp-tagged asset/request row: `REQ-CENTRECORP-2026`, product `Stretch Bed`, community `Tennant Creek`, status `requested`, quantity `108`, notes `Approved Jan 2026`.
- Supabase therefore confirms the need for reconciliation before any public or Board-facing report claims a final count. The current sources contain 100, 107, 108, 24, 8 and 60 in different contexts.

### From local wiki and app data

- `wiki/articles/communities/alice-springs-oonchiumpa.md` separates the 24-bed Utopia deployment snapshot from the 107-bed Centrecorp / Utopia pathway. Do not merge those numbers until the asset register is reconciled.
- `v2/src/lib/data/products.ts` is the product source of truth: the current product is the Stretch Bed, not the discontinued Weave Bed. Materials are recycled HDPE plastic legs, galvanised steel poles and heavy-duty Australian canvas.
- The Stretch Bed diverts 20kg of HDPE per bed, has 200kg capacity, assembles in about five minutes, and needs no tools.

### From Centrecorp public source

- Centrecorp Foundation's public vision is "To make a beneficial and ongoing difference to the lives of Aboriginal people in Central Australia."
- Its donation focus includes Aboriginal education and training, employment, health and welfare, sport and culture.
- Its public history names washing machines as a practical Central Australian health and household intervention.
- A cleaner 400x250 Centrecorp Foundation logo was found on the National Indigenous Vehicle Solutions site at `https://www.nivs.com.au/wp-content/uploads/2021/10/CentreCorp_1.jpg`. This is better than the email-signature thumbnail but still should be confirmed with Centrecorp before final publication.

## Inference

- Randle is trying to help the application succeed, but he is signalling that another funding request will be weak unless we close the reporting and recognition gaps first.
- The correct public story structure is: first 60-bed Utopia proof point from October 2025, Oonchiumpa Good News Story as feedback from that pathway, then the upcoming 107-bed Stretch Bed round with new photos and stories to come after delivery.
- The safest application to prioritise is Application 3: 130 beds requested from Tennant Creek and Mparntwe. That aligns with Randle's comment that it has the best chance.
- Application 1 (plastic collection and pre-processing unit) and Application 2 (washer v2) should probably be framed as future staged work unless Randle asks to keep all three live.
- The public page should be a recognition and impact page, not a live grant ask page.

## Unknown or needs confirmation

- Exact Board date: Randle's 13 April email says "Friday 27/05", but 27 May 2026 is a Wednesday. Since today is Monday 18 May 2026, the next Friday is 22 May 2026. Confirm whether the meeting is Friday 22 May 2026 or Wednesday 27 May 2026.
- Final count and grouping: Randle's email says 100 beds, Notion says 107 Utopia beds, Supabase has a Centrecorp-tagged request for 108 in Tennant Creek, the local wiki mentions 24 Utopia beds, and Supabase has separate deployed Utopia rows for 8 Stretch Beds and 60 Basket Beds.
- Whether the Centrecorp-funded beds are fully delivered, partly delivered, or still in production. Current Notion status says in production, while the v2 asset register has the Centrecorp-tagged row as `requested`.
- Which Utopia Homelands photos and quotes have consent for public web, funder pack, internal-only, or no use.
- Whether Centrecorp wants its logo shown as "Centrecorp Foundation" only, or with Centrecorp Aboriginal Investment Corporation / Centrebuild context.
- Whether the three new applications were successfully submitted through Centrecorp's online form, or only invoices were received.

## Public page built

Route: `/partners/centrecorp`

Purpose:

- create a public Google-indexable recognition point for "A Curious Tractor" and "Centrecorp Foundation"
- thank Centrecorp Foundation for Central Australia bed support
- explain the Utopia Homelands pathway in public-safe language
- show a cleaner Centrecorp Foundation logo sourced from a public NIVS page while awaiting official artwork from Centrecorp
- lead with the October 2025 first 60-bed Utopia field story: delivery, open assembly and household setup
- add the Oonchiumpa Good News Story as the community-feedback proof point from the first pathway
- frame the next 107-bed Stretch Bed round as upcoming, with new photos and stories to come after that trip
- add a public-safe photo record from the Utopia folder, with names withheld until consent notes are tied to the image set

Page content intentionally avoids:

- claiming a final bed count while 100 / 107 / 108 / 24 / 8 / 60 still need reconciliation
- using "Weave Bed" as current product language
- publishing invoice-stage detail
- overclaiming direct Utopia quotes before story consent is packaged

## Oonchiumpa Good News Story added

The page now links to `/docs/partners/centrecorp/oochiumpa-good-news-story.pdf`, copied from `/Users/benknight/Downloads/Oochiumpa Good News Story - A Curious Tractor Goods.pdf`.

Public-safe points used on the page:

- A Curious Tractor and Oonchiumpa Consultancy & Services built and delivered Goods Beds to community members in Alparra and Ampilatwatja.
- Elders Frank and Casey Holmes from Antarrengeny reported they were grateful and no longer experiencing back pains after receiving new beds.
- The partnership is framed around comfort, dignity and wellbeing across remote communities.

## Photo set added to the page

Resized copies from the October 2025 Utopia proof-point trip were exported from `/Users/benknight/Pictures/Utopia` into `v2/public/images/partners/centrecorp/utopia/`:

- `delivery-court.jpg` from `IMG_2751.jpg`
- `unpacking-parts.jpg` from `IMG_2867.jpg`
- `community-build.jpg` from `IMG_2870.jpg`
- `verandah-test.jpg` from `IMG_2915.jpg`
- `home-setup.jpg` from `IMG_2989.jpg`
- `finished-bed-country.jpg` from `IMG_3006.jpg`

The public page does not name people in the images. Before sending a final Board pack, attach consent status to each image: public web, funder pack only, internal only, or do not use.

## Muted video breaks added to the page

Two short no-sound MP4 loops were cut from the October 2025 Utopia proof-point footage and added as section breaks on the Centrecorp page:

- `utopia-bed-building.mp4` from `/Users/benknight/Downloads/IMG_2886.MOV`: 4-second bed-building loop under shade.
- `utopia-community-setup.mp4` from `/Users/benknight/Downloads/IMG_2753.MOV`: 10-second wide community setup loop under shade.

Both files are H.264, 1280x720, no audio stream, and are stored in `v2/public/video/partners/centrecorp/` with poster images beside them.

The page now also includes the full `IMG_2949.MOV` video as `utopia-good-news-full.mp4`, a 72-second H.264 1280x720 MP4 with AAC audio and controls. The top hero image was replaced with `hero-elder-bed.jpg`, exported from `/Users/benknight/Pictures/Utopia/IMG_2942.jpg`.

The Good News Story PDF images were extracted and added under the on-page story summary:

- `delivery-trailer.jpg`
- `elders-bed.jpg`
- `building-bed.jpg`

## What to add after the 107-bed trip

1. Delivery evidence
   - final Stretch Bed count delivered on the next trip
   - QR or asset IDs
   - delivery dates and locations
   - which records belong to the October 2025 first-60 proof point and which belong to the next 107-bed round

2. Photo evidence
   - wide homeland setting
   - bed in home where consent permits
   - community build workshop
   - recipients or families only with clear consent
   - image captions that name place, date and consent status

3. Community feedback
   - comfort
   - sleep off the ground
   - assembly and repair
   - product changes requested
   - who should receive the next beds

4. Community involvement
   - who helped construct beds
   - who helped prioritise distribution
   - who will help with maintenance or replacement parts
   - what role Oonchiumpa, local families and local organisations played

5. Centrecorp reporting
   - one-page public version
   - board pack version with photos and consent notes
   - invoice / payment reconciliation
   - clear application form attachments

## Recommended reply to Randle

Subject: Re: Tennant Creek Bed Funding

Hi Randle,

Thanks for the direct steer. That is very helpful.

Apologies on the applications. We will resend the three Donation Application forms today as separate attachments so you are not trying to assess from invoices. We also hear your point about invoices at application stage. Going forward we will send the Board application forms and quotes / costed scopes first, and only issue invoices once a request is approved or when Centrecorp asks for one.

On the reporting gap: yes, understood. We are putting together the January / Utopia impact report now. It will clearly separate the earlier Utopia proof point from the upcoming 107-bed Stretch Bed round. It will include:

- photos from the October Utopia delivery where consent is confirmed
- the Oonchiumpa Good News Story as community feedback from the first pathway
- a note that new photos and stories will follow the 107-bed trip
- community feedback on comfort, use, assembly and what should change next
- notes on who was involved in construction, delivery and maintenance
- a clean reconciliation of the Utopia and Centrecorp numbers so the Board can see what is already delivered, what is in production, what is recorded in the asset register, and what is being requested next

We have also now created a public recognition page for Centrecorp Foundation support here:

https://www.goodsoncountry.com/partners/centrecorp

That page acknowledges Centrecorp Foundation's support for practical bed infrastructure in Central Australia and the Utopia Homelands pathway. We can adjust wording or logo use if you or Jodie would like anything changed.

Based on your note, we will treat the third application as the priority application for this Board meeting and frame the production plant and washer work as staged future opportunities unless you advise otherwise.

Can you also confirm the Board meeting date? I have Friday in the thread, but also 27 May, so I want to make sure we are working to the right deadline.

Thanks again for helping us put this in the right shape for the Board.

Nic

## Source trail

- Gmail thread: `Tennant Creek Bed Funding`, messages from 5 February 2026 to 18 May 2026.
- Gmail thread: `Centrecorp Social Impact`, messages from 26 November 2025 to 11 December 2025.
- Gmail attachment: `Oochiumpa Good News Story - A Curious Tractor Goods.pdf`, sent 2 December 2025.
- Local PDF attachment: `/Users/benknight/Downloads/Oochiumpa Good News Story - A Curious Tractor Goods.pdf`.
- Notion page: `107 Beds for Utopia Homelands`, fetched 18 May 2026.
- Notion opportunity: `Centrecorp Foundation - Goods Weave Bed v2.3 - Utopia Homelands`, fetched 18 May 2026. Title retained in Notion, but product language should be corrected externally to Stretch Bed.
- Notion photo gap page: `Utopia Homelands (GAP)`, fetched 18 May 2026.
- v2 Supabase REST queries against project `cwsyhpiuepvdjtxaozwf`, fetched 18 May 2026 with service role key from `.env.local`.
- Local wiki: `wiki/articles/communities/alice-springs-oonchiumpa.md`.
- Product source: `v2/src/lib/data/products.ts`.
- Centrecorp Foundation public site: `https://www.centrecorpfoundation.com.au/`.
- NIVS logo source: `https://www.nivs.com.au/wp-content/uploads/2021/10/CentreCorp_1.jpg`.
