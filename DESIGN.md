# Design System — ShoppingList

## 1. Visual Theme & Atmosphere

The theme is a **hunter's night** — a dark green-teal gloom (`#212C2A`, `#1A2321`, `#415854`) where the interface feels like a forest after midnight. The philosophy is "neon on velvet," and the velvet is green: every background carries a whisper of teal, and the signature accent is the phosphorescent **Green** (`#8AFF80`). Purple steps back into a supporting role while green leads actions, active states and focus.

Typography uses **Inter** for UI and reading, **JetBrains Mono** for the machine voice — code, timestamps, statuses and system messages. Weight builds hierarchy (700 titles, 600 buttons/headings, 400 body), the foreground stays the soft off-white `#F8F8F2`, and secondary text drops to a muted green-gray (`#70A99F`) — the "comment" color.

The defining move is the **double duty of green**: it is both the brand and the success color, so "primary action" and "alive/up/online" speak with one voice. The rest of the neon contract holds: red-salmon (`#FF9580`) means down/error, pink (`#FF80BF`) is live activity, cyan (`#80FFEA`) is links and bots, orange (`#FFCA80`) and yellow (`#FFFF80`) are warnings, and purple (`#9580FF`) becomes the calendar/meeting accent. Surfaces stay soft-rounded (8px–12px), elevation comes from lighter green steps, and focus glows green.

**Key Characteristics:**
- Green-teal immersive dark theme (`#1A2321`–`#415854`) — darkness with a forest soul
- Green (`#8AFF80`) as the primary brand accent — actions, active nav, focus, and success in one
- Full neon semantic set: red `#FF9580` = down/error, orange/yellow = warning, cyan = info/links/bots, pink = live activity, purple = meetings/calendar
- Off-white foreground (`#F8F8F2`) — never pure `#FFFFFF`
- Muted green-gray (`#70A99F`) for secondary text
- Inter for UI, JetBrains Mono for code/status/bot voice
- Soft radii (8px–12px), full circles (50%) for avatars and voice controls
- Elevation via lighter surface steps + subtle black shadows; focus via green glow rings

## 2. Color Palette & Roles

### Primary Brand
- **Green** (`#8AFF80`): Primary brand accent — primary buttons, active nav items, focus rings, selected states, UP/online status
- **Night** (`#212C2A`): Base background surface (app background)
- **Deep Night** (`#1A2321`): Deepest layer — sidebars, wells, recessed areas
- **Selection** (`#415854`): Active/selected item backgrounds, hover-strong, input borders

### Surfaces
- **Card** (`#293735`): Cards, post containers, channel list, elevated surfaces
- **Card Raised** (`#30413E`): Hover state on cards, dropdowns, popovers
- **Selection** (`#415854`): Selected rows, active channel, pressed states

### Text
- **Foreground** (`#F8F8F2`): Primary text — soft off-white
- **Comment** (`#70A99F`): Secondary text, muted labels, timestamps, placeholders, inactive nav
- **Green Tint** (`#8AFF80` at 50% — `#8AFF807F`): Tertiary/disabled text on dark

### Semantic (the neons)
- **Green** (`#8AFF80`): Success, app **UP**, online presence, connected voice — shared with brand
- **Red** (`#FF9580`): Error, app **DOWN**, destructive actions, missed/failed
- **Orange** (`#FFCA80`): Warning, degraded status, pending checks
- **Yellow** (`#FFFF80`): Attention highlights, unread markers, starred
- **Cyan** (`#80FFEA`): Links, informational badges, **bot identity**, meeting links
- **Pink** (`#FF80BF`): Live/real-time — mentions, active voice pulse, recording, scrollbars, notification badges
- **Purple** (`#9580FF`): Calendar & meeting accent — event chips, scheduled states, secondary highlight

### Borders & Lines
- **Border** (`#415854`): Standard border on inputs and dividers between zones
- **Border Subtle** (`#293735`): Hairline separators inside cards, list dividers
- **Black Veil** (`rgba(0,0,0,0.5)`): Outer window/dialog borders

### Shadows & Glows
- **Card Shadow** (`rgba(0,0,0,0.3) 0px 4px 12px`): Cards, dropdowns
- **Dialog Shadow** (`rgba(0,0,0,0.5) 0px 8px 24px`): Modals, overlays
- **Green Glow** (`rgba(138,255,128,0.4) 0px 0px 0px 3px`): Focus rings
- **Pink Glow** (`rgba(255,128,191,0.5) 0px 0px 12px`): Live voice indicator pulse
- **Green Status Glow** (`rgba(138,255,128,0.4) 0px 0px 8px`): App "UP" status dot
- **Red Glow** (`rgba(255,149,128,0.5) 0px 0px 8px`): App "DOWN" status dot

