# TEE UP — PRODUCT DESIGN & PROTOTYPE SPECIFICATION

## 1. Product

Create a premium, modern golf-learning web application called **TEE UP**.

Tagline:

**Golf without the guesswork.**

TEE UP makes golf more accessible to beginners and helps golfers understand concepts that are traditionally difficult to learn without coaching or extensive resources.

The product has three primary learning experiences:

* **BOBA** — Golf Clubs
* **MATCHA** — Course Management
* **OOLONG** — Swing Mechanics

The tea names are part of the visual identity. Do not make the interface look like a generic golf website.

The aesthetic should combine:

* premium golf
* modern sports technology
* Japanese/Asian tea aesthetics
* realistic natural environments
* frosted/liquid glass
* cinematic motion
* minimal modern UI

---

# 2. Overall visual direction

Use an almost-black dark brown instead of pure black.

The site should feel like the user is looking through the windows of a modern golf clubhouse onto a golf course.

The background should generally consist of:

1. a realistic golf-course environment,
2. a foggy/sanded glass layer,
3. translucent interface panels above the glass.

Use realistic materials wherever possible.

Do NOT use emoji as final visual assets.

Replace tea-related emojis with realistic stylized golf tees shaped like:

* boba/milk-tea cups
* matcha tea cups
* porcelain oolong teapots

These should still clearly read as golf tees.

---

# 3. Glass design system

Create two reusable glass components.

## White Glass

Used for white UI panels.

Properties:

* opaque white base
* subtle frosted/sanded texture
* very mild transparency
* backdrop blur
* subtle internal highlight
* minimal border
* soft shadow

## Dark Glass

Used over grass, golf-course imagery, and dark sections.

Properties:

* extremely dark brown base
* translucent appearance
* backdrop blur
* subtle reflection/highlight
* white typography

All rounded UI containers must use the SAME corner radius.

Do not mix different corner radii across components.

---

# 4. Navigation

Create a minimal fixed navigation bar.

Logo:

**TEE UP**

Navigation:

* Home
* Boba
* Matcha
* Oolong

Use bold, modern typography.

Navigation should remain visually lightweight and should not compete with the page content.

---

# 5. MAIN PAGE

## Hero

Large headline:

**Golf without the guesswork.**

Supporting copy should communicate that TEE UP helps golfers understand golf concepts, terminology, and strategy without requiring private coaching.

Primary CTA:

**Start Learning**

Secondary CTA:

**Explore Golf**

The background should show a realistic golf course through foggy/sanded glass, as though viewed from inside a clubhouse.

---

# 6. Main-page interactive scorecard

Create a scorecard/statistics section.

The scorecard should visually resemble a premium golf scorecard but behave like liquid glass.

When the user scrolls:

* the scorecard reacts to scroll velocity,
* faster scrolling creates stronger liquid waves,
* slower scrolling produces subtle movement,
* the panel should feel like a flexible liquid/glass surface.

Use the liquid-glass-js project as a visual/technical reference:

https://github.com/dashersw/liquid-glass-js

Do not make the effect distracting.

It should feel physically plausible and premium.

---

# 7. Grass interaction

Any full-width green/grass section should use realistic short grass.

When the cursor moves over the grass:

* nearby grass blades gently bend,
* the effect should follow the cursor,
* movement should decay smoothly with distance,
* avoid cartoon-like waves.

The grass should feel like a subtle physical response.

---

# 8. Main-page tea learning cards

Create three large cards.

Each card should contain a cinematic moving background.

## Boba

Background:

Brown-sugar milk tea.

Show boba pearls slowly moving through partially stirred milk tea.

The camera should be macro and cinematic.

Motion should be extremely slow.

Overlay:

**BOBA TEE**

**Beginner / Casual**

Golf clubs and fundamentals.

---

## Matcha

Background:

Matcha powder being gently whisked.

Frame should focus primarily on the matcha powder.

The whisk should be visible but not dominate the frame.

Motion should be slow and calming.

Overlay:

**MATCHA TEE**

**Intermediate / Competitive**

Course management and decision making.

---

## Oolong

Background:

Oolong tea being poured from a porcelain Chinese teapot.

Frame should focus on the stream of tea leaving the porcelain spout.

Use warm amber/brown tea tones.

Overlay:

**OOLONG TEE**

**Advanced / Professional**

Swing mechanics and advanced concepts.

---

# 9. Player Signature

Create a section:

**Player's Signature**

Text:

**Sign up with your email**

Use a text input that initially displays the placeholder.

Allow any text/value to be entered.

When JOIN is clicked:

* accept the input,
* reset the input back to the original placeholder/state.

For this prototype, no backend/email service is necessary.

---

# 10. Boba Page — Golf Clubs

When the Boba page opens:

The background should visually fill from bottom to top, like a glass being filled with boba tea.

Behind the glass layer should be realistic boba milk tea.

Once the page has filled, keep the background filled while scrolling.

---

# 11. Boba — Golf Bag

Create a realistic golf bag positioned on the left.

Golf clubs should slide out from the bag sequentially.

The selected club should:

* be highlighted,
* visually emphasized,
* appear in the upper-right selected-club display.

Create a club-selection interface using a dial and scrolling.

Primary displayed club:

**7 Iron**

Display:

* loft
* shaft length
* club name

Use Titleist T200 specifications as the club-data reference.

