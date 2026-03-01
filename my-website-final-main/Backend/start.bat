@echo off
echo Starting Availo Backend...

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Check database
echo Checking database...
python manage.py check

REM Run migrations
echo Running migrations...
python manage.py makemigrations accounts products shops ads messages
python manage.py migrate

REM Create superuser
echo Creating superuser...
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(is_superuser=True).exists() or User.objects.create_superuser('admin@availo.co.tz', 'admin@availo.co.tz', 'admin123', username='admin@availo.co.tz')"

REM Start server
echo Starting development server...
echo Server will be available at: http://localhost:8000
echo API Docs: http://localhost:8000/api/docs/
python manage.py runserver 0.0.0.0:8000
pause