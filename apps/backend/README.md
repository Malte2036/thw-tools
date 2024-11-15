# THW-Tools Backend

[![Tests](https://github.com/malte2036/thw-tools-backend/actions/workflows/test.yml/badge.svg)](https://github.com/malte2036/thw-tools-backend/actions/workflows/test.yml)

Backend service powering [THW-Tools](https://thw-tools.de) and THW-Inventar - unofficial tools for THW helpers.

## 🚀 Features

- RESTful API for THW-Tools applications
- Authentication & authorization
- Quiz data management
- Equipment inventory tracking
- Radio device management

## 🛠️ Tech Stack

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- TypeScript
- MongoDB
- Docker

## 💻 Development

### Prerequisites

- Node.js >= 18
- pnpm
- Docker (optional)

### Getting Started

1. Clone the repository

```bash
git clone https://github.com/malte2036/thw-tools-backend.git
cd thw-tools-backend
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start development server

```bash
pnpm run start:dev
```

### Scripts

```bash
# Development
pnpm run start        # Start server
pnpm run start:dev    # Start with hot-reload
pnpm run start:debug  # Start with debug mode

# Testing
pnpm run test         # Run unit tests
pnpm run test:e2e     # Run e2e tests
pnpm run test:cov     # Generate test coverage

# Build
pnpm run build        # Build for production
pnpm run start:prod   # Start production server
```

### Docker

```bash
# Build image
docker build -t thw-tools-backend .

# Run container
docker run -p 3000:3000 thw-tools-backend
```

## 📚 Documentation

API documentation is available at `/api/docs` when running the server.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Related Projects

- [THW-Tools Frontend](https://github.com/malte2036/thw-tools)
- [THW-Elektro Frontend](https://github.com/malte2036/thw-elektro)
- [THW-Finnentest Frontend](https://github.com/malte2036/thw-finnentest)
- [THW-Inventar Frontend](https://github.com/malte2036/thw-inventar)

## 📝 Disclaimer

This is a private project and has no direct affiliation with THW. The THW logo is used for decorative purposes only.

## 📫 Contact

For questions or suggestions, reach out via:

- [Hermine](https://app.thw-messenger.de/thw/app#/contacts/profile/1990855)
- [Email](mailto:webmaster@thw-tools.de)
