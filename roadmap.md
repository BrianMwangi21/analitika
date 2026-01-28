# Analitika Implementation Roadmap

## Overview
A futuristic football analytics dashboard with Iron Man/JARVIS aesthetics. Click to add match cards, view team analytics, odds, and predictions. Uses localStorage for persistence (refresh to reset).

---

## Phase 1: Setup & Configuration

### Step 1: Install Core Dependencies
- Run `npm install lucide-react recharts`
- Install icon and charting libraries
- [x] - COMPLETED

### Step 2: Setup Environment Variables
- Create `.env.local` file
- Add API_FOOTBALL_KEY=your_api_key
- [x] - COMPLETED

### Step 3: Create TypeScript Types
- Create `types/index.ts`
- Define Team, Match, Card, Analytics interfaces
- [x] - COMPLETED

---

## Phase 2: Design System

### Step 4: Update globals.css with JARVIS Theme
- Set dark background #0a0a0f
- Add CSS variables: --cyan, --blue, --dark, --glass
- [x] - COMPLETED

### Step 5: Add Glassmorphism Utilities
- Create .glass class with backdrop-blur
- Add .glow class for cyan border effect
- [x] - COMPLETED

### Step 6: Create Global Animations
- Add @keyframes shimmer for loading
- Add @keyframes slideUp for entrance
- [x] - COMPLETED

---

## Phase 3: Layout Foundation

### Step 7: Update Root Layout
- Change bg to #0a0a0f
- Set font to monospace
- Update metadata title to "analitika"
- [x] - COMPLETED

### Step 8: Create Header Component
- Create `components/Header.tsx`
- Display "analitika" title with cyan gradient
- Display "leo mhindi hashindi" subtitle
- [x] - COMPLETED

### Step 9: Update Page Layout
- Update `app/page.tsx`
- Create flex column container
- Add grid for cards (3 columns on desktop)
- [x] - COMPLETED

---

## Phase 4: Empty Card Component

### Step 10: Create EmptyCard Component
- Create `components/EmptyCard.tsx`
- Add glassmorphism card with dashed border
- Center plus icon from lucide-react
- [x] - COMPLETED

### Step 11: Add Hover and Click Effects
- Add scale and glow on hover
- Setup onClick handler to open modal
- [x] - COMPLETED

---

## Phase 5: Team Selection Modal

### Step 12: Create TeamSearchModal Component
- Create `components/TeamSearchModal.tsx`
- Add backdrop with blur
- Add centered glass modal
- [x] - COMPLETED

### Step 13: Add Search Input
- Create styled search field
- Add Search icon
- Setup state for search query
- [x] - COMPLETED

### Step 14: Add Team Search Results
- Display list of teams below input
- Show team logo and name
- Limit to 10 results
- [x] - COMPLETED

### Step 15: Handle Team Selection Flow
- First click selects home team
- Reset search and show "Select away team"
- Second click selects away team
- Prevent selecting same team twice
- [x] - COMPLETED

### Step 16: Add Continue Button
- Show after both teams selected
- Trigger API data fetch on click
- [x] - COMPLETED

---

## Phase 6: API Integration

### Step 17: Create API Client
- Create `lib/api.ts`
- Setup fetch wrapper with headers
- Add base URL and error handling
- [x] - COMPLETED

### Step 18: Create searchTeams Function
- Fetch teams by name
- Return team array with id, name, logo
- [x] - COMPLETED

### Step 19: Create getTeamStats Function
- Fetch team statistics for season
- Return goals, form, win rate
- [x] - COMPLETED

### Step 20: Create getHeadToHead Function
- Fetch last 5 matches between teams
- Return results and scores
- [x] - COMPLETED

---

## Phase 7: Analytics Card Component

### Step 21: Create AnalyticsCard Component
- Create `components/AnalyticsCard.tsx`
- Add glassmorphism container
- [x] - COMPLETED

### Step 22: Add Team Header Section
- Display home team vs away team
- Show team logos on sides
- Add "vs" divider with glow
- [x] - COMPLETED

### Step 23: Add Recent Form Section
- Display last 5 results (W/D/L badges)
- Show current league position
- [x] - COMPLETED

### Step 24: Add Head-to-Head Section
- Display previous meeting results
- Show win/draw breakdown
- [x] - COMPLETED

### Step 25: Add Odds Section
- Display bookmaker odds (1X2)
- Show odds in styled boxes
- [x] - COMPLETED

### Step 26: Add Delete Button
- Add X icon in top-right corner
- Show on hover
- Call onDelete callback
- [x] - COMPLETED

---

## Phase 8: State Management

### Step 27: Setup Cards State
- Create cards useState in page.tsx
- Initialize with one empty card
- [x] - COMPLETED

### Step 28: Create addCard Function
- Add new empty card to array
- [x] - COMPLETED

### Step 29: Create updateCard Function
- Update card with team data
- Fetch analytics from API
- Auto-add new empty card after
- [x] - COMPLETED

### Step 30: Create deleteCard Function
- Remove card from array
- Keep at least one empty card
- [x] - COMPLETED

