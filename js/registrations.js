
/* =========================================
   DIVCODES ACADEMY
   REGISTRATION MANAGEMENT
   ========================================= */

const REGISTRATION_KEY = "divcodesRegistrations";

document.addEventListener("DOMContentLoaded", () => {
    setupPage();
    seedDemoData();
    populateCourseFilter();
    renderRegistrations();
    setupEvents();
});

/* =========================================
   1. PAGE SETUP
   ========================================= */

function setupPage() {
    const date = document.getElementById("currentDate");
    const year = document.getElementById("currentYear");

    if (date) {
        date.textContent = new Intl.DateTimeFormat("en", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    document.getElementById("menuToggle")?.addEventListener("click", () => {
        sidebar?.classList.toggle("show");
        overlay?.classList.toggle("show");
    });

    overlay?.addEventListener("click", () => {
        sidebar?.classList.remove("show");
        overlay?.classList.remove("show");
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        window.location.href = "../DivCodes/index.html";
    });
}

/* =========================================
   2. DEMO DATA
   ========================================= */

function seedDemoData() {
    if (localStorage.getItem(REGISTRATION_KEY) !== null) {
        return;
    }

    const daysAgo = days => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString();
    };

    const demo = [
        {
            id: "demo-reg-1",
            fullName: "Sara Ahmad",
            email: "sara.ahmad@example.com",
            phone: "70123456",
            courseId: "python",
            courseName: "Python Programming",
            message: "I want to improve my programming skills.",
            registeredAt: daysAgo(1),
            status: "Pending"
        },
        {
            id: "demo-reg-2",
            fullName: "Maya Ali",
            email: "maya.ali@example.com",
            phone: "76123456",
            courseId: "web-development",
            courseName: "Web Development",
            message: "",
            registeredAt: daysAgo(3),
            status: "Approved"
        },
        {
            id: "demo-reg-3",
            fullName: "Sara Ahmad",
            email: "sara.ahmad@example.com",
            phone: "70123456",
            courseId: "data-analytics",
            courseName: "Data Analytics",
            message: "",
            registeredAt: daysAgo(5),
            status: "Pending"
        },
        {
            id: "demo-reg-4",
            fullName: "Nour Hassan",
            email: "nour.hassan@example.com",
            phone: "79123456",
            courseId: "react",
            courseName: "React Development",
            message: "I have basic JavaScript knowledge.",
            registeredAt: daysAgo(7),
            status: "Rejected"
        }
    ];

    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(demo));
}

/* =========================================
   3. READ AND SAVE DATA
   ========================================= */

function getRegistrations() {
    try {
        const data = JSON.parse(
            localStorage.getItem(REGISTRATION_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error("Could not read registrations:", error);
        return [];
    }
}

function saveRegistrations(registrations) {
    localStorage.setItem(
        REGISTRATION_KEY,
        JSON.stringify(registrations)
    );
}

/* =========================================
   4. STATUS HELPERS
   ========================================= */

function getStatus(registration) {
    const status = String(
        registration.status || "Pending"
    ).toLowerCase();

    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";

    return "Pending";
}

function getStatusClass(status) {
    return status.toLowerCase();
}

/* =========================================
   5. DATE HELPERS
   ========================================= */

function getRegistrationDate(registration) {
    return registration.registeredAt ||
        registration.createdAt ||
        registration.date ||
        "";
}

function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

/* =========================================
   6. SAFE HTML
   ========================================= */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

/* =========================================
   7. COURSE FILTER
   ========================================= */

function populateCourseFilter() {
    const select = document.getElementById(
        "registrationCourseFilter"
    );

    if (!select) return;

    const currentValue = select.value || "all";

    const courses = [
        ...new Set(
            getRegistrations().map(reg =>
                reg.courseName || "Unspecified course"
            )
        )
    ].sort();

    select.innerHTML =
        '<option value="all">All courses</option>';

    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        select.appendChild(option);
    });

    select.value = courses.includes(currentValue)
        ? currentValue
        : "all";
}

/* =========================================
   8. UPDATE STATISTICS
   ========================================= */

function updateStatistics(registrations) {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    registrations.forEach(registration => {
        const status = getStatus(registration);

        if (status === "Pending") pending++;
        if (status === "Approved") approved++;
        if (status === "Rejected") rejected++;
    });

    document.getElementById("totalRegistrations").textContent =
        registrations.length;

    document.getElementById("pendingRegistrations").textContent =
        pending;

    document.getElementById("approvedRegistrations").textContent =
        approved;

    document.getElementById("rejectedRegistrations").textContent =
        rejected;
}

/* =========================================
   9. DISPLAY REGISTRATIONS
   ========================================= */