## 3. Typography Rules

### Font Families
- **UI / Body**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Mono (code, status, timestamps, bot messages)**: `"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Color | Notes |
|------|------|------|--------|-------------|-------|-------|
| Page Title | Inter | 24px (1.50rem) | 700 | 1.20 | `#F8F8F2` | Section headers (Home, Calendar…) |
| Section Heading | Inter | 18px (1.13rem) | 600 | 1.30 | `#F8F8F2` | Card titles, modal titles |
| Post Author / Emphasis | Inter | 16px (1.00rem) | 700 | 1.40 | `#F8F8F2` | Names, emphasized text |
| Body | Inter | 16px (1.00rem) | 400 | 1.50 | `#F8F8F2` | Posts, messages, descriptions |
| Nav Link Active | Inter | 14px (0.88rem) | 700 | 1.40 | `#F8F8F2` | Sidebar active item |
| Nav Link | Inter | 14px (0.88rem) | 400 | 1.40 | `#70A99F` | Sidebar inactive item |
| Button | Inter | 14px (0.88rem) | 600 | 1.00 | varies | Letter-spacing 0.3px |
| Channel Name | Inter | 14px (0.88rem) | 600 | 1.40 | `#70A99F` / `#F8F8F2` active | `#` prefix in `#70A99F` |
| Caption / Meta | Inter | 13px (0.81rem) | 400 | 1.40 | `#70A99F` | Post meta, attendee counts |
| Timestamp / Status | JetBrains Mono | 12px (0.75rem) | 400 | 1.50 | `#70A99F` | Message times, check intervals |
| Badge / Tag | Inter | 11px (0.69rem) | 600 | 1.30 | varies | Uppercase, letter-spacing 0.5px |
| Bot Label | JetBrains Mono | 10px (0.63rem) | 700 | 1.00 | `#212C2A` on `#80FFEA` | "BOT" chip, uppercase |

### Principles
- **Weight over size**: hierarchy is built with 700/600/400 contrast; the size range stays compact (10px–24px) — an app for scanning feeds and channels, not an editorial site.
- **Off-white always**: primary text is `#F8F8F2`, never `#FFFFFF` — pure white vibrates on the green darkness.
- **Mono as the machine voice**: anything produced by the system (health checks, timestamps, bot posts, meeting codes) renders in JetBrains Mono, visually separating human talk from machine talk.
- **Muted by default**: secondary information sits at `#70A99F`; color is earned, not decorative.

## 4. Component Stylings

### Buttons

**Primary (Green)**
- Background: `#8AFF80`
- Text: `#212C2A` (dark text on neon)
- Padding: 10px 20px
- Radius: 8px
- Hover: lighten to `#A3FF9B`; Focus: green glow ring
- Use: New Post, Schedule Meeting, Register App, Save, Join Voice

**Secondary (Ghost)**
- Background: transparent
- Text: `#F8F8F2`
- Border: `1px solid #415854`
- Padding: 10px 20px
- Radius: 8px
- Hover: background `#293735`
- Use: Cancel, secondary actions, filters

**Danger**
- Background: transparent, Text: `#FF9580`, Border: `1px solid #FF9580`
- Hover: background `rgba(255,149,128,0.1)`
- Use: Delete post, remove app, leave channel

**Meeting / Calendar Accent**
- Background: `#9580FF`, Text: `#212C2A`
- Radius: 8px
- Use: Calendar-specific CTAs where green already means "join/up" (e.g. RSVP, add to calendar)

**Circular Icon Button**
- Background: `#293735`, Icon: `#F8F8F2`
- Padding: 10px, Radius: 50%
- Hover: `#415854`
- Use: Mute/unmute, attach file, emoji, close

### Cards & Containers (posts, apps, meetings)
- Background: `#293735`
- Radius: 12px
- Border: none (surface contrast does the work); optional `1px solid #415854` on interactive cards
- Hover: background `#30413E`
- Shadow: `rgba(0,0,0,0.3) 0px 4px 12px`
- Post cards: author avatar (50% circle, 40px) + name (16px/700) + timestamp (mono 12px `#70A99F`)

### Status Badges (Apps)
- **UP**: `#8AFF80` dot with green glow + "UP" in JetBrains Mono 11px, text `#8AFF80`
- **DOWN**: `#FF9580` dot with red glow + "DOWN", text `#FF9580`
- **PENDING**: `#FFCA80` dot, text `#FFCA80`
- Chip background: `rgba(color, 0.1)`, radius 6px, padding 2px 8px

