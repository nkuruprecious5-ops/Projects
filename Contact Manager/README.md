# Single-Page Contact Manager

A modern contact manager built with **PHP + MySQL + AJAX**.

You can add and delete contacts without page refresh.

## Features
- Add contacts (name, email, phone)
- Delete contacts instantly
- AJAX interactions (no full page reload)
- Dynamic contact list rendering
- Basic validation and API responses
- Diagnostic endpoint (`health.php`)

## Tech Stack
- PHP (backend API)
- MySQL (database)
- Vanilla JavaScript (AJAX)
- HTML/CSS (frontend)

## Project Structure
- `index.php` - single-page UI
- `app.js` - frontend logic and AJAX calls
- `styles.css` - UI styling
- `api.php` - API endpoints (`GET`, `POST add`, `POST delete`)
- `db.php` - database connection config
- `schema.sql` - SQL setup script
- `health.php` - quick environment/database health check

## Prerequisites
- PHP 8+
- MySQL server

## Database Setup
Import schema:

```bash
mysql -u root -p < schema.sql
```

Or manually run SQL in `schema.sql`.

## Configure Database
Edit credentials in `db.php`:
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`

## Run Locally
From this folder:

```bash
php -S localhost:8000
```

Open:
- `http://localhost:8000/index.php`

## Troubleshooting
- If adding/deleting fails, check:
  - `http://localhost:8000/health.php`
  - `http://localhost:8000/api.php`
- Ensure MySQL is running and `contact_manager.contacts` exists.

## Author
Nkurunziza Precious
