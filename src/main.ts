/* =========================
   MODELS
========================= */

class EventClass {
  title: string;
  location: string;
  description: string;
  category: string;
  date: string;
  capacity: string;
  total_registered: number;

  constructor(
    title: string,
    location: string,
    description: string,
    category: string,
    date: string,
    capacity: string,
    total_registered = 0
  ) {
    this.title = title;
    this.location = location;
    this.description = description;
    this.category = category;
    this.date = date;
    this.capacity = capacity;
    this.total_registered = total_registered;
  }
}

class UserClass {
  username: string;
  email: string;
  events_registered: number[];

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
    this.events_registered = [];
  }
}

class AdminClass {
  admin_name: string;
  password: string;
  email: string;

  constructor(admin_name: string, password: string, email: string) {
    this.admin_name = admin_name;
    this.password = password;
    this.email = email;
  }
}

/* =========================
   STATE
========================= */

let event_array: EventClass[] = [];
let users_array: UserClass[] = [];
let admin_array: AdminClass[] = [];

/* =========================
   STORAGE
========================= */

function loadData(): void {
  event_array = JSON.parse(localStorage.getItem("events") || "[]").map(
    (e: any) =>
      new EventClass(
        e.title,
        e.location,
        e.description,
        e.category,
        e.date,
        e.capacity,
        e.total_registered
      )
  );

  users_array = JSON.parse(localStorage.getItem("users") || "[]");
  admin_array = JSON.parse(localStorage.getItem("admins") || "[]");
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(event_array));
}

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users_array));
}

function saveAdmins() {
  localStorage.setItem("admins", JSON.stringify(admin_array));
}

/* =========================
   HELPERS
========================= */

function createSubCard(label: string, value: string) {
  const sub = document.createElement("div");
  sub.className = "subcard";

  const l = document.createElement("h4");
  l.innerHTML = `<b>${label}</b>`;

  const v = document.createElement("h4");
  v.textContent = value;

  sub.append(l, v);
  return sub;
}

/* =========================
   RENDER EVENTS
========================= */

function RenderEvents() {
  const holder = document.getElementById("evholder");
  if (!holder) return;

  holder.innerHTML = "";

  event_array.forEach((evt, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const head = document.createElement("div");
    head.className = "headcard";

    const title = document.createElement("h2");
    title.textContent = evt.title;

    const date = document.createElement("h3");
    date.textContent = evt.date;

    head.append(title, date);

    const body = document.createElement("div");
    body.className = "bodycard";

    body.append(
      createSubCard("Description:", evt.description),
      createSubCard("Location:", evt.location),
      createSubCard("Category:", evt.category),
      createSubCard("Capacity:", evt.capacity),
      createSubCard("Event ID:", (index + 1).toString())
    );

    const btn = document.createElement("button");
    btn.className = "register_button";
    btn.textContent = "Register For Event";
    btn.onclick = () => {
      const input = document.getElementById("event_idz") as HTMLInputElement;
      if (input) input.value = (index + 1).toString();
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };

    body.appendChild(btn);
    card.append(head, body);
    holder.appendChild(card);
  });
}

/* =========================
   CREATE EVENT
========================= */

function CreateEvent() {
  const title = (document.getElementById("evtitle") as HTMLInputElement).value;
  const desc = (document.getElementById("evdesc") as HTMLInputElement).value;
  const loc = (document.getElementById("evloc") as HTMLInputElement).value;
  const cat = (document.getElementById("evcat") as HTMLInputElement).value;
  const date = (document.getElementById("evdate") as HTMLInputElement).value;
  const cap = (document.getElementById("evcap") as HTMLInputElement).value;

  const adminName = (document.getElementById("admin_name") as HTMLInputElement).value;
  const adminPass = (document.getElementById("admin_password") as HTMLInputElement).value;

  const admin = admin_array.find(a => a.admin_name === adminName);

  if (!admin) return alert("Invalid admin");
  if (admin.password !== adminPass) return alert("Wrong password");

  event_array.push(new EventClass(title, loc, desc, cat, date, cap));
  saveEvents();
  RenderEvents();
  alert("Event Created");
}

/* =========================
   REGISTER USER
========================= */

function RegisterForEvent() {
  const name = (document.getElementById("user_name") as HTMLInputElement).value;
  const email = (document.getElementById("user_email") as HTMLInputElement).value;
  const eventId = Number(
    (document.getElementById("event_idz") as HTMLInputElement).value
  );

  if (!event_array[eventId - 1]) return alert("Invalid Event ID");

  let user = users_array.find(u => u.email === email);
  if (!user) {
    user = new UserClass(name, email);
    users_array.push(user);
  }

  if (user.events_registered.includes(eventId))
    return alert("Already registered");

  const evt = event_array[eventId - 1];
  if (evt.total_registered >= Number(evt.capacity))
    return alert("Event is full");

  user.events_registered.push(eventId);
  evt.total_registered++;

  saveUsers();
  saveEvents();
  alert("Registered Successfully");
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  if (document.body.id === "evt_body") {
    RenderEvents();
  }

  document
    .getElementById("create_event_form")
    ?.addEventListener("submit", e => {
      e.preventDefault();
      CreateEvent();
    });

  document
    .getElementById("event_registration_form")
    ?.addEventListener("submit", e => {
      e.preventDefault();
      RegisterForEvent();
    });
});

window.addEventListener("beforeunload", () => {
  saveEvents();
  saveUsers();
});