Club relationships should be logically connected.

If loft changes to correspond to another club:

→ update club

If shaft length changes to correspond to another club:

→ update the corresponding club/loft.

Do not allow impossible combinations.

---

# 12. Boba — Try Your Club

Create a realistic golf simulator from a first-person perspective.

The user should see:

* golf ball
* hitting surface
* golf course/range environment
* target area

Assume all shots travel straight.

When HIT is pressed:

1. animate the golf ball flying forward,
2. display the distance hit,
3. subtract the distance hit from Distance Left.

Example:

**Distance Left: 400 yd**

If the selected club hits 160 yd:

**Distance Left: 240 yd**

Use the selected club's data to determine shot distance.

The animation should feel like a golf simulator rather than a flat UI animation.

---

# 13. Boba — Physics education

Add an educational section explaining how:

* club-face angle,
* shaft length,
* and swing mechanics

affect ball flight.

Use a clean black-and-white diagram/graph.

Keep the visual language consistent with the rest of the product.

---

# 14. MATCHA PAGE — Course Management

When Matcha opens:

Fill the background from bottom to top like a glass filling with liquid matcha.

Behind the frosted glass should be realistic liquid matcha.

After entering the page, keep the background filled while scrolling.

---

# 15. Matcha — Find the Smartest Shot

Create a realistic top-down golf hole.

Include:

* fairway
* rough
* green
* hazards
* trees/obstacles
* hole

Place a draggable circle representing the player's intended landing area.

Allow the user to drag the circle around the hole.

Primary button:

**HIT**

When HIT is pressed:

* calculate simulated strokes gained,
* display the result in the upper-right statistics panel.

Display:

**Strokes Gained**

Example:

**+0.92**

The ideal shot should be:

**+1.00**

The scoring model can be simplified for the prototype but should consider:

* distance to target,
* hazards,
* shot difficulty,
* landing position.

---

# 16. Matcha — New Hole

Button:

**New Hole**

Clicking New Hole randomizes a new golf hole.

At the bottom display three alternative randomized holes.

The user can click any of the three to load that hole.

Display the current result/state clearly.

---

# 17. Matcha — Physics section

Create an educational section explaining how expected shot outcome can be modeled using:

* hazard positioning,
* shot dispersion,
* probability,
* distance.

Include a clean black-and-white mathematical diagram.

The visual should feel educational and analytical rather than decorative.

---

# 18. OOLONG PAGE — Swing Mechanics

When Oolong opens:

Fill the page from bottom to top with liquid oolong tea.

Behind the glass should be realistic amber oolong tea.

Once filled, maintain the background while scrolling.

---

# 19. Oolong — Swing Plane Interaction

Create three panels:

**Take Away**
**Impact**
**Finish**

Each panel contains a golfer figure.

Create a globe-like 3D rotation control.

When the user rotates the global control:

* all three golfer panels rotate their perspective simultaneously.

When a limb is clicked:

* highlight the limb in RED,
* display its corresponding swing plane.

Then allow:

**RIGHT ARROW**
→ rotate the limb forward

**LEFT ARROW**
→ rotate the limb backward

Use clearly visible degree increments.

The user should be able to visually understand each adjustment.

---

# 20. Oolong — Correct plane state

When the selected limb reaches the correct position:

* lock the plane,
* change the plane from red to green,
* visually emphasize the correct position.

The three-plane state should be:

## No planes found

White status panel.

## Partial planes found

Red status panel.

Example:

**1 / 3 planes found**

## All planes found

Green status panel.

Example:

**3 / 3 planes found**

All status panels should use the same opaque frosted-glass treatment with different semantic colors.

---

# 21. Oolong — Educational content

Include a section explaining:

* one-plane swing
* two-plane swing
* swing-plane efficiency
* kinetic chain
* energy transfer

Use clean black-and-white diagrams.

Include professional-golf visual references where appropriate.

---

# 22. Footer / Community

Create:

**Join Our Community**

Include:

* community CTA
* Player's Signature
* short product description

Use the following creator statement:

“TEE UP was created by Sophia Joeng to help golfers of all levels connect with the online golf community. I want to help golfers understand complex concepts and terminology that can otherwise require coaching or extensive resources to learn.”

---

# 23. Motion principles

Motion should be:

* slow
* smooth
* physically inspired
* premium
* subtle

Avoid:

* bouncing UI
* excessive scaling
* cartoon animations
* generic fade-ins everywhere
* overly fast transitions.

The site should feel like interacting with physical materials: glass, water, grass, tea, metal, and golf equipment.

---

# 24. Accessibility

Maintain strong contrast.

Whenever text sits over grass or dark golf-course imagery:

**use white text.**

Do not place black text over dark grass.

Interactive elements should have clear hover/focus states.

Keyboard interaction should be supported where practical.

---

# 25. Responsive behavior

Desktop is the primary design.

Also create a mobile layout.

On mobile:

* convert horizontal cards into vertical cards,
* stack golf-bag and club controls,
* simplify 3D interactions,
* preserve the visual identity,
* maintain consistent glass styling.

---

# 26. Important design constraint

Do not make the interface look like a dashboard.

The website should feel like an immersive environment with UI layered into it.

Prioritize:

1. visual hierarchy
2. realism
3. material quality
4. interaction
5. readability
6. educational clarity

The result should feel like a premium golf technology product rather than a generic golf booking website.
