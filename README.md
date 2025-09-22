# THW Tools Monorepo

This monorepo contains the source code for [thw-tools.de](https://thw-tools.de/), a collection of unofficial tools and applications for the German Federal Agency for Technical Relief (THW). The project is built by THW volunteers for THW volunteers.

<img src="./assets/screenshot_1.png" alt="THW Tools Screenshot" style="max-height: 400px;">

## Applications

This monorepo hosts the following applications:

| Application | Description | URL |
| --- | --- | --- |
| **THW Tools** | The main application with various tools and quizzes for THW members. | [thw-tools.de](https://thw-tools.de/) |
| **Inventar** | An inventory management system for THW local sections. | [mein.thw-duesseldorf.de](https://mein.thw-duesseldorf.de/) |

## Related Projects

The following applications are part of the THW Tools ecosystem but are hosted in separate repositories:

| Application | URL | Repository |
| --- | --- | --- |
| **Elektro-Rechner** | [elektro.thw-tools.de](https://elektro.thw-tools.de/) | [github.com/Malte2036/thw-elektro](https://github.com/Malte2036/thw-elektro) |
| **Finnentest-Tracker** | [finnentest.thw-tools.de](https://finnentest.thw-tools.de/) | [github.com/Malte2036/thw-finnentest](https://github.com/Malte2036/thw-finnentest/) |

## Using the Inventory Management App

If you are interested in using the inventory management app for your own THW local section (Ortsverband), please contact me to get it set up.

**Contact:** Malte via [Hermine Messenger](https://app.thw-messenger.de/thw/app#/contacts/profile/1990855).

## Monorepo Structure

The monorepo is organized as follows:

```
/
├── apps/
│   ├── backend/         # NestJS backend API
│   ├── inventar/        # SvelteKit frontend for Inventar
│   └── thw-tools/       # SvelteKit frontend for THW Tools
├── packages/
│   ├── shared/          # Shared utilities and types
│   └── web-components/  # Shared web components
```

## Tech Stack

The project is built with the following technologies:

- **Frontend:** SvelteKit, Next.js, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, PostgreSQL, Prisma
- **Monorepo Management:** pnpm, Turborepo

## Getting Started

To get started with the development, you need to have [Node.js](https://nodejs.org/) (v18 or later) and [pnpm](https://pnpm.io/) installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Malte2036/thw-tools.git
    cd thw-tools
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Each application has its own `.env.example` file. Copy it to `.env` and fill in the required values.

4.  **Start the development servers:**

    ```bash
    pnpm dev
    ```

    This will start all applications in development mode. You can also start individual applications:

    ```bash
    pnpm --filter thw-tools dev
    pnpm --filter inventar dev
    pnpm --filter backend dev
    ```

## Contributing

Contributions are welcome! If you want to contribute to the project, please feel free to open an issue or submit a pull request.

## Disclaimer

This is a private project and has no official connection to the German Federal Agency for Technical Relief (THW). The THW logo is used for decorative purposes only.
