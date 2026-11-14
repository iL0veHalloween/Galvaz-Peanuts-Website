/* ============================================================
   script.js  -  everything that makes the page DO something
   ============================================================

   Loaded by index.html with:
       <script src="script.js" defer></script>

   "defer" means the HTML is fully built before this file runs,
   so every element we look for already exists.

   Sections in this file:
       1. Footer year
       2. Smooth scrolling for menu links
       3. Highlighting the menu link for the section you are viewing
       4. Mobile menu button (hamburger)
       5. Building the product cards from a data array
       6. Contact form validation
       7. Store locator (map + list)
       8. Scroll animations

   If something here does nothing, press F12 -> Console and look
   for a red error. A red error stops the rest of the file from running.
   ============================================================ */


/* ------------------------------------------------------------
   1. FOOTER YEAR

   The HTML has:   <span id="year"></span>
   which is empty, so the footer shows no date.
   We fill it with the current year, so it never goes out of date.
   ------------------------------------------------------------ */

const yearSpan = document.getElementById("year");

// The "if" prevents an error on pages that have no #year element.
if (yearSpan) {
    // new Date() = right now, .getFullYear() = 2026
    yearSpan.textContent = new Date().getFullYear();
}


/* ------------------------------------------------------------
   2. SMOOTH SCROLLING

   Clicking a link like href="#products" normally jumps straight
   down. This makes it glide instead.

   The selector below means:
       a[href^="#"]  = every <a> whose href STARTS WITH #
   ------------------------------------------------------------ */

// querySelectorAll = get ALL matching elements (a list), not just one.
for (const link of document.querySelectorAll('a[href^="#"]')) {

    link.addEventListener("click", (event) => {

        // The logo uses href="#". That is not a real section, so skip it.
        const targetId = link.getAttribute("href");
        if (targetId === "#") return;

        // Find the section that id points to, e.g. #products -> <section id="products">
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        // Stop the browser's instant jump...
        event.preventDefault();

        // ...and glide there instead.
        targetSection.scrollIntoView({ behavior: "smooth" });
    });
}


/* ------------------------------------------------------------
   3. HIGHLIGHT THE MENU LINK YOU ARE VIEWING

   As you scroll, whichever section is on screen gets its menu link
   marked with class="active", so CSS can underline/colour it.

   Your CSS needs a rule for it, for example:
       .nav-links a.active { color: #8a5a2b; }
   ------------------------------------------------------------ */

const pageSections = document.querySelectorAll("section[id]");
const menuLinks = document.querySelectorAll(".nav-links a");

function highlightCurrentSection() {

    // Which section are we inside? Start with "none".
    let currentId = "";

    // Go through the sections from top to bottom.
    for (const section of pageSections) {

        // scrollY = how far down the page we are.
        // 100px of leeway makes the change happen slightly early.
        if (window.scrollY >= section.offsetTop - 100) {
            currentId = section.id;
        }
    }

    // Mark only the matching link as active, unmark the rest.
    for (const link of menuLinks) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    }
}

// Run it while scrolling and once at the start.
window.addEventListener("scroll", highlightCurrentSection);
highlightCurrentSection();


/* ------------------------------------------------------------
   4. MOBILE MENU (HAMBURGER)

   Needs a button in the HTML, for example:
       <button class="menu-toggle">☰</button>

   Clicking it adds/removes class="open" on the .nav-links list,
   and CSS decides what "open" looks like (usually show the menu).

   Your CSS needs something like:
       @media (max-width: 700px) {
           .nav-links { display: none; }
           .nav-links.open { display: flex; }
       }
   ------------------------------------------------------------ */

const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

// Only set this up if BOTH exist, otherwise skip it quietly.
if (menuButton && navMenu) {

    menuButton.addEventListener("click", () => {
        // toggle = add the class if missing, remove it if present.
        navMenu.classList.toggle("open");
    });

    // Close the menu after tapping a link (nice on phones).
    for (const link of navMenu.querySelectorAll("a")) {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
        });
    }
}


/* ------------------------------------------------------------
   5. PRODUCT CARDS FROM A DATA ARRAY

   Instead of writing the same card HTML four times, we keep the
   products in a list and build the cards with a loop.

   This CLEARS .product-grid and rebuilds it, so the four cards
   currently typed in index.html are replaced by these.
   To add a flavour later, add one object here - no HTML editing.
   ------------------------------------------------------------ */

