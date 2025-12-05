#!/bin/bash

# Mobile Store Setup Script
echo "🚀 Starting Mobile Phone Store Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are installed${NC}"

# Setup Backend
echo -e "\n${YELLOW}📦 Setting up Backend...${NC}"
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Setup environment file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your database credentials${NC}"
fi

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo -e "\n${YELLOW}Creating superuser account...${NC}"
python manage.py createsuperuser

echo -e "${GREEN}✅ Backend setup complete!${NC}"

# Setup Frontend
echo -e "\n${YELLOW}📦 Setting up Frontend...${NC}"
cd ../frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo -e "${GREEN}✅ Frontend setup complete!${NC}"

# Final instructions
echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo -e "\nTo start the application:"
echo -e "\n${YELLOW}Terminal 1 (Backend):${NC}"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo -e "\n${YELLOW}Terminal 2 (Frontend):${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo -e "\n${GREEN}Access the application:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000/api/"
echo "  Admin Panel: http://localhost:8000/admin/"
echo "  API Docs: http://localhost:8000/swagger/"
echo -e "\n${YELLOW}Don't forget to edit backend/.env with your database credentials!${NC}"
