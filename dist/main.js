"use strict";
/* =========================
   MODELS
========================= */
class EventClass {
    constructor(title, location, description, category, date, capacity, total_registered = 0) {
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
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.events_registered = [];
    }
}
class AdminClass {
    constructor(admin_name, password, email) {
        this.admin_name = admin_name;
        this.password = password;
        this.email = email;
    }
}
/* =========================
   STATE
========================= */
let event_array = [];
let users_array = [];
let admin_array = [];
/* =========================
   STORAGE
========================= */
function loadData() {
    event_array = JSON.parse(localStorage.getItem("events") || "[]").map((e) => new EventClass(e.title, e.location, e.description, e.category, e.date, e.capacity, e.total_registered));
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
function createSubCard(label, value) {
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
    if (!holder)
        return;
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
        body.append(createSubCard("Description:", evt.description), createSubCard("Location:", evt.location), createSubCard("Category:", evt.category), createSubCard("Capacity:", evt.capacity), createSubCard("Event ID:", (index + 1).toString()));
        const btn = document.createElement("button");
        btn.className = "register_button";
        btn.textContent = "Register For Event";
        btn.onclick = () => {
            const input = document.getElementById("event_idz");
            if (input)
                input.value = (index + 1).toString();
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
    const title = document.getElementById("evtitle").value;
    const desc = document.getElementById("evdesc").value;
    const loc = document.getElementById("evloc").value;
    const cat = document.getElementById("evcat").value;
    const date = document.getElementById("evdate").value;
    const cap = document.getElementById("evcap").value;
    const adminName = document.getElementById("admin_name").value;
    const adminPass = document.getElementById("admin_password").value;
    const admin = admin_array.find(a => a.admin_name === adminName);
    if (!admin)
        return alert("Invalid admin");
    if (admin.password !== adminPass)
        return alert("Wrong password");
    event_array.push(new EventClass(title, loc, desc, cat, date, cap));
    saveEvents();
    RenderEvents();
    alert("Event Created");
}
/* =========================
   REGISTER USER
========================= */
function RegisterForEvent() {
    const name = document.getElementById("user_name").value;
    const email = document.getElementById("user_email").value;
    const eventId = Number(document.getElementById("event_idz").value);
    if (!event_array[eventId - 1])
        return alert("Invalid Event ID");
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
    var _a, _b;
    loadData();
    if (document.body.id === "evt_body") {
        RenderEvents();
    }
    (_a = document
        .getElementById("create_event_form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", e => {
        e.preventDefault();
        CreateEvent();
    });
    (_b = document
        .getElementById("event_registration_form")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", e => {
        e.preventDefault();
        RegisterForEvent();
    });
});
window.addEventListener("beforeunload", () => {
    saveEvents();
    saveUsers();
});
