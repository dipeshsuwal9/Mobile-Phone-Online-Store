#!/bin/bash

# Project Validation Script
# Checks if the project is ready for deployment

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

check_pass() {
    echo -e "${GREEN}✅ PASS${NC} - $1"
    ((PASS_COUNT++))
}

check_fail() {
    echo -e "${RED}❌ FAIL${NC} - $1"
    ((FAIL_COUNT++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  WARN${NC} - $1"
    ((WARN_COUNT++))
}

# Check Python
check_python() {
    print_header "Python Environment"
    
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        check_pass "Python installed (version: $PYTHON_VERSION)"
    else
        check_fail "Python 3 not found"
        return 1
    fi
    
    if command -v pip3 &> /dev/null; then
        check_pass "pip3 installed"
    else
        check_fail "pip3 not found"
    fi
}

# Check Node.js
check_node() {
    print_header "Node.js Environment"
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        check_pass "Node.js installed (version: $NODE_VERSION)"
    else
        check_fail "Node.js not found"
        return 1
    fi
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        check_pass "npm installed (version: $NPM_VERSION)"
    else
        check_fail "npm not found"
    fi
}

# Check PostgreSQL
check_postgresql() {
    print_header "Database"
    
    if command -v psql &> /dev/null; then
        PSQL_VERSION=$(psql --version | cut -d' ' -f3)
        check_pass "PostgreSQL installed (version: $PSQL_VERSION)"
    else
        check_warn "PostgreSQL not found in PATH"
    fi
    
    if pg_isready -h localhost -p 5433 &> /dev/null; then
        check_pass "PostgreSQL is running on port 5433"
    else
        check_warn "PostgreSQL not running on port 5433 (or not accessible)"
    fi
}

# Check Backend
check_backend() {
    print_header "Backend Configuration"
    
    cd "$BACKEND_DIR"
    
    # Check .env file
    if [[ -f ".env" ]]; then
        check_pass ".env file exists"
        
        # Check for important variables
        if grep -q "SECRET_KEY=" .env && ! grep -q "django-insecure" .env; then
            check_pass "SECRET_KEY is set and appears secure"
        else
            check_warn "SECRET_KEY not set or using insecure default"
        fi
        
        if grep -q "DB_NAME=" .env; then
            check_pass "Database configuration present"
        else
            check_fail "Database configuration missing"
        fi
    else
        check_fail ".env file not found"
    fi
    
    # Check requirements.txt
    if [[ -f "requirements.txt" ]]; then
        check_pass "requirements.txt exists"
    else
        check_fail "requirements.txt not found"
    fi
    
    # Check logs directory
    if [[ -d "logs" ]]; then
        check_pass "logs directory exists"
    else
        check_warn "logs directory not found (will be created on first run)"
    fi
    
    # Try Django check
    if [[ -f "manage.py" ]]; then
        check_pass "manage.py exists"
        
        if source ../.venv/bin/activate 2>/dev/null || true; then
            if python manage.py check --quiet 2>/dev/null; then
                check_pass "Django system check passed"
            else
                check_warn "Django system check failed (may need migrations)"
            fi
        else
            check_warn "Virtual environment not activated, skipping Django checks"
        fi
    else
        check_fail "manage.py not found"
    fi
}

# Check Frontend
check_frontend() {
    print_header "Frontend Configuration"
    
    cd "$FRONTEND_DIR"
    
    # Check package.json
    if [[ -f "package.json" ]]; then
        check_pass "package.json exists"
    else
        check_fail "package.json not found"
    fi
    
    # Check node_modules
    if [[ -d "node_modules" ]]; then
        check_pass "node_modules directory exists"
    else
        check_warn "node_modules not found (run: npm install)"
    fi
    
    # Check TypeScript config
    if [[ -f "tsconfig.json" ]]; then
        check_pass "TypeScript configuration exists"
    else
        check_fail "tsconfig.json not found"
    fi
    
    # Check Vite config
    if [[ -f "vite.config.ts" ]]; then
        check_pass "Vite configuration exists"
    else
        check_fail "vite.config.ts not found"
    fi
    
    # Try build
    if [[ -d "node_modules" ]]; then
        if npm run build &> /dev/null; then
            check_pass "Frontend builds successfully"
        else
            check_fail "Frontend build failed"
        fi
    fi
}

# Check Security
check_security() {
    print_header "Security Configuration"
    
    cd "$BACKEND_DIR"
    
    if [[ -f ".env" ]]; then
        # Check DEBUG setting
        if grep -q "DEBUG=False" .env; then
            check_pass "DEBUG is set to False (production-ready)"
        else
            check_warn "DEBUG is not set to False (development mode)"
        fi
        
        # Check SECRET_KEY length
        SECRET_KEY=$(grep "SECRET_KEY=" .env | cut -d'=' -f2)
        if [[ ${#SECRET_KEY} -ge 50 ]]; then
            check_pass "SECRET_KEY length is adequate (${#SECRET_KEY} chars)"
        else
            check_warn "SECRET_KEY should be at least 50 characters"
        fi
        
        # Check ALLOWED_HOSTS
        if grep -q "ALLOWED_HOSTS=" .env && ! grep -q "ALLOWED_HOSTS=\*" .env; then
            check_pass "ALLOWED_HOSTS is configured"
        else
            check_warn "ALLOWED_HOSTS should be set to specific domains in production"
        fi
    fi
}

# Check Documentation
check_docs() {
    print_header "Documentation"
    
    cd "$PROJECT_DIR"
    
    if [[ -f "README.md" || -f "README_PRODUCTION.md" ]]; then
        check_pass "README documentation exists"
    else
        check_warn "README not found"
    fi
    
    if [[ -f "DEPLOYMENT_CHECKLIST.md" ]]; then
        check_pass "Deployment checklist exists"
    else
        check_warn "Deployment checklist not found"
    fi
    
    if [[ -f "manage.sh" ]]; then
        check_pass "Management script exists"
        if [[ -x "manage.sh" ]]; then
            check_pass "Management script is executable"
        else
            check_warn "Management script is not executable"
        fi
    else
        check_warn "Management script not found"
    fi
}

# Print Summary
print_summary() {
    print_header "Validation Summary"
    
    TOTAL=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))
    
    echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
    echo -e "${YELLOW}⚠️  Warnings: $WARN_COUNT${NC}"
    echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
    echo -e "\nTotal checks: $TOTAL"
    
    if [[ $FAIL_COUNT -eq 0 ]]; then
        echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}  ✅ Project is deployment-ready!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        if [[ $WARN_COUNT -gt 0 ]]; then
            echo -e "${YELLOW}Note: Review warnings before production deployment.${NC}\n"
        fi
        
        return 0
    else
        echo -e "\n${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}  ❌ Issues found - please fix before deploying${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        return 1
    fi
}

# Main execution
main() {
    clear
    echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                           ║${NC}"
    echo -e "${BLUE}║   Mobile Store - Project Validation      ║${NC}"
    echo -e "${BLUE}║                                           ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
    
    check_python
    check_node
    check_postgresql
    check_backend
    check_frontend
    check_security
    check_docs
    print_summary
    
    exit $?
}

main
