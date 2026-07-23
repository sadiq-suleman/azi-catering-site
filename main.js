/* =========================================================================
   Azi Catering — site interactions
   Vanilla JS, no dependencies. Everything is progressive: if JS fails,
   content and the form still render.
   ========================================================================= */
(function () {
  "use strict";

  /* =======================================================================
     INQUIRY FORM ENDPOINT  ←  set this one value to go live
     -----------------------------------------------------------------------
     Paste the URL of your form connector here (Formspree, Power Automate,
     Zapier/Make webhook, etc.). While it's blank, the form shows a demo
     success screen and sends nothing. See FORM-SETUP.md for the full guide
     on getting submissions into inquiries.xlsx (Excel).
     ======================================================================= */
  var INQUIRY_ENDPOINT = "https://formspree.io/f/xjgnygyj"; // Formspree — receives inquiries

  /* --- Sticky header shadow on scroll --- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile nav toggle --- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu when a link is tapped
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navLinks.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Scroll reveal --- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* =======================================================================
     Lightbox gallery
     ======================================================================= */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector(".lightbox__caption");
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
    var current = 0;

    function show(i) {
      current = (i + items.length) % items.length;
      var trigger = items[current];
      var full = trigger.getAttribute("data-full") || trigger.querySelector("img").src;
      var cap = trigger.querySelector("img").getAttribute("alt") || "";
      lbImg.src = full;
      lbImg.alt = cap;
      lbCaption.textContent = cap;
    }
    function open(i) {
      show(i);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox__close").focus();
    }
    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (items[current]) items[current].focus();
    }

    items.forEach(function (item, i) {
      item.addEventListener("click", function () { open(i); });
    });
    lightbox.querySelector(".lightbox__close").addEventListener("click", close);
    lightbox.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });
    lightbox.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }

  /* =======================================================================
     Multi-step inquiry form
     ======================================================================= */
  var form = document.getElementById("inquiry-form");
  if (form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll(".form-step"));
    var progress = Array.prototype.slice.call(document.querySelectorAll(".progress__step"));
    var stepIndex = 0;

    function setStep(i) {
      stepIndex = i;
      steps.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
      progress.forEach(function (p, idx) {
        p.classList.toggle("is-active", idx === i);
        p.classList.toggle("is-done", idx < i);
      });
      // Move focus to the step heading for screen readers
      var heading = steps[i].querySelector("h2, h3, legend");
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus(); }
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Validate only the fields inside the current step
    function validateStep(i) {
      var valid = true;
      var fields = steps[i].querySelectorAll("input[required], select[required]");
      fields.forEach(function (field) {
        var wrap = field.closest(".field");
        var ok = field.checkValidity();
        if (wrap) wrap.classList.toggle("has-error", !ok);
        if (!ok && valid) { field.focus(); valid = false; }
      });
      return valid;
    }

    form.addEventListener("click", function (e) {
      var next = e.target.closest("[data-next]");
      var back = e.target.closest("[data-back]");
      if (next) {
        e.preventDefault();
        if (validateStep(stepIndex)) {
          if (stepIndex === steps.length - 2) buildSummary();
          setStep(Math.min(stepIndex + 1, steps.length - 1));
        }
      }
      if (back) {
        e.preventDefault();
        setStep(Math.max(stepIndex - 1, 0));
      }
    });

    // Clear error styling as the user corrects a field
    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field.has-error");
      if (wrap && e.target.checkValidity()) wrap.classList.remove("has-error");
    });

    // Build a quick review summary before submit
    function buildSummary() {
      var summary = form.querySelector("#review-summary");
      if (!summary) return;
      var get = function (name) {
        var el = form.elements[name];
        if (!el) return "—";
        if (el.length && el[0] && el[0].type === "checkbox") {
          var picked = [];
          Array.prototype.forEach.call(el, function (c) { if (c.checked) picked.push(c.value); });
          return picked.join(", ") || "—";
        }
        return el.value || "—";
      };
      summary.innerHTML =
        "<dl>" +
        "<dt>Event date</dt><dd>" + esc(get("event_date")) + "</dd>" +
        "<dt>Event type</dt><dd>" + esc(get("event_type")) + "</dd>" +
        "<dt>Guests</dt><dd>" + esc(get("guest_count")) + "</dd>" +
        "<dt>Cuisine</dt><dd>" + esc(get("cuisine")) + "</dd>" +
        "<dt>Dietary</dt><dd>" + esc(get("dietary")) + "</dd>" +
        "</dl>";
    }
    function esc(str) {
      return String(str).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep(stepIndex)) return;

      var submitBtn = form.querySelector("[type=submit]");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      // Build a payload whose keys line up 1:1 with the columns in
      // inquiries.xlsx, so a connector can map fields without guesswork.
      var fd = new FormData(form);
      var dietary = fd.getAll("dietary").join(", ");
      var payload = {
        Submitted: new Date().toISOString().slice(0, 16).replace("T", " "),
        "Event Date": fd.get("event_date") || "",
        "Event Type": fd.get("event_type") || "",
        "Guest Count": fd.get("guest_count") || "",
        "Cuisine Style": fd.get("cuisine") || "",
        "Dietary Needs": dietary,
        Notes: fd.get("notes") || "",
        Name: fd.get("name") || "",
        Email: fd.get("email") || "",
        Phone: fd.get("phone") || "",
        "Preferred Contact": fd.get("contact_method") || ""
      };

      if (!INQUIRY_ENDPOINT) {
        // No endpoint configured yet — demo mode. Nothing is sent.
        setTimeout(function () { showSuccess(true); }, 700);
        return;
      }

      // Send both a flat form-encoded body (Formspree/Basin/Web3Forms style)
      // and the same data as JSON is available if your connector wants it.
      var body = new FormData();
      Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });

      fetch(INQUIRY_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: body
      })
        .then(function (r) {
          if (r.ok) { showSuccess(false); } else { showError(); }
        })
        .catch(showError);

      function showError() {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send my inquiry"; }
        var existing = form.querySelector(".form-send-error");
        if (existing) return;
        var p = document.createElement("p");
        p.className = "form-send-error";
        p.setAttribute("role", "alert");
        p.style.cssText = "color:#b3402a;margin-top:1rem;font-size:0.9rem";
        p.innerHTML = "Sorry — something went wrong sending that. Please try again, " +
          'or email us at <a href="mailto:azicateringgta@gmail.com">azicateringgta@gmail.com</a>.';
        form.querySelector(".form-step.is-active").appendChild(p);
      }

      function showSuccess(isDemo) {
        var wrap = form.parentElement;
        wrap.querySelector(".progress").style.display = "none";
        form.innerHTML =
          '<div class="form-success">' +
          '<div class="tick" aria-hidden="true">✓</div>' +
          "<h2>Thank you — your inquiry is in.</h2>" +
          "<p>We read every message personally and will reply within one business day " +
          "with availability and next steps. Keep an eye on your inbox (and your spam folder, just in case).</p>" +
          (isDemo ? '<p style="font-size:0.8rem;color:var(--text-soft)">(Demo mode: no endpoint is configured yet, so nothing was actually sent. See FORM-SETUP.md.)</p>' : "") +
          '<a class="btn btn--primary" href="menus.html">Browse our seasonal menus</a>' +
          "</div>";
      }
    });

    setStep(0);
  }

  /* --- Set a sensible minimum date on any date picker (today) --- */
  var dateInput = document.querySelector('input[type="date"]');
  if (dateInput && !dateInput.min) {
    dateInput.min = new Date().toISOString().split("T")[0];
  }

  /* --- Footer year --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =======================================================================
     Cookie consent notice
     -----------------------------------------------------------------------
     The site itself sets NO tracking cookies. This notice is here so that
     if/when you add analytics, you already have consent UX in place. The
     dismissal is remembered in localStorage (not a cookie), so the bar
     stays gone once acknowledged.
     ======================================================================= */
  (function cookieNotice() {
    var KEY = "azi-cookie-consent";
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }

    var bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Cookie notice");
    bar.innerHTML =
      "<p>We keep it simple: this site uses only what's needed to work and " +
      "doesn't track you. See our <a href=\"cookies.html\">Cookies</a> and " +
      "<a href=\"privacy.html\">Privacy</a> notes.</p>" +
      '<button type="button" class="btn btn--primary" data-cookie-ok>Got it</button>';
    document.body.appendChild(bar);
    // Animate in on next frame
    requestAnimationFrame(function () { bar.classList.add("is-visible"); });

    bar.querySelector("[data-cookie-ok]").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      bar.classList.remove("is-visible");
      setTimeout(function () { bar.remove(); }, 400);
    });
  })();
})();
