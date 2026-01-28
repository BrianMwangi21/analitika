# Analitika

A futuristic football analytics dashboard with Iron Man/JARVIS aesthetics. Built with Next.js, React, and Tailwind CSS.

## What is Analitika?

Analitika is a football betting analytics tool that helps users make informed decisions by:
- Selecting matches and viewing team statistics
- Checking head-to-head history and recent form
- Analyzing odds across multiple markets (1X2, Over/Under, BTTS)
- Getting AI-powered analysis with a Kenyan personality

The dashboard features a dark, futuristic UI inspired by JARVIS from Iron Man, with cyan glows, glassmorphism effects, and smooth animations.

## Features

🎯 **Match Selection**: Search and select matches from API-Football data
📊 **Team Analytics**: View team statistics, form, and league position
🔄 **Head-to-Head**: See historical results between teams
📈 **Odds Display**: View and select odds from multiple markets
🤖 **AI Analysis**: Get analysis from a Kenyan AI analyst using OpenRouter
💾 **Local Storage**: All data persists locally on your device
📱 **Mobile-First**: Fully responsive design optimized for all devices

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom JARVIS theme
- **UI Components**: [Lucide React](https://lucide.dev/) for icons
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **AI**: OpenRouter with tngtech/tng-r1t-chimera:free model
- **Markdown**: [React-Markdown](https://github.com/remarkjs/react-markdown) for analysis rendering
- **API**: API-Football for live match data

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BrianMwangi21/analitika.git
cd analitika
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```env
API_FOOTBALL_KEY=your_api_football_key
OPENROUTER_API_KEY=your_openrouter_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Add a Match**: Click the "+" button on an empty card
2. **Search**: Find matches by typing team names or leagues
3. **Select Match**: Choose your desired fixture
4. **View Analytics**: See team stats, form, and head-to-head data
5. **Select Odds**: Click on odds boxes to select markets (2+ required)
6. **Analyze**: Click "Analyze Odds" button
7. **Review**: Get AI analysis with confidence and risk levels

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_FOOTBALL_KEY` | API-Football API key for live match data | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI analysis | Yes |

Get your API keys from:
- [API-Football](https://www.api-football.com/)
- [OpenRouter](https://openrouter.ai/)

## Project Structure

```
analitika/
├── app/
│   ├── api/
│   │   └── analyze/       # Server-side AI analysis route
│   ├── analysis/          # Analysis results page
│   ├── page.tsx           # Main dashboard
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles with JARVIS theme
├── components/            # React components
│   ├── Header.tsx
│   ├── EmptyCard.tsx
│   ├── AnalyticsCard.tsx
│   ├── GameSelectorModal.tsx
│   ├── LoadingCard.tsx
│   └── ErrorCard.tsx
├── lib/                   # Utility functions
│   ├── llm.ts            # LLM client configuration
│   ├── api.ts            # API wrapper
│   └── footballApi.ts    # Football data API functions
├── types/
│   └── index.ts          # TypeScript type definitions
└── public/               # Static assets
```

## AI Analysis

The app features a unique Kenyan AI personality that analyzes betting odds:
- Mixes professional analytics with street wisdom (50/50 split)
- Uses phrases like "mazematic", "form yao", and "bure"
- Provides confidence levels and risk assessments
- Caches results for 1 hour to reduce API calls

## Theme

The UI is designed with a JARVIS (Iron Man) aesthetic:
- Dark background (#0a0a0f)
- Cyan accents (#00d4ff)
- Glassmorphism cards with blur effects
- Glowing borders and hover states
- Monospace typography for that tech feel

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by Iron Man's JARVIS interface
- Football data powered by API-Football
- AI analysis powered by OpenRouter
- Built with love by Kabiru

---

Made with ❤️ by Kabiru | [GitHub](https://github.com/BrianMwangi21/analitika)