### Inputs
- Background: `#1A2321`
- Text: `#F8F8F2`; Placeholder: `#70A99F`
- Border: `1px solid #415854`
- Radius: 8px; Padding: 10px 14px
- Focus: border `#8AFF80` + green glow ring (`rgba(138,255,128,0.4) 0 0 0 3px`)
- Message composer: pill variant (radius 24px) pinned to channel bottom

### Navigation (Left Sidebar)
- Background: `#1A2321`, full height, 260px wide
- Codeline logo top; nav items: Home, Calendar, Meet, Apps, Notifications
- Active item: background `#415854`, text `#F8F8F2` 700, left accent bar 3px `#8AFF80`, radius 8px
- Inactive: text `#70A99F` 400; hover: background `#293735`
- Notification badge: `#FF80BF` circle, dark text, 11px/600
- **Profile block pinned at bottom**: rounded avatar (50%, 36px), name 14px/600 `#F8F8F2`, status 12px mono `#70A99F`, online dot `#8AFF80`

### Chat & Channels (Meet)
- Channel list on `#1A2321`; active channel row `#415854` with radius 6px
- Private channels: lock icon in `#70A99F`; public: `#` prefix
- Messages: no bubbles — Discord-style rows on hover-highlight `#293735`
- Mentions: `@name` in `#FF80BF` on `rgba(255,128,191,0.1)` chip
- Bot messages: cyan left border 2px, "BOT" chip (`#80FFEA` background, `#212C2A` text)
- Voice participants: avatar circles; speaking = pink glow ring pulse

### Calendar
- Grid lines: `#293735` hairlines on `#212C2A`
- Today: cell tinted `rgba(138,255,128,0.08)`, date number in `#8AFF80` 700
- Meeting events: purple chip (`rgba(149,128,255,0.15)` background, `#9580FF` text, 6px radius) — purple keeps meetings distinct from the green brand
- Incident (app down) events: red chip (`rgba(255,149,128,0.15)` background, `#FF9580` text)
- Meeting links: `#80FFEA`, underline on hover

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px

### Grid & Container
- **Three-zone shell**: fixed left sidebar (260px, `#1A2321`) + fluid main content (`#212C2A`) + right rail (300px, DMs/contacts, on Home)
- Feed column max-width: 680px, centered in main zone
- Meet: channel list (240px) + message area (fluid) + members panel (240px, collapsible)
- Apps: responsive card grid (3 → 2 → 1 columns)

### Whitespace Philosophy
- **Comfortable density**: denser than a marketing site, airier than Discord — 16px–24px padding inside cards, 16px gaps between feed items.
- The green-dark background provides visual rest; separation comes from surface steps (`#1A2321` → `#212C2A` → `#293735`), not from borders or big gaps.

### Border Radius Scale
- Subtle (6px): badges, chips, event pills, channel rows
- Standard (8px): buttons, inputs, nav items
- Comfortable (12px): cards, posts, modals, panels
- Pill (24px): message composer, search input
- Circle (50%): avatars, icon buttons, voice controls, status dots

## 6. Depth & Elevation

| Level | Surface | Treatment | Use |
|-------|---------|-----------|-----|
| Recessed (−1) | `#1A2321` | none | Sidebars, input wells, code blocks |
| Base (0) | `#212C2A` | none | Page background |
| Surface (1) | `#293735` | `rgba(0,0,0,0.3) 0px 4px 12px` | Cards, posts, channel panels |
| Raised (2) | `#30413E` | `rgba(0,0,0,0.3) 0px 4px 12px` | Dropdowns, popovers, hover cards |
| Overlay (3) | `#293735` | `rgba(0,0,0,0.5) 0px 8px 24px` + backdrop `rgba(26,35,33,0.8)` | Modals, dialogs |
| Focus | any | Neon glow ring (green/pink) | Focused inputs, live states |

**Elevation Philosophy**: depth is communicated primarily by **lighter green surface steps** — the closer to the user, the lighter the teal. Shadows are supporting actors (soft, black, medium opacity); **glows are reserved for meaning** (focus, live voice, up/down status), never decoration.

## 7. Do's and Don'ts

