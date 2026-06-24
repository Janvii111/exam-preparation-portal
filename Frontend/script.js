

// ================= API =================
const API = "https://exam-preparation-portal.onrender.com";


// ================= NAVIGATION =================
function goToLogin() {
  window.location.href = "login.html";
}

function goToSignup() {
  window.location.href = "signup.html";
}

function goToDashboard() {
  window.location.href = "dashboard.html";
}


// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
      const msg = document.getElementById("message");

      if (data.success) {
        msg.innerText = "Signup successful!";
        msg.style.color = "green";

        // Redirect after signup
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);

      } else {
        msg.innerText = "Signup failed!";
        msg.style.color = "red";
      }
    })
    .catch(() => {
      document.getElementById("message").innerText = "Server error!";
    });
  });
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      const msg = document.getElementById("message");

      if (data.success) {
        window.location.href = "dashboard.html";
      } else {
        if (msg) {
          msg.innerText = "Invalid login!";
          msg.style.color = "red";
        }
      }
    })
    .catch(() => {
      document.getElementById("message").innerText = "Server error!";
    });
  });
}

// Load papers function
function loadPapers() {

  fetch(API + "/papers")
    .then(res => {
      if (!res.ok) {
        throw new Error("Server error");
      }
      return res.json();
    })
    .then(data => {

      const year = document.getElementById("year").value;
      const semester = document.getElementById("semester").value;
      const examType = document.getElementById("examType").value;

      let filtered = data;

      // Apply filters only if selected
      if (year || semester || examType) {
        filtered = data.filter(p => {
          return (!year || p.academicYear === year) &&
                 (!semester || p.semester === semester) &&
                 (!examType || p.examType === examType);
        });
      }

      let html = "";

      if (filtered.length === 0) {
        html = "<h3>No papers found ❌</h3>";
      } else {
        filtered.forEach(p => {
          html += `
            <div class="card">
              <h3>${p.subject} (${p.year})</h3>
              <p>${p.academicYear} Year - ${p.semester} Sem</p>
              <p>Exam: ${p.examType}</p>

              <a href="${p.file}" target="_blank">👁 View</a>
              <a href="${p.file}" download>⬇ Download</a>
            </div>
          `;
        });
      }

      document.getElementById("papers").innerHTML = html;
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("papers").innerHTML =
        "<h3 style='color:red;'>Error loading papers ❌</h3>";
    });
}

// Auto load all papers on page open
window.onload = loadPapers;


      

