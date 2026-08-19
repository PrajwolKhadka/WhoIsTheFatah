# WhoIsTheFatah (Sojho or Fatah)

**Live Demo:** https://who-is-the-fatah.vercel.app

A real-time multiplayer social deduction game for **3–12 players**.

Most players, the **Sojho**, know the secret word. One player, the **Fatah**, only receives a hint and must blend in. Give clever clues, identify the faker, and vote them out.

> झुटो नबोल्नु ल!
> जोशमा बेहोस नहुनु है!

## How to Play

1. **Create or join a room** using a short room code.
2. **Receive your secret:**

   * **Sojho** → receives the actual secret word
   * **Fatah** → receives only a category or hint
3. **Give one clue** within 30 seconds that relates to the word without saying it directly.
4. **Read everyone's clues** and look for the suspicious one.
5. **Vote** for who you think is the Fatah within 45 seconds.
6. **Reveal the Fatah**, update the scores, and start the next round.

## Roles

| Role      | What you know   | Goal                                                 |
| --------- | --------------- | ---------------------------------------------------- |
| **Sojho** | The secret word | Give useful but not obvious clues and find the Fatah |
| **Fatah** | Only a hint     | Figure out the word from the clues and stay hidden   |

### Good Clue Example

**Word:** *Snow*

```text
Freezing
```

### Bad Clue Example

**Word:** *Snow*

```text
White stuff that falls from the sky
```

The goal is to give a clue that is useful to the Sojho players without making the answer too obvious for the Fatah.

## Tech Stack

### Client

* **Next.js 16** with App Router
* **React 19**
* **TypeScript**
* **Tailwind CSS 4**
* **Socket.IO Client**

### Server

* **Node.js**
* **Express**
* **Socket.IO**
* **TypeScript**
* Clean Architecture
* In-memory room store
* Static word list
* Real-time timers
* Player reconnection support

## Project Structure

```text
WhoIsTheFatah/
├── client/                         # Next.js frontend
│   ├── app/                        # App Router pages
│   │   ├── page.tsx                # Home: create / join room
│   │   ├── how-to-play/
│   │   └── room/[code]/
│   └── src/
│       ├── application/            # Hooks
│       ├── domain/
│       ├── infrastructure/
│       └── presentation/
│
├── server/                         # Game backend
│   └── src/
│       ├── application/            # Use cases + GameEngine
│       ├── domain/
│       ├── infrastructure/         # Rooms, words, scheduler, sockets
│       ├── interfaces/             # Socket handlers
│       └── main.ts
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm, yarn, pnpm, or bun

### 1. Clone the Repository

```bash
git clone https://github.com/PrajwolKhadka/WhoIsTheFatah.git
cd WhoIsTheFatah
```

### 2. Start the Server

```bash
cd server
npm install
npm run dev
```

The server runs on:

```text
http://localhost:4000
```

### 3. Start the Client

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Environment Variables

### Server

Create a `.env` file inside `server/` if needed:

```env
PORT=4000
CLIENT_URL=http://localhost:3000
```

### Client

If needed, create a `.env.local` file inside `client/`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## Available Scripts

### Server

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the development server with hot reload |
| `npm run build` | Compile TypeScript                           |
| `npm start`     | Run the production build                     |

### Client

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the Next.js development server |
| `npm run build` | Build the production application     |
| `npm start`     | Start the production server          |
| `npm run lint`  | Run ESLint                           |

## Game Features

* Real-time multiplayer rooms
* Short, shareable room codes
* Support for 3–12 players
* Automatic Fatah assignment
* Timed clue phase
* Timed voting phase
* Live chat
* Player reconnection support
* Host controls for starting and restarting games
* Automatic round progression
* Score tracking
* Mobile-friendly interface
* Nepali and English flavor text

## Architecture

The backend follows a **Clean Architecture** approach designed to keep game rules independent from infrastructure concerns.

```text
Domain
   ↓
Application
   ↓
Infrastructure
   ↓
Interfaces
```

### Domain

Contains the core game entities, value objects, types, and rules.

### Application

Contains the game's use cases and `GameEngine`, including operations such as:

* `CreateRoom`
* `SubmitClue`
* `SubmitVote`
* Room management
* Round management

### Infrastructure

Provides implementations for:

* In-memory room repositories
* Word repositories
* Socket.IO notifications
* Timeout scheduling

### Interfaces

Contains thin Socket.IO event handlers that connect network events to the application layer.

This separation keeps the game logic easier to **test, maintain, and extend**.

## Deployment

### Frontend

The frontend is deployed on Vercel.

**Live Demo:** https://who-is-the-fatah.vercel.app

### Backend

The `server` folder can be deployed to Node.js hosting platforms such as:

* Render
* Railway
* Fly.io
* Other Node.js-compatible hosting providers

After deploying the backend, configure:

```env
CLIENT_URL=https://who-is-the-fatah.vercel.app
```

Then configure the client to use the deployed backend:

```env
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url
```

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:

```bash
git commit -m "Add amazing feature"
```

4. Push the branch:

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request.

## Future Ideas

Some possible improvements include:

* More word packs and categories
* Persistent scoreboard and player statistics
* Custom room settings
* Configurable clue and voting timers
* Configurable number of Fatahs
* Voice chat
* Improved mobile experience
* More Nepali language and cultural content
* Custom word packs
* Spectator mode

## License

This project is licensed under the **ISC License**.

## Made With ❤️

Made with ❤️ by **Prajwol Khadka**

> Trust nobody.
> Find the Fatah.