const products = [
    {
        name: "Flavor One",
        description: "Discover our first delicious flavor.",
        link: "flavor-one.html",
    },
    {
        name: "Flavor Two",
        description: "Discover our second delicious flavor.",
        link: "flavor-two.html",
    },
    {
        name: "Flavor Three",
        description: "Discover our third delicious flavor.",
        link: "flavor-three.html",
    },
    {
        name: "Flavor Four",
        description: "Discover our fourth delicious flavor.",
        link: "flavor-four.html",
    },
];

const productGrid = document.querySelector(".product-grid");

if (productGrid) {

    // Start from empty so the hard-coded cards do not appear twice.
    productGrid.innerHTML = "";

    for (let i = 0; i < products.length; i++) {

        const product = products[i];

        // Create the card container.
        const card = document.createElement("div");
        card.className = "product-card";

        // Fade it in when it scrolls into view, one card after another.
        card.classList.add("reveal");
        card.style.setProperty("--delay", i * 90 + "ms");

        // Create the peanut emoji block.
        const image = document.createElement("div");
        image.className = "product-image";
        image.textContent = "🥜";

        // Create the flavour name.
        const title = document.createElement("h3");
        title.textContent = product.name;

        // Create the description.
        const text = document.createElement("p");
        text.textContent = product.description;

        // Create the "Learn More" link, pointing at this product's own page.
        const link = document.createElement("a");
        link.className = "product-button";
        link.href = product.link;
        link.textContent = "Learn More";

        // Put the pieces inside the card...
        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(text);
        card.appendChild(link);

        // ...and put the card inside the grid.
        productGrid.appendChild(card);
    }
}


/* ------------------------------------------------------------
   6. CONTACT FORM VALIDATION

   Your page currently uses a "mailto:" link, which just opens the
   user's email app. If you replace it with a real <form>, this
   checks the fields before allowing it to "send".

   Needs HTML like:
       <form id="contact-form">
           <input id="name" type="text">
           <input id="email" type="email">
           <textarea id="message"></textarea>
           <p id="form-message"></p>
           <button type="submit">Send</button>
       </form>
   ------------------------------------------------------------ */

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

        // Stop the page from reloading when the form is submitted.
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const feedback = document.getElementById("form-message");

        // trim() removes spaces, so "   " counts as empty.
        if (name === "" || email === "" || message === "") {
            feedback.textContent = "Please fill in every field.";
            return;
        }

        // A very simple email check: something @ something . something
        if (!email.includes("@") || !email.includes(".")) {
            feedback.textContent = "Please enter a valid email address.";
            return;
        }

        // All good.
        feedback.textContent = "Thanks, " + name + "! Your message has been sent.";
        contactForm.reset();
    });
}


/* ------------------------------------------------------------
   7. STORE LOCATOR

   One array feeds BOTH the map pins and the list below it, so the
   two can never disagree. To add a store, add one line here.

   The lat/lon values were looked up from the street addresses.
   If a pin looks slightly off, adjust its numbers here.
   ------------------------------------------------------------ */

const stores = [
    { name: "Saavedra Enterprises", address: "1146 E 10th St, Los Angeles, CA 90021", lat: 34.032355, lon: -118.246118 },
    { name: "Eben-Ezer Dollar Plus", address: "2027 1st St, Los Angeles, CA 90033", lat: 34.045344, lon: -118.214599 },
    { name: "La Tiendita of East LA", address: "407 N Concord St, Los Angeles, CA 90063", lat: 34.041243, lon: -118.194693 },
    { name: "La Blanquita", address: "4136 E Cesar E Chavez Ave, Los Angeles, CA 90063", lat: 34.040490, lon: -118.177036 },
    { name: "Pereira's Mexican Products", address: "817 1/2 S Central Ave, Los Angeles, CA 90021", lat: 34.033322, lon: -118.243315 },
    { name: "El Furete Market", address: "2901 1st St, Los Angeles, CA 90033", lat: 34.040998, lon: -118.203507 },
    { name: "Olveras 99 Cent Plus", address: "2QVQ+HW, Los Angeles, CA 90033", lat: 34.043878, lon: -118.210247 },
    { name: "El Paisa Market", address: "3901 E Cesar E Chavez Ave, Los Angeles, CA 90063", lat: 34.040592, lon: -118.182189 },
    { name: "Salt Lake Market", address: "3700 Live Oak St, Cudahy, CA 90201", lat: 33.969315, lon: -118.201003 },
    { address: "850 S Central Ave, Los Angeles, CA 90021", lat: 34.032788, lon: -118.243657 },
    { name: "XO Liquor Store", address: "3563 E Cesar E Chavez Ave, Los Angeles, CA 90063", lat: 34.040575, lon: -118.187699 },
    { name: "Corona Market", address: "1913 1st St, Los Angeles, CA 90033", lat: 34.046473, lon: -118.217127 },
    { name: "Jiffy Market & Liquor", address: "4057 Slauson Ave, Maywood, CA 90270", lat: 33.987988, lon: -118.193162 },
    { name: "La Mano Tortilleria", address: "4027 Slauson Ave, Maywood, CA 90270", lat: 33.988052, lon: -118.193783 },
    { name: "Maywood Plaza Meat Market", address: "3516 Slauson Ave, Maywood, CA 90270", lat: 33.988801, lon: -118.202319 },
];