function renderRegistrations() {
    const tbody = document.getElementById("registrationsTable");

    if (!tbody) return;

    const allRegistrations = getRegistrations();

    const search = (
        document.getElementById("registrationSearch")?.value || ""
    ).trim().toLowerCase();

    const selectedCourse =
        document.getElementById("registrationCourseFilter")?.value || "all";

    const selectedStatus =
        document.getElementById("registrationStatusFilter")?.value || "all";

    updateStatistics(allRegistrations);

    const filtered = allRegistrations.filter(registration => {

        const name = registration.fullName ||
            registration.name ||
            "";

        const matchesSearch = [
            name,
            registration.email,
            registration.courseName
        ].some(value =>
            String(value || "").toLowerCase().includes(search)
        );

        const matchesCourse =
            selectedCourse === "all" ||
            (registration.courseName || "Unspecified course") === selectedCourse;

        const matchesStatus =
            selectedStatus === "all" ||
            getStatus(registration) === selectedStatus;

        return matchesSearch && matchesCourse && matchesStatus;

    }).sort((a, b) => {
        return new Date(getRegistrationDate(b) || 0) -
            new Date(getRegistrationDate(a) || 0);
    });

    document.getElementById("registrationResults").textContent =
        `Showing ${filtered.length} of ${allRegistrations.length} registrations`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No registrations found. Try changing your filters.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(registration => {

        const status = getStatus(registration);
        const id = escapeHTML(String(registration.id ?? ""));

        const name = escapeHTML(
            registration.fullName ||
            registration.name ||
            "Unknown student"
        );

        const email = escapeHTML(registration.email || "");
        const course = escapeHTML(
            registration.courseName || "Unspecified course"
        );

        let statusActions = "";

        if (status === "Pending") {
            statusActions = `
                <button class="action-btn approve"
                    type="button"
                    data-action="approve"
                    data-id="${id}"
                    title="Approve">
                    <i class="bi bi-check-lg"></i>
                </button>

                <button class="action-btn reject"
                    type="button"
                    data-action="reject"
                    data-id="${id}"
                    title="Reject">
                    <i class="bi bi-x-lg"></i>
                </button>
            `;
        }

        return `
            <tr>
                <td>
                    <strong>${name}</strong>
                    <div class="small text-muted">${email}</div>
                </td>

                <td>${course}</td>

                <td>${formatDate(getRegistrationDate(registration))}</td>

                <td>
                    <span class="status-badge ${getStatusClass(status)}">
                        ${status}
                    </span>
                </td>

                <td>
                    <div class="d-flex gap-2">

                        <button class="action-btn view"
                            type="button"
                            data-action="view"
                            data-id="${id}"
                            title="View details">
                            <i class="bi bi-eye"></i>
                        </button>

                        ${statusActions}

                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

/* =========================================
   10. UPDATE REGISTRATION STATUS
   ========================================= */

function updateRegistrationStatus(id, newStatus) {
    const registrations = getRegistrations();

    const index = registrations.findIndex(registration =>
        String(registration.id ?? "") === String(id)
    );

    if (index === -1) {
        alert("Registration not found.");
        return;
    }

    registrations[index].status = newStatus;

    saveRegistrations(registrations);

    renderRegistrations();

    alert(`Registration ${newStatus.toLowerCase()} successfully.`);
}

/* =========================================
   11. VIEW REGISTRATION DETAILS
   ========================================= */

function viewRegistrationDetails(id) {
    const registration = getRegistrations().find(reg =>
        String(reg.id ?? "") === String(id)
    );

    if (!registration) return;

    const name = registration.fullName ||
        registration.name ||
        "Unknown student";

    document.getElementById("registrationAvatar").textContent =
        name.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part[0] || "")
            .join("")
            .toUpperCase();

    document.getElementById("registrationStudentName").textContent =
        name;

    document.getElementById("registrationStudentEmail").textContent =
        registration.email || "Not provided";

    document.getElementById("registrationPhone").textContent =
        registration.phone || "Not provided";

    document.getElementById("registrationCourse").textContent =
        registration.courseName || "Not specified";

    document.getElementById("registrationDate").textContent =
        formatDate(getRegistrationDate(registration));

    document.getElementById("registrationStatus").textContent =
        getStatus(registration);

    document.getElementById("registrationMessage").textContent =
        registration.message || "No message provided.";

    bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById("registrationModal")
        )
        .show();
}

/* =========================================
   12. EVENT LISTENERS
   ========================================= */

function setupEvents() {

    document.getElementById("registrationSearch")
        ?.addEventListener("input", renderRegistrations);

    document.getElementById("registrationCourseFilter")
        ?.addEventListener("change", renderRegistrations);

    document.getElementById("registrationStatusFilter")
        ?.addEventListener("change", renderRegistrations);

    document.getElementById("resetRegistrationFilters")
        ?.addEventListener("click", () => {

            document.getElementById("registrationSearch").value = "";
            document.getElementById("registrationCourseFilter").value = "all";
            document.getElementById("registrationStatusFilter").value = "all";

            renderRegistrations();
        });

    document.getElementById("registrationsTable")
        ?.addEventListener("click", event => {

            const button = event.target.closest("[data-action]");

            if (!button) return;

            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === "view") {
                viewRegistrationDetails(id);
            }

            if (action === "approve") {
                updateRegistrationStatus(id, "Approved");
            }

            if (action === "reject") {
                updateRegistrationStatus(id, "Rejected");
            }
        });
}
