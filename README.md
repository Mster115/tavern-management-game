# Tavern Management Game

A medieval tavern management simulator where you play as a bartender serving a variety of patrons. Pour the perfect pint, manage the queue, and keep your customers happy to earn tips and survive the night!

## How to Play

### Object of the Game
Your goal is to serve patrons before they lose patience and leave. The quality of your service determines your tips.

### Controls
- **Spacebar (Hold & Release)**: Hold the **Spacebar** to fill the beer mug. Release the key to stop pouring.
  - **Perfect Pour**: Try to release the spacebar when the liquid reaches the target line for maximum tips.
  - **Underfill**: Patrons might not be satisfied.
  - **Overfill**: Spilling beer is wasteful and messy!

### Mechanics
- **Queue/Patience**: Patrons will line up at the bar. Each patron has a patience meter that decays over time. If it runs out, they will leave angry.
- **Patron Types**: Different patrons (Peasants, Nobles, Wizards) may have different patience levels and tipping habits.
- **Nights/Shifts**: Survive the shift to progress to the next night. Difficulty may increase as you progress.
- **Economy**: Earn gold from base prices and tips.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd tavern-management-game
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Technologies Used
- **React 19**
- **Vite**
- **TypeScript**
- **TailwindCSS 4**
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
