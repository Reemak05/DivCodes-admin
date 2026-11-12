
/* =========================================
   DIVCODES ACADEMY
   STUDENT MANAGEMENT
   ========================================= */

const REGISTRATION_KEY = "divcodesRegistrations";
const DEMO_KEY = "divcodesStudentDemoSeeded";

document.addEventListener("DOMContentLoaded", () => {
    setupPage();
    seedDemoData();
    populateCourseFilter();
    renderStudents();
    setupEvents();
});

/* =========================================
   1. PAGE SETUP
   ========================================= */

function setupPage() {
    const dateElement = document.getElementById("currentDate");
    const yearElement = document.getElementById("currentYear");

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("en", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
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
    if (
        localStorage.getItem(REGISTRATION_KEY) !== null ||
        localStorage.getItem(DEMO_KEY) === "yes"
    ) {
        return;
    }

    const daysAgo = days => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString();
    };

    const demoStudents = [
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
            message: "",
            registeredAt: daysAgo(7),
            status: "Rejected"
        }
    ];

    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(demoStudents));
    localStorage.setItem(DEMO_KEY, "yes");
}

/* =========================================
   3. READ REGISTRATIONS
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

/* =========================================
   4. GROUP REGISTRATIONS BY STUDENT
   ========================================= */

function getStudents() {
    const groups = new Map();

    getRegistrations().forEach(registration => {

        const email = String(registration.email || "")
            .trim()
            .toLowerCase();

        const name = String(
            registration.fullName ||
            registration.name ||
            "Unknown Student"
        ).trim();

        const key = email || name.toLowerCase();

        if (!groups.has(key)) {
            groups.set(key, {
                key: key,
                fullName: name,
                email: registration.email || "Not provided",
                phone: registration.phone || "Not provided",
                registrations: []
            });
        }

        const student = groups.get(key);

        student.registrations.push(registration);

        if (
            getRegistrationTime(registration) >
            getRegistrationTime({
                registeredAt: student.latestDate
            })
        ) {
            student.latestDate = getRegistrationDate(registration);
            student.phone = registration.phone || student.phone;
            student.fullName = name;
        }
    });

    return Array.from(groups.values()).map(student => {

        student.registrations.sort(
            (a, b) => getRegistrationTime(b) - getRegistrationTime(a)
        );

        student.latestDate =
            student.latestDate ||
            getRegistrationDate(student.registrations[0]);

        return student;

    });
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

function getRegistrationTime(registration) {
    const time = Date.parse(getRegistrationDate(registration));
    return Number.isNaN(time) ? 0 : time;
}

function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

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

function getInitials(name) {
    return String(name || "S")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0] || "")
        .join("")
        .toUpperCase();
}

/* =========================================
   7. COURSE FILTER
   ========================================= */

function populateCourseFilter() {
    const select = document.getElementById("studentCourseFilter");

    if (!select) return;

    const currentValue = select.value || "all";

    const courses = [
        ...new Set(
            getRegistrations().map(reg =>
                reg.courseName || "Unspecified course"
            )
        )
    ].sort();

    select.innerHTML = '<option value="all">All courses</option>';

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
   8. DISPLAY STUDENTS
   ========================================= */

function renderStudents() {
    const tbody = document.getElementById("studentsTable");

    if (!tbody) return;

    const students = getStudents();

    const search = (
        document.getElementById("studentSearch")?.value || ""
    ).trim().toLowerCase();

    const selectedCourse =
        document.getElementById("studentCourseFilter")?.value || "all";

    const filteredStudents = students.filter(student => {

        const matchesSearch = [
            student.fullName,
            student.email,
            student.phone
        ].some(value =>
            String(value || "").toLowerCase().includes(search)
        );

        const matchesCourse =
            selectedCourse === "all" ||
            student.registrations.some(reg =>
                (reg.courseName || "Unspecified course") === selectedCourse
            );

        return matchesSearch && matchesCourse;
    });

    // Statistics
    document.getElementById("studentTotal").textContent =
        students.length;

    document.getElementById("studentEnrollmentTotal").textContent =
        getRegistrations().length;

    document.getElementById("studentCourseTotal").textContent =
        new Set(
            getRegistrations()
                .map(reg => reg.courseName)
                .filter(Boolean)
        ).size;

    document.getElementById("studentResults").textContent =
        `Showing ${filteredStudents.length} of ${students.length} students`;

    if (filteredStudents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No students found. Try changing your search or filters.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredStudents.map(student => {

        const courses = [
            ...new Set(
                student.registrations.map(reg =>
                    reg.courseName || "Unspecified course"
                )
            )
        ];

        const courseLabel = courses.length > 2
            ? `${courses.slice(0, 2).map(escapeHTML).join(", ")} +${courses.length - 2} more`
            : courses.map(escapeHTML).join(", ");

        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="student-detail-avatar">
                            ${escapeHTML(getInitials(student.fullName))}
                        </div>
                        <strong>${escapeHTML(student.fullName)}</strong>
                    </div>
                </td>

                <td>${escapeHTML(student.email)}</td>

                <td>${escapeHTML(student.phone)}</td>

                <td>${courseLabel || "—"}</td>

                <td>${formatDate(student.latestDate)}</td>

                <td>
                    <button
                        class="action-btn view"
                        type="button"
                        data-student-key="${encodeURIComponent(student.key)}">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

/* =========================================
   9. VIEW STUDENT DETAILS
   ========================================= */

function viewStudent(key) {
    const student = getStudents().find(item => item.key === key);

    if (!student) return;

    document.getElementById("studentAvatar").textContent =
        getInitials(student.fullName);

    document.getElementById("detailStudentName").textContent =
        student.fullName;

    document.getElementById("detailStudentEmail").textContent =
        student.email;

    document.getElementById("detailStudentPhone").textContent =
        student.phone || "Not provided";

    document.getElementById("detailRegistrationCount").textContent =
        student.registrations.length;

    const dates = student.registrations
        .map(reg => getRegistrationDate(reg))
        .filter(Boolean)
        .sort((a, b) => new Date(a) - new Date(b));

    document.getElementById("detailFirstDate").textContent =
        formatDate(dates[0] || "");

    const history = document.getElementById("studentHistory");

    history.innerHTML = student.registrations.map(registration => {

        const status = registration.status || "Pending";

        const statusClass = status.toLowerCase();

        return `
            <tr>
                <td>${escapeHTML(registration.courseName || "Unspecified course")}</td>
                <td>${formatDate(getRegistrationDate(registration))}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeHTML(status)}
                    </span>
                </td>
            </tr>
        `;
    }).join("");

    bootstrap.Modal
        .getOrCreateInstance(document.getElementById("studentModal"))
        .show();
}

/* =========================================
   10. EVENTS
   ========================================= */

function setupEvents() {

    document.getElementById("studentSearch")
        ?.addEventListener("input", renderStudents);

    document.getElementById("studentCourseFilter")
        ?.addEventListener("change", renderStudents);

    document.getElementById("resetStudentFilters")
        ?.addEventListener("click", () => {

            document.getElementById("studentSearch").value = "";
            document.getElementById("studentCourseFilter").value = "all";

            renderStudents();
        });

    document.getElementById("studentsTable")
        ?.addEventListener("click", event => {

            const button = event.target.closest("[data-student-key]");

            if (!button) return;

            try {
                viewStudent(decodeURIComponent(button.dataset.studentKey));
            } catch {
                viewStudent(button.dataset.studentKey);
            }
        });
}
