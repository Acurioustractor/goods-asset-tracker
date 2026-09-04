# Jodie Davis video title and text guidance

**Checked:** 1 September 2026  
**Purpose:** current, source-backed guidance for the Queensland giving-suite recut about Goods on Country and Palm Island.

## Recommended answer

### 1. Title slide

Use the written title:

> **Goods on Country**  
> *Inspiring stories of Queensland giving*

- In ordinary text, the name is **Goods on Country**, with no full stop after “Goods”. Do not use **Goods. on Country**, **the Goods project**, or **A Curious Tractor: Goods on Country**. The latest owner ruling makes Goods on Country the single current operating and public identity and retires “Goods.” as a separate maker/seller layer. [Repo identity ruling](../DECISIONS.md#2026-08-28--one-operating-home), [repo working instructions](../CLAUDE.md#goods-on-country)
- “Inspiring stories of Queensland giving” is acceptable as the suite descriptor if it is standard across the six films, but it is not the Goods on Country brand tagline. The brand guide’s current brand essence is **“The making belongs on Country.”** [Identity guide](../v2/public/brand/goods/brand-guide/GOODS-BRAND-GUIDE.md#brand-essence)
- The business-name record supports the current identity: ABN Lookup lists **Goods on Country** as a business name of The Butterfly Movement Ltd from 23 July 2026. [ABN Lookup, ABN 22 155 132 684](https://abr.business.gov.au/ABN/View/22155132684)
- The public About page still says “a project of A Curious Tractor”, but this predates and conflicts with the 28 August identity ruling, so it should not be reused for this recut. [Current public About page](https://www.goodsoncountry.com/about)

### Map place names

Preferred labels:

> **Palm Island (Bwgcolman)**  
> **Townsville — on Gurambilbarra and Thul Garrie Waja Country**

- **Palm Island (Bwgcolman)** is used by Palm Island Aboriginal Shire Council and the Australian Government. [Council: About Palm](https://www.palmcouncil.qld.gov.au/Explore/About-Palm), [Australian Government community profile](https://www.indigenous.gov.au/community/palm-island-bwgcolman)
- Do not describe Bwgcolman as displacing Manbarra Traditional Ownership. Council distinguishes the Manbarra people as Traditional Owners and the Bwgcolman people and descendants as the people brought to the mission from many Queensland communities. [Council: Cultural Awareness](https://www.palmcouncil.qld.gov.au/Explore/Cultural-awareness)
- Townsville City Council says the Wulgurukaba people call their Country **Gurambilbarra**, while the Bindal people call their Country **Thul Garrie Waja**. “Townsville (Gurambilbarra/Thul Garrie Waja)” is understandable but the slash can imply that they are interchangeable translations of one exact place. The “on … and … Country” wording preserves the distinction. [Townsville City Council: Traditional Landowners](https://www.townsville.qld.gov.au/about-townsville/history-and-heritage/townsville-history/traditional-landowners)
- If the map design requires a short parenthetical label, use **Townsville (Gurambilbarra and Thul Garrie Waja Countries)**, subject to the production’s existing local approval. Use Council’s current spellings exactly.

### 2. First text slide

Preferred copy:

> **Health hardware designed in community. Assembled on Country. Made by community. Made for community.**

This keeps the intended rhythm but uses the repo’s preferred formulation, “designed in community”, and sentence-case “community”. The current public site uses the closely related footer “Community-designed health hardware. Assembled on Country. Made by community, made for community”, while the repo’s newer standing language says design happens **in community / with community**. [Current Goods on Country homepage](https://www.goodsoncountry.com/), [repo brand-voice rule](../CLAUDE.md#brand-voice)

If the slide is meant as a literal claim about the Palm Island activity shown, rather than a whole-brand statement, use the more conservative:

> **Health hardware designed in community. Built for remote conditions. Made for community.**

Palm Island’s recorded 131 deployed beds are all legacy Basket Beds, with zero Stretch Beds recorded there, so a recut should not imply that current recycled-plastic Stretch Beds are already being manufactured on Palm Island. [Canonical community split](../v2/src/lib/data/community-canonical.ts)

### 3. Second text slide

Do **not** use the proposed present-tense wording unchanged. “Is working … to turn recycled plastic into … beds, creating sustainable enterprise, skills and local employment” makes local production and employment sound operational and achieved. The latest Palm Island pathway is at **Listen / Begin with Council**; local production is a later option, no capability audit has been completed, and the scope has not been agreed. [Palm Island pathway](../v2/src/lib/data/community-pathways.ts), [public-claim ceiling in road ending](../v2/src/lib/data/road-ending.ts)

Preferred copy:

> **Goods on Country has delivered beds to Palm Island and begun building local manufacturing skills. With Council and community, the next step is exploring whether recycled-plastic production could create paid local work and a pathway to sustainable enterprise.**

This separates what is evidenced now from what remains a possible next step. The repo records 131 beds on Palm Island and training for Ebony and Jahvan Oui in on-Country production, while stating that the production scope remains unagreed. [Canonical community split](../v2/src/lib/data/community-canonical.ts), [skills evidence](../v2/src/lib/data/impact-model.ts), [Palm Island claim ceiling](../v2/src/lib/data/road-ending.ts)

If the suite needs shorter copy:

> **Goods on Country has delivered beds to Palm Island and begun building local manufacturing skills. Recycled-plastic production is a future pathway being explored with Council and community.**

Avoid **portable** unless portability is visually important. The current product source of truth says **flat-packable** and **washable**, which is more precise. [Stretch Bed product data](../v2/src/lib/data/products.ts)

### 4. End slide

Use:

> **Learn more about Goods on Country**  
> **goodsoncountry.com**

Then use the **full supplied Goods on Country grounded lockup**, labelled internally as the “Goods on Country logo”. Do not type or recreate the mark. The approved lockup contains the visual full stop as part of the outlined artwork, but written references remain “Goods on Country”. [Brand-kit usage](../v2/public/brand/goods/README.md), [identity guide](../v2/public/brand/goods/brand-guide/GOODS-BRAND-GUIDE.md#logo-system)

The site’s canonical URL is `https://www.goodsoncountry.com/`; marketing materials commonly display it without `www`, so **goodsoncountry.com** is the clean end-card treatment. [Site metadata](../v2/src/app/layout.tsx), [public canonical context](../v2/public/llms-full.txt)

## Important conflict noted

The July brand kit still permits a standalone **Goods.** mark and the live public About page still calls the work an A Curious Tractor project. Both predate the 28 August identity ruling. For this new film, use the complete Goods on Country lockup and the written name **Goods on Country**; do not use the standalone Goods. mark or A Curious Tractor as a parent brand.
