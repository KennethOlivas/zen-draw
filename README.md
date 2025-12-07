# Zen Draw

[Live Demo](https://zen-draw.kennetholivas.com/)

Zen Draw is a modern, infinite canvas drawing application built with the latest web technologies. Inspired by the simplicity of classic tools like MS Paint but engineered for the modern web, Zen Draw offers a robust set of features for digital artists and diagramming enthusiasts. It features a unique brush engine with opacity stacking and texture mapping, a comprehensive project management system, and a highly customizable interface.

## Features

- **Infinite Canvas**: A limitless drawing surface that supports smooth zooming and panning.
- **Advanced Brush Engine**:
  - **Opacity Stacking**: Simulates real stroke layering.
  - **Decay Effects**: Dynamic brush strokes that change over time/distance.
  - **Texture Mapping**: Support for various brush textures.
- **Smart Grid System**:
  - Toggleable "Snap to Grid" functionality.
  - Multiple grid modes including Mesh and Dot grids.
  - Customizable grid colors and sizes.
- **Project Management**:
  - Create, save, and organize multiple projects.
  - **Auto-Save & Deferred Save**: Never lose work; unauthenticated users can start drawing and save later upon signing up.
- **Access Control**:
  - Private and Public boards.
  - Secure board sharing and viewing permissions.
- **Modern UI/UX**:
  - **Dark/Light Mode**: Fully supported with optimized color palettes and shadows.
  - **Collapsible Panels**: Maximize workspace with retractable toolbars and property panels.
  - **Toast Notifications**: Real-time feedback for administrative actions.
- **Authentication**: Secure user sessions powered by Better Auth.

## Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Radix UI](https://www.radix-ui.com/) (Headless UI Components)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend & Data:**
- [PostgreSQL](https://www.postgresql.org/) (Database)
- [Prisma](https://www.prisma.io/) (ORM)
- [Better Auth](https://better-auth.com/) (Authentication)
- New Server Actions for seamless client-server communication.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (Latest LTS recommended)
- PostgreSQL database
- pnpm (Package manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/KennethOlivas/zen-draw.git
    cd zen-draw
    ```

2.  **Install dependencies:**

    This project uses `pnpm`.

    ```bash
    pnpm install
    ```

3.  **Environment Setup:**

    Create a `.env` file in the root directory. You can copy the `.env.example` if available, or add the following required variables:

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/zendraw?schema=public"

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET="your_generated_secret_here"
    BETTER_AUTH_URL="http://localhost:3000"
    ```

4.  **Database Migration:**

    Generate the Prisma client and push the schema to your database.

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the Development Server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! If you have suggestions or find bugs, please open an issue or submit a pull request.

## License

Copyright © Kenneth Olivas. All rights reserved.
