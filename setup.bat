@echo off
REM Mobile Store Setup Script for Windows

echo Starting Mobile Phone Store Setup...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 16 or higher.
    exit /b 1
)

echo All prerequisites are installed

REM Setup Backend
echo.
echo Setting up Backend...
cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Setup environment file
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo WARNING: Please edit backend\.env with your database credentials
)

REM Run migrations
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo.
echo Creating superuser account...
python manage.py createsuperuser

echo Backend setup complete!

REM Setup Frontend
echo.
echo Setting up Frontend...
cd ..\frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

echo Frontend setup complete!

REM Final instructions
echo.
echo Setup Complete!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Access the application:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000/api/
echo   Admin Panel: http://localhost:8000/admin/
echo   API Docs: http://localhost:8000/swagger/
echo.
echo Don't forget to edit backend\.env with your database credentials!

pause