/* Build the address list. Each row gets a "Directions" link that
   opens Google Maps with that address already searched. */

const storeList = document.getElementById("store-list");

if (storeList) {

    for (let i = 0; i < stores.length; i++) {

        const store = stores[i];

        const item = document.createElement("li");

        // Rows fade in one after another as the list is reached.
        item.classList.add("reveal");
        item.style.setProperty("--delay", i * 40 + "ms");

        const address = document.createElement("span");
        address.className = "store-address";

        // If we know the shop's name, show it in bold, then the address.
        if (store.name) {
            const name = document.createElement("strong");
            name.textContent = store.name;
            address.appendChild(name);
            address.appendChild(document.createTextNode(" — " + store.address));
        } else {
            address.textContent = store.address;
        }

        if (store.approximate) {
            address.textContent += " (approximate)";
        }

        const directions = document.createElement("a");
        directions.className = "store-directions";
        // Searching "Name, address" makes Google open that shop's listing.
        // With no name it can only show the address pin.
        const query = store.name ? store.name + ", " + store.address : store.address;
        // encodeURIComponent turns spaces and commas into %20 / %2C so the URL is valid.
        directions.href = "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(query);
        directions.target = "_blank";
        directions.rel = "noopener noreferrer";
        directions.textContent = "Directions";

        item.appendChild(address);
        item.appendChild(directions);
        storeList.appendChild(item);
    }
}


/* Draw the map. Leaflet is loaded from the CDN in index.html.
   The "typeof L" check means: if the library failed to load
   (offline, blocked), skip the map instead of throwing an error. */

const mapElement = document.getElementById("map");

if (mapElement && typeof L !== "undefined") {

    const map = L.map("map", {
        scrollWheelZoom: false, // stops the map stealing your page scroll
    }).setView([34.02, -118.21], 12);

    /* Esri World Street Map tiles: no API key, no Referer requirement,
       so they work even when the page is opened straight from disk.
       Attribution is required - do not remove it. */
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
    }).addTo(map);

    // Start an empty box, then stretch it to cover every store.
    const bounds = L.latLngBounds([]);

    for (const store of stores) {

        const label = store.name ? store.name + " — " + store.address : store.address;
        const popupText = label + (store.approximate ? " (approximate location)" : "");

        L.marker([store.lat, store.lon])
            .addTo(map)
            .bindPopup(popupText);

        bounds.extend([store.lat, store.lon]);
    }

    // Zoom so all pins fit on screen at once.
    map.fitBounds(bounds, { padding: [30, 30] });
}


/* ------------------------------------------------------------
   8. SCROLL ANIMATIONS

   Elements with class="reveal" start invisible (style.css).
   Here we watch each one and add .is-visible the first time it
   scrolls into view, which plays the fade-up animation.

   This must run AFTER the cards and store rows are built above,
   so it is the last section in the file.
   ------------------------------------------------------------ */

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    /* IntersectionObserver is a browser feature that reports when
       an element enters the visible part of the page, so we do not
       have to listen to scrolling ourselves. */
    const observer = new IntersectionObserver((entries) => {

        for (const entry of entries) {

            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Stop watching it: the animation only plays once.
                observer.unobserve(entry.target);
            }
        }

    }, { threshold: 0.15 });   // 15% of the element on screen = trigger

    for (const item of revealItems) {
        observer.observe(item);
    }

} else {

    // Very old browser: no animation, just show everything.
    for (const item of revealItems) {
        item.classList.add("is-visible");
    }
}
