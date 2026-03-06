const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const message = document.getElementById("message");
const list = document.getElementById("list");
const count = document.getElementById("count");

init();

function init() {
  form.addEventListener("submit", onSubmit);
  loadContacts();
}

async function onSubmit(event) {
  event.preventDefault();

  const payload = {
    action: "add",
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
  };

  if (!payload.name || !payload.email || !payload.phone) {
    setMessage("All fields are required.", true);
    return;
  }

  try {
    const res = await request("api.php", payload);

    if (!res.ok) {
      setMessage(res.message || "Failed to add contact.", true);
      return;
    }

    form.reset();
    setMessage("Contact added.");
    await loadContacts();
  } catch (error) {
    setMessage(error.message || "Could not reach server.", true);
  }
}

async function loadContacts() {
  try {
    const res = await fetch("api.php", { method: "GET" });
    const data = await parseJson(res);

    if (!data.ok) {
      setMessage(data.message || "Could not load contacts.", true);
      return;
    }

    render(data.contacts || []);
  } catch (error) {
    setMessage(error.message || "Could not load contacts.", true);
    render([]);
  }
}

function render(contacts) {
  count.textContent = String(contacts.length);

  if (!contacts.length) {
    list.innerHTML = '<div class="empty">No contacts yet. Add your first contact above.</div>';
    return;
  }

  list.innerHTML = contacts
    .map(
      (c) => `
        <article class="contact-item">
          <div class="contact-meta">
            <h3>${escapeHtml(c.name)}</h3>
            <p>${escapeHtml(c.email)}</p>
            <p>${escapeHtml(c.phone)}</p>
          </div>
          <button class="delete-btn" data-id="${c.id}">Delete</button>
        </article>
      `
    )
    .join("");

  list.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => onDelete(btn.dataset.id));
  });
}

async function onDelete(id) {
  try {
    const res = await request("api.php", { action: "delete", id: Number(id) });

    if (!res.ok) {
      setMessage(res.message || "Failed to delete contact.", true);
      return;
    }

    setMessage("Contact deleted.");
    await loadContacts();
  } catch (error) {
    setMessage(error.message || "Could not reach server.", true);
  }
}

async function request(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJson(res);
}

async function parseJson(res) {
  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server returned invalid response. Make sure PHP server is running.");
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}.`);
  }

  return data;
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "message error" : "message success";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