### Step 31: Wire Modal to Page
- Show modal on empty card click
- Call updateCard on selection
- Close modal after
- [x] - COMPLETED

---

## Phase 9: LocalStorage Persistence

### Step 32: Add Load from LocalStorage
- useEffect on mount
- Load analitika-cards from localStorage
- Parse and set as initial state
- [x] - COMPLETED

### Step 33: Add Save to LocalStorage
- useEffect on cards change
- Save cards array to localStorage
- Exclude empty cards
- [x] - COMPLETED

---

## Phase 10: Loading & Error States

### Step 34: Create LoadingCard Component
- Show pulsing skeleton during fetch
- [x] - COMPLETED

### Step 35: Create ErrorCard Component
- Show error message
- Add retry button
- [x] - COMPLETED

### Step 36: Add Loading State to AnalyticsCard
- Show LoadingCard while data fetches
- [x] - COMPLETED

---

## Phase 11: Visual Polish

### Step 37: Add Card Entrance Animation
- Fade + slide up on mount
- Stagger multiple cards
- [x] - COMPLETED

### Step 38: Add Hover Effects
- Subtle scale and glow
- [x] - COMPLETED

### Step 39: Make Responsive
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop
- [x] - COMPLETED

### Step 40: Test Everything
- Test adding multiple cards
- Test delete functionality
- Test localStorage persistence
- Test on mobile
- [x] - COMPLETED

---

## Phase 12: Mobile UI Optimization

### Step 41: Condense Styles for Mobile
- Reduce padding and margins on mobile viewport
- Make card content more compact
- Optimize font sizes for smaller screens
- Ensure touch targets are appropriately sized
- [x] - COMPLETED

---

## Phase 13: Odds Selection Feature

### Step 42: Make Odds Clickable
- Add onClick handler to each odds box in AnalyticsCard
- Toggle selected state when clicked
- Apply highlight styling (cyan border/glow) when selected
- Allow multiple odds selection across markets
- [ ] - PENDING

### Step 43: Track Selected Odds State
- Add selectedOdds state to AnalyticsCard
- Store selected odds data (market, value, odds)
- Allow deselection by clicking again
- Display count of selected odds
- [ ] - PENDING

---

## Phase 14: Analyze Odds Button

### Step 44: Add Analyze Odds Button
- Create button below subtitle "click odds to analyze"
- Style with JARVIS theme (cyan gradient, glass effect)
- Show helper text/tooltip on hover
- Position prominently in card header area
- [ ] - PENDING

### Step 45: Implement Button Activation Logic
- Disable button when less than 2 odds selected
- Enable button when 2+ odds are selected
- Add visual indicator for active state
- Show count of selected odds on button
- [ ] - PENDING

---

## Phase 15: LLM Integration Setup

### Step 46: Install OpenRouter Provider
- Run `npm install @openrouter/ai-sdk-provider`
- Add to project dependencies
- [ ] - PENDING

### Step 47: Setup Environment Variables
- Add OPENROUTER_API_KEY to .env.local
- Update AGENTS.md with new env variable
- [ ] - PENDING

### Step 48: Create LLM Client
- Create `lib/llm.ts` with OpenRouter configuration
- Setup model: 'tngtech/tng-r1t-chimera:free'
- Create analyzeOdds function
- Handle API errors and rate limits
- [ ] - PENDING

---

## Phase 16: Analysis Page

### Step 49: Create Analysis Page Route
- Create `app/analysis/page.tsx`
- Setup page layout with JARVIS theme
- Add back button to return to dashboard
- [ ] - PENDING

### Step 50: Create Data Preparation Function
- Gather selected odds data from all cards
- Collect team stats, head-to-head history
- Format data for LLM prompt
- Include match context and current form
- [ ] - PENDING

### Step 51: Implement Analysis Flow
- On analyze button click, navigate to analysis page
- Pass selected odds data via state or query params
- Show loading state while fetching analysis
- [ ] - PENDING

---

## Phase 17: Analysis Results Display

### Step 52: Create AnalysisResult Component
- Display LLM analysis in structured format
- Show selected odds summary
- Highlight key insights and recommendations
- Add confidence indicators
- [ ] - PENDING

### Step 53: Format Analysis Output
- Parse LLM response into readable sections
- Add risk assessment display
- Show probability estimates if provided
- Style with JARVIS aesthetics
- [ ] - PENDING

### Step 54: Add Error Handling for LLM
- Handle API failures gracefully
- Show retry button
- Display fallback message if analysis fails
- Cache previous analyses
- [ ] - PENDING

---

## Phase 18: Testing & Polish

### Step 55: Test Odds Selection Flow
- Test selecting/deselecting odds
- Verify button activation logic
- Test on mobile touch devices
- [ ] - PENDING

### Step 56: Test LLM Integration
- Test with various data sets
- Verify API key configuration
- Test error scenarios
- [ ] - PENDING

### Step 57: Final Mobile Optimization
- Ensure analysis page is mobile-friendly
- Test navigation flow on mobile
- Optimize loading states for mobile
- [ ] - PENDING
