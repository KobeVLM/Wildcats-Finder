# 🐾 Wildcats-Finder

A comprehensive web application for discovering and learning about wildcat species around the world. Built with React frontend and Spring Boot backend.

## 🌟 Features

- **Species Discovery**: Browse and search through various wildcat species
- **Detailed Information**: Learn about habitats, characteristics, and conservation status
- **Interactive Interface**: User-friendly React-based frontend
- **RESTful API**: Robust Spring Boot backend with comprehensive endpoints
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

This is a full-stack application with a clear separation between frontend and backend:

```
Wildcats-Finder/
├── frontend/                 # React.js Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── backend/wildcats-finder/ # Spring Boot Backend
    ├── src/main/java/       # Java source code
    ├── src/main/resources/  # Configuration files
    └── pom.xml              # Backend dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Java** (JDK 11 or higher)
- **Maven** (v3.6 or higher)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KobeVLM/Wildcats-Finder.git
   cd Wildcats-Finder
   ```

2. **Setup Backend**

   ```bash
   cd backend/wildcats-finder
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## 🛠️ Technology Stack

### Frontend

- **React.js** - UI library for building user interfaces
- **CSS3** - Styling and responsive design
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend

- **Spring Boot** - Java framework for building REST APIs
- **Spring Web** - Web layer and RESTful services
- **Spring Data JPA** - Data persistence layer
- **Maven** - Build automation and dependency management

### Development Tools

- **Git** - Version control
- **npm/yarn** - Frontend package management
- **Maven** - Backend dependency management

## 📁 Project Structure

### Frontend (`/frontend`)

```
src/
├── components/          # Reusable React components
├── App.js              # Main application component
├── App.css             # Global styles
├── index.js            # React entry point
└── index.css           # Base CSS styles
```

### Backend (`/backend/wildcats-finder`)

```
src/main/
├── java/com/wildcatsfinder/wildcats_finder/
│   └── WildcatsFinderApplication.java    # Spring Boot main class
└── resources/
    ├── application.properties            # Configuration
    ├── static/                          # Static resources
    └── templates/                       # Templates (if using server-side rendering)
```

## 🔧 Development

### Running in Development Mode

1. **Backend Development**

   ```bash
   cd backend/wildcats-finder
   mvn spring-boot:run
   ```

   - Hot reload enabled with Spring Boot DevTools
   - API available at `http://localhost:8080`

2. **Frontend Development**
   ```bash
   cd frontend
   npm start
   ```
   - Hot reload enabled
   - Proxy configured to backend API
   - Available at `http://localhost:3000`

### Building for Production

1. **Build Frontend**

   ```bash
   cd frontend
   npm run build
   ```

2. **Build Backend**
   ```bash
   cd backend/wildcats-finder
   mvn clean package
   ```

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend/wildcats-finder
mvn test
```

## 📋 API Documentation

The backend provides RESTful APIs for wildcat data management:

- `GET /api/wildcats` - Get all wildcat species
- `GET /api/wildcats/{id}` - Get specific wildcat by ID
- `POST /api/wildcats` - Create new wildcat entry
- `PUT /api/wildcats/{id}` - Update existing wildcat
- `DELETE /api/wildcats/{id}` - Delete wildcat entry

_Detailed API documentation will be available once implemented._

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the coding standards outlined in `.copilot-instructions.md`
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure both frontend and backend tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **KobeVLM** - _Developer_ - [KobeVLM](https://github.com/KobeVLM)
- **Kaled244** - _Developer_ - [Kaled244](https://github.com/Kaled244)
- **Mores20** - _Developer_ - [Mores20](https://github.com/Mores20)

## 📞 Support

If you have any questions or need help getting started:

1. Check the [Issues](https://github.com/KobeVLM/Wildcats-Finder/issues) page
2. Create a new issue if your question isn't already answered
3. Follow the contributing guidelines for bug reports and feature requests

---

**Happy coding! 🐾**
