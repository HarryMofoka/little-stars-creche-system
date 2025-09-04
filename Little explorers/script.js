/* =========================
   NAVBAR HAMBURGER TOGGLE
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  /* =========================
     SMOOTH SCROLL FOR NAV LINKS
     ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* =========================
     SCROLL-TO-TOP BUTTON
     ========================= */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.style.display = "block";
      } else {
        scrollTopBtn.style.display = "none";
      }
    });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================
     AUTHENTICATION
     ========================= */
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // Signup
  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("signupUsername").value.trim();
      const password = document.getElementById("signupPassword").value;
      const role = document.getElementById("signupRole").value;

      if (!username || !password) {
        alert("Please fill in all fields.");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some(u => u.username === username)) {
        alert("Username already exists!");
        return;
      }

      users.push({ username, password, role });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please login.");
      signupForm.reset();
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (!user) {
        alert("Invalid username or password.");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(user));
      showDashboard(user);
      loginForm.reset();
    });
  }

  /* =========================
     DASHBOARDS
     ========================= */
  const parentDashboard = document.getElementById("parentDashboard");
  const adminDashboard = document.getElementById("adminDashboard");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    showDashboard(loggedInUser);
  }

  function showDashboard(user) {
    if (parentDashboard && adminDashboard) {
      parentDashboard.classList.add("hidden");
      adminDashboard.classList.add("hidden");
    }

    if (user.role === "Parent" && parentDashboard) {
      parentDashboard.classList.remove("hidden");
      document.getElementById("parentWelcome").textContent = `Welcome, ${user.username}`;
    } else if (user.role === "Admin" && adminDashboard) {
      adminDashboard.classList.remove("hidden");

      // Show total children count
      document.getElementById("totalChildren").textContent = demoChildren.length;

      // Find best performing class
      const classStats = {};
      demoChildren.forEach(child => {
        classStats[child.class] = (classStats[child.class] || 0) + child.performance;
      });
      const bestClass = Object.entries(classStats).sort((a, b) => b[1] - a[1])[0][0];
      document.getElementById("bestClass").textContent = bestClass;
    }
  }

  /* =========================
     ADMIN CHILD SEARCH
     ========================= */
  const searchBtn = document.getElementById("searchChildBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const name = document.getElementById("childSearch").value.trim().toLowerCase();
      const results = demoChildren.filter(c => c.name.toLowerCase().includes(name));
      const resultsDiv = document.getElementById("searchResults");

      resultsDiv.innerHTML = "";
      if (results.length === 0) {
        resultsDiv.textContent = "No child found.";
      } else {
        results.forEach(child => {
          const div = document.createElement("div");
          div.textContent = `${child.name} (Age: ${child.age}) – Class: ${child.class}, Performance: ${child.performance}`;
          resultsDiv.appendChild(div);
        });
      }
    });
  }

  /* =========================
     LOGOUT
     ========================= */
  const logoutBtns = document.querySelectorAll(".logoutBtn");
  logoutBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      location.reload();
    });
  });
});

/* =========================
   DEMO DATA FOR ADMIN
   ========================= */
const demoChildren = [
  { name: "Alice Johnson", age: 5, class: "Butterflies", performance: 92 },
  { name: "Ben Smith", age: 4, class: "Ladybugs", performance: 78 },
  { name: "Chloe Brown", age: 6, class: "Butterflies", performance: 85 },
  { name: "David Lee", age: 5, class: "Sunflowers", performance: 88 },
  { name: "Ella Davis", age: 4, class: "Ladybugs", performance: 90 },
  { name: "Finn Wilson", age: 6, class: "Sunflowers", performance: 82 },
  { name: "Grace Taylor", age: 5, class: "Butterflies", performance: 95 },
  { name: "Henry Martinez", age: 4, class: "Ladybugs", performance: 80 }
];