### Do
- Keep every background in the green-dark family (`#1A2321`–`#415854`) — the teal tint is the identity
- Use `#F8F8F2` for primary text and `#70A99F` for everything secondary
- Assign accents by meaning: green = action/up/online, red `#FF9580` = down/error, cyan = links/bots, pink = live/mentions, orange/yellow = warnings, purple = meetings
- Put dark text (`#212C2A`) on neon-filled buttons — neons are too bright for white text
- Use JetBrains Mono for timestamps, statuses, health checks and bot output
- Use surface steps for elevation and neon glows for focus/live states
- Keep avatars, voice controls and status dots perfectly circular

### Don't
- Don't use pure black (`#000000`) or pure white (`#FFFFFF`) surfaces or text — everything is tinted
- Don't use neon colors as large background fills — they are accents on 10%-opacity tints at most
- Don't let brand-green and destructive actions meet — anything that deletes or fails is `#FF9580`, no exceptions
- Don't reuse violet surfaces (`#22212C`, `#454158`) — this theme's darkness is green, mixing the two muddies both
- Don't use gray borders from outside the palette — borders are `#415854` or absent
- Don't put white text on `#8AFF80`/`#9580FF` buttons — contrast comes from the dark night color
- Don't add new hues — the eight accent colors are the complete vocabulary
- Don't rely on shadows alone for elevation — on green darkness, surface lightening reads better

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column; sidebar → bottom tab bar (Home, Calendar, Meet, Apps, Notifications); right rail hidden |
| Tablet | 640–1024px | Icon-only left sidebar (72px); right rail hidden; feed fluid |
| Desktop | 1024–1440px | Full sidebar (260px) + main; right rail on Home ≥1200px |
| Large | >1440px | Full three-zone layout; Meet members panel visible |

### Collapsing Strategy
- Left sidebar: full (260px) → icons only (72px) → bottom tab bar; profile block collapses to avatar only
- Right DM rail: fixed panel → floating chat button (bottom-right) with unread badge
- Meet: members panel and channel list become slide-over drawers on mobile
- Calendar: month grid → agenda list on mobile
- Apps grid: 3 → 2 → 1 columns
- Post composer: inline card → full-screen modal on mobile

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: Night (`#212C2A`)
- Recessed / sidebar: Deep Night (`#1A2321`)
- Surface / card: `#293735`
- Selected / border: `#415854`
- Text: Foreground (`#F8F8F2`)
- Secondary text: Comment (`#70A99F`)
- Accent / brand / success / up: Green (`#8AFF80`)
- Error / down: Red (`#FF9580`)
- Warning: Orange (`#FFCA80`) / Yellow (`#FFFF80`)
- Links / bots / info: Cyan (`#80FFEA`)
- Live / mentions / badges: Pink (`#FF80BF`)
- Meetings / calendar: Purple (`#9580FF`)

### Example Component Prompts
- "Create a post card: `#293735` background, 12px radius, shadow `rgba(0,0,0,0.3) 0 4px 12px`. Author name 16px Inter 700 `#F8F8F2`, timestamp 12px JetBrains Mono `#70A99F`. Hover background `#30413E`."
- "Design a primary button: `#8AFF80` background, `#212C2A` text, 8px radius, 10px 20px padding, 14px Inter 600, letter-spacing 0.3px. Focus ring `rgba(138,255,128,0.4) 0 0 0 3px`."
- "Build an app status badge: dot `#8AFF80` with glow `rgba(138,255,128,0.4) 0 0 8px`, label 'UP' in JetBrains Mono 11px `#8AFF80`, chip background `rgba(138,255,128,0.1)`, 6px radius."
- "Create the sidebar: `#1A2321` background, 260px. Active item: `#415854` background, 3px `#8AFF80` left bar, text `#F8F8F2` 700. Inactive: `#70A99F` 400. Profile pinned bottom: 36px circular avatar, `#8AFF80` online dot."
- "Design a bot message row: 2px `#80FFEA` left border, 'BOT' chip `#80FFEA` background with `#212C2A` 10px mono 700 uppercase text, message body 16px Inter `#F8F8F2`."
- "Create a calendar meeting event: chip background `rgba(149,128,255,0.15)`, text `#9580FF` 13px 600, 6px radius, meeting link in `#80FFEA`."

### Iteration Guide
1. Start every surface in the green-dark family — `#1A2321` recessed, `#212C2A` base, `#293735` cards
2. Green `#8AFF80` for anything clickable-and-primary and anything alive; dark text on neon fills
3. Wire the semantic contract: red down, cyan bot/link, pink live, orange/yellow warn, purple meetings
4. Mono voice for the machine — timestamps, health checks, bot posts in JetBrains Mono
5. Elevation = lighter teal; focus/live = neon glow; shadows stay soft and black
6. Circles for people and voice (avatars, mic buttons, status dots); 8–12px radius for everything else
