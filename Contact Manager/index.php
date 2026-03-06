<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Single-Page Contact Manager</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="app">
    <header class="header">
      <h1>Contact Manager</h1>
      <p>Add and remove contacts without refreshing the page.</p>
    </header>

    <section class="card">
      <h2>Add Contact</h2>
      <form id="contactForm" autocomplete="off">
        <div class="field-grid">
          <label>
            Name
            <input type="text" id="name" required maxlength="80" />
          </label>
          <label>
            Email
            <input type="email" id="email" required maxlength="120" />
          </label>
          <label>
            Phone
            <input type="text" id="phone" required maxlength="30" />
          </label>
        </div>
        <button type="submit" class="btn">Add Contact</button>
      </form>
      <p id="message" class="message" aria-live="polite"></p>
    </section>

    <section class="card">
      <div class="list-head">
        <h2>Saved Contacts</h2>
        <span id="count" class="count">0</span>
      </div>
      <div id="list" class="list"></div>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>
