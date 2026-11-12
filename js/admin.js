
/* =====================================
   DIVCODES ADMIN DASHBOARD
   Dynamic Dashboard with Local Storage
   ===================================== */

// Local Storage keys
const COURSE_STORAGE_KEY = "divcodesCourses";
const REGISTRATION_STORAGE_KEY = "divcodesRegistrations";


/* =====================================
   1. GET COURSES FROM LOCAL STORAGE
   ===================================== */

function getCourses() {
    try {
        const data = JSON.parse(
            localStorage.getItem(COURSE_STORAGE_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error("Could not read courses:", error);
        return [];
    }
}


/* =====================================
   2. GET REGISTRATIONS FROM LOCAL STORAGE
   ===================================== */

function getRegistrations() {
    try {
        const data = JSON.parse(
            localStorage.getItem(REGISTRATION_STORAGE_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error("Could not read registrations:", error);
        return [];
    }
}


/* =====================================
   3. DASHBOARD STATISTICS
   ===================================== */

function updateStatistics() {

    const courses = getCourses();
    const registrations = getRegistrations();

    // Count unique students using their email addresses
    const uniqueEmails = new Set(
        registrations
            .map(student =>
                String(student.email || "").trim().toLowerCase()
            )
            .filter(Boolean)
    );

    const totalCourses = courses.length;
    const totalStudents = uniqueEmails.size;
    const totalRegistrations = registrations.length;

    const activeCourses = courses.filter(
        course =>
            String(course.status || "").toLowerCase() === "active"
    ).length;

    // Update dashboard cards
    const totalCoursesElement =
        document.getElementById("totalCourses");

    const totalStudentsElement =
        document.getElementById("totalStudents");

    const totalRegistrationsElement =
        document.getElementById("totalRegistrations");

    const activeCoursesElement =
        document.getElementById("activeCourses");

    if (totalCoursesElement) {
        totalCoursesElement.textContent = totalCourses;
    }

    if (totalStudentsElement) {
        totalStudentsElement.textContent = totalStudents;
    }

    if (totalRegistrationsElement) {
        totalRegistrationsElement.textContent = totalRegistrations;
    }

    if (activeCoursesElement) {
        activeCoursesElement.textContent = activeCourses;
    }
}


/* =====================================
   4. DISPLAY RECENT REGISTRATIONS
   ===================================== */

function displayRecentRegistrations() {

    const registrations = getRegistrations();

    const tableBody =
        document.getElementById("recentRegistrations");

    if (!tableBody) return;

    // Sort registrations from newest to oldest
    const recent = [...registrations]
        .sort((a, b) =>
            getRegistrationTime(b) - getRegistrationTime(a)
        )
        .slice(0, 5);

    if (recent.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                    No registrations yet.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = recent.map(student => {

        const name =
            student.fullName || student.name || "Unknown Student";

        const email = student.email || "";

        const course =
            student.courseName || "Not specified";

        const date = formatDate(getRegistrationDate(student));

        const status = normalizeStatus(student.status);

        return `
            <tr>
                <td>
                    <div class="student-cell">
                        <div class="student-avatar">
                            ${escapeHTML(getInitials(name))}
                        </div>

                        <div>
                            <div class="student-name">
                                ${escapeHTML(name)}
                            </div>

                            <div class="student-email">
                                ${escapeHTML(email)}
                            </div>
                        </div>
                    </div>
                </td>

                <td>${escapeHTML(course)}</td>

                <td>${escapeHTML(date)}</td>

                <td>
                    <span class="status-badge ${getStatusClass(status)}">
                        ${escapeHTML(status)}
                    </span>
                </td>
            </tr>
        `;

    }).join("");
}


/* =====================================
   5. DISPLAY DYNAMIC COURSE OVERVIEW
   ===================================== */

function displayCourseOverview() {

    const container =
        document.getElementById("courseOverview");

    if (!container) return;

    // Read the latest courses from Local Storage
    const courses = getCourses();

    if (courses.length === 0) {

        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="bi bi-journal-code fs-3 d-block mb-2"></i>
                    No courses available yet.
                    <br>
                    <a href="courses.html" class="primary-btn mt-3 d-inline-block">
                        <i class="bi bi-plus-lg"></i>
                        Add your first course
                    </a>
                </div>
            </div>
        `;

        return;
    }

    // Display every course
    container.innerHTML = courses.map(course => {

        const name = course.name || "Untitled Course";

        const category = course.category || "Uncategorized";

        const status = normalizeStatus(course.status);

        const icon = course.icon || "bi-book";

        const imageHTML = course.image
            ? `
                <img
                    src="${escapeHTML(course.image)}"
                    alt="${escapeHTML(name)}"
                    class="dashboard-course-image"
                >
              `
            : `
                <i class="bi ${escapeHTML(icon)}"></i>
              `;

        const statusClass =
            status === "Active" ? "course-active" : "course-inactive";

        return `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="course-mini-card">

                    <div class="course-mini-icon">
                        ${imageHTML}
                    </div>

                    <h6>${escapeHTML(name)}</h6>

                    <p>${escapeHTML(category)}</p>

                    <span class="${statusClass}">
                        ${escapeHTML(status)}
                    </span>

                </div>
            </div>
        `;

    }).join("");
}


/* =====================================
   6. HELPER FUNCTIONS
   ===================================== */

function getInitials(name) {

    return String(name || "S")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}


function getRegistrationDate(registration) {

    return registration.registeredAt ||
        registration.createdAt ||
        registration.date ||
        "";
}


function getRegistrationTime(registration) {

    const date = new Date(getRegistrationDate(registration));

    const time = date.getTime();

    return Number.isNaN(time) ? 0 : time;
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function normalizeStatus(status) {

    const value = String(status || "Pending").toLowerCase();

    if (value === "approved") return "Approved";
    if (value === "rejected") return "Rejected";

    if (value === "active") return "Active";
    if (value === "inactive") return "Inactive";

    return "Pending";
}


function getStatusClass(status) {

    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus === "approved") {
        return "status-approved";
    }

    if (normalizedStatus === "rejected") {
        return "status-rejected";
    }

    return "status-pending";
}


function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];
    });
}


/* =====================================
   7. CURRENT DATE AND YEAR
   ===================================== */

function displayDate() {

    const dateElement =
        document.getElementById("currentDate");

    const yearElement =
        document.getElementById("currentYear");

    if (dateElement) {
        dateElement.textContent =
            new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


/* =====================================
   8. MOBILE SIDEBAR
   ===================================== */

function setupSidebar() {

    const sidebar = document.getElementById("sidebar");

    const menuToggle = document.getElementById("menuToggle");

    const overlay = document.getElementById("sidebarOverlay");

    if (!sidebar || !menuToggle || !overlay) return;

    menuToggle.addEventListener("click", () => {

        sidebar.classList.add("show");

        overlay.classList.add("show");

    });

    overlay.addEventListener("click", () => {

        sidebar.classList.remove("show");

        overlay.classList.remove("show");

    });
}


/* =====================================
   9. BACK TO WEBSITE
   ===================================== */

function setupLogoutButton() {

    const logoutButton =
        document.getElementById("logoutBtn");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {

        const confirmExit = confirm(
            "Do you want to return to the DivCodes website?"
        );

        if (confirmExit) {
            window.location.href = "../DivCodes/index.html";
        }

    });
}


/* =====================================
   10. REFRESH DASHBOARD DATA
   ===================================== */

function refreshDashboard() {

    updateStatistics();

    displayRecentRegistrations();

    displayCourseOverview();
}


/* =====================================
   11. INITIALIZE DASHBOARD
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {

    refreshDashboard();

    displayDate();

    setupSidebar();

    setupLogoutButton();

});


// Refresh if Local Storage changes in another browser tab
window.addEventListener("storage", event => {

    if (
        event.key === COURSE_STORAGE_KEY ||
        event.key === REGISTRATION_STORAGE_KEY
    ) {
        refreshDashboard();
    }

});


// Refresh when returning to the dashboard tab
window.addEventListener("pageshow", () => {
    refreshDashboard();
});
