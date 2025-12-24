#!/bin/bash

# Mobile Store Management Script
# Provides easy commands for common tasks

set -e  # Exit on error

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if virtual environment is activated
check_venv() {
    if [[ -z "$VIRTUAL_ENV" ]]; then
        print_warning "Virtual environment not activated"
        if [[ -d "$PROJECT_DIR/.venv" ]]; then
            print_info "Activating virtual environment..."
            source "$PROJECT_DIR/.venv/bin/activate"
        else
            print_error "Virtual environment not found. Run 'make setup' first."
            exit 1
        fi
    fi
}

# Setup project
setup() {
    print_info "Setting up Mobile Store project..."
    
    # Create virtual environment
    if [[ ! -d "$PROJECT_DIR/.venv" ]]; then
        print_info "Creating virtual environment..."
        python3 -m venv "$PROJECT_DIR/.venv"
    fi
    
    source "$PROJECT_DIR/.venv/bin/activate"
    
    # Install backend dependencies
    print_info "Installing backend dependencies..."
    cd "$BACKEND_DIR"
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Install frontend dependencies
    print_info "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install
    
    # Create .env if it doesn't exist
    if [[ ! -f "$BACKEND_DIR/.env" ]]; then
        print_info "Creating .env file..."
        cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
        print_warning "Please update $BACKEND_DIR/.env with your configuration"
    fi
    
    # Create logs directory
    mkdir -p "$BACKEND_DIR/logs"
    
    print_success "Setup complete!"
}

# Run Django migrations
migrate() {
    print_info "Running database migrations..."
    cd "$BACKEND_DIR"
    check_venv
    python manage.py makemigrations
    python manage.py migrate
    print_success "Migrations complete!"
}

# Create superuser
createsuperuser() {
    print_info "Creating Django superuser..."
    cd "$BACKEND_DIR"
    check_venv
    python manage.py createsuperuser
}

# Run Django server
run_backend() {
    print_info "Starting Django backend server..."
    cd "$BACKEND_DIR"
    check_venv
    python manage.py runserver
}

# Run frontend dev server
run_frontend() {
    print_info "Starting React frontend server..."
    cd "$FRONTEND_DIR"
    npm run dev
}

# Build frontend for production
build_frontend() {
    print_info "Building frontend for production..."
    cd "$FRONTEND_DIR"
    npm run build
    print_success "Frontend build complete! Files are in $FRONTEND_DIR/dist"
}

# Collect static files
collectstatic() {
    print_info "Collecting static files..."
    cd "$BACKEND_DIR"
    check_venv
    python manage.py collectstatic --noinput
    print_success "Static files collected!"
}

# Run tests
test() {
    print_info "Running tests..."
    cd "$BACKEND_DIR"
    check_venv
    python manage.py test
    print_success "Tests complete!"
}

# Check code quality
check() {
    print_info "Running Django checks..."
    cd "$BACKEND_DIR"
    check_venv
    python manage.py check
    
    print_info "Running deployment checks..."
    python manage.py check --deploy
    
    print_success "Checks complete!"
}

# Clean up
clean() {
    print_info "Cleaning up..."
    
    # Remove Python cache
    find "$BACKEND_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find "$BACKEND_DIR" -type f -name "*.pyc" -delete 2>/dev/null || true
    
    # Remove frontend build
    rm -rf "$FRONTEND_DIR/dist" 2>/dev/null || true
    rm -rf "$FRONTEND_DIR/node_modules/.cache" 2>/dev/null || true
    
    print_success "Cleanup complete!"
}

# Generate secret key
generate_secret_key() {
    print_info "Generating new SECRET_KEY..."
    cd "$BACKEND_DIR"
    check_venv
    python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
}

# Show help
show_help() {
    cat << EOF
Mobile Store Management Script

Usage: ./manage.sh [command]

Commands:
    setup               - Initial project setup (install dependencies, create .env)
    migrate             - Run database migrations
    createsuperuser     - Create Django admin superuser
    run-backend         - Start Django development server
    run-frontend        - Start React development server
    build-frontend      - Build frontend for production
    collectstatic       - Collect Django static files
    test                - Run Django tests
    check               - Run Django system checks
    clean               - Clean up cache and build files
    generate-secret-key - Generate a new SECRET_KEY
    help                - Show this help message

Examples:
    ./manage.sh setup
    ./manage.sh migrate
    ./manage.sh run-backend
    ./manage.sh run-frontend

EOF
}

# Main script
case "$1" in
    setup)
        setup
        ;;
    migrate)
        migrate
        ;;
    createsuperuser)
        createsuperuser
        ;;
    run-backend)
        run_backend
        ;;
    run-frontend)
        run_frontend
        ;;
    build-frontend)
        build_frontend
        ;;
    collectstatic)
        collectstatic
        ;;
    test)
        test
        ;;
    check)
        check
        ;;
    clean)
        clean
        ;;
    generate-secret-key)
        generate_secret_key
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
