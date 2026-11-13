/* =========================================================
   DIVCODES ACADEMY ADMIN
   ONE JAVASCRIPT FILE FOR ALL ADMIN PAGES
   No Local Storage / No Database
   ========================================================= */

/* -------------------------
   1. SHARED DATA
------------------------- */

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
let courseModal = null;
let currentImage = "";

// Default courses appear whenever the Courses or Dashboard page opens.
const defaultCourses = [
    {
        id: "web-development",
        name: "Web Development",
        category: "Development",
        level: "Beginner",
        duration: "12 weeks",
        price: 120,
        status: "Active",
        image: "",
        description: "Learn how to build modern, responsive websites using HTML, CSS, and JavaScript.",
        longDescription: "Explore the foundations of web development and learn how to create attractive, responsive, and interactive websites.",
        learningOutcomes: ["Understand HTML page structure.", "Style responsive websites using CSS and Bootstrap.", "Create interactive pages using JavaScript.", "Build a complete website project."],
        requirements: ["A computer or laptop.", "Basic computer skills.", "No previous programming experience is required."],
        icon: "bi-code-slash"
    },
    {
        id: "python",
        name: "Python Programming",
        category: "Programming",
        level: "Beginner",
        duration: "8 weeks",
        price: 100,
        status: "Active",
        image: "",
        description: "Start programming with Python and develop your problem-solving skills.",
        longDescription: "Learn Python from the beginning, understand programming fundamentals, work with data and build practical projects.",
        learningOutcomes: ["Understand Python syntax and variables.", "Use conditions and loops.", "Work with lists and dictionaries.", "Build small Python applications."],
        requirements: ["A computer or laptop.", "Basic computer skills."],
        icon: "bi-filetype-py"
    },
    {
        id: "data-analytics",
        name: "Data Analytics",
        category: "Data",
        level: "Intermediate",
        duration: "10 weeks",
        price: 150,
        status: "Active",
        image: "",
        description: "Learn how to analyze data and turn information into meaningful insights.",
        longDescription: "Discover how to collect, clean, analyze and visualize data using practical analytical tools.",
        learningOutcomes: ["Understand data analysis fundamentals.", "Use Excel and SQL.", "Analyze datasets using Python.", "Create visualizations and reports."],
        requirements: ["A computer or laptop.", "Basic computer skills.", "Basic mathematics knowledge is helpful."],
        icon: "bi-bar-chart-line"
    },
    {
        id: "ui-ux",
        name: "UI/UX Design",
        category: "Design",
        level: "Beginner",
        duration: "8 weeks",
        price: 110,
        status: "Active",
        image: "",
        description: "Explore user interface and user experience design.",
        longDescription: "Learn UI/UX principles, understand user needs, create wireframes and design user-friendly interfaces.",
        learningOutcomes: ["Understand UI and UX principles.", "Create wireframes and user flows.", "Learn typography and color fundamentals.", "Design user-friendly interfaces."],
        requirements: ["A computer or laptop.", "Interest in design and creativity."],
        icon: "bi-palette"
    },
    {
        id: "cybersecurity",
        name: "Cybersecurity Fundamentals",
        category: "Security",
        level: "Beginner",
        duration: "10 weeks",
        price: 140,
        status: "Active",
        image: "",
        description: "Understand cybersecurity and learn how to protect digital systems.",
        longDescription: "Explore cybersecurity concepts, common digital threats and network security fundamentals.",
        learningOutcomes: ["Understand basic cybersecurity concepts.", "Identify common security threats.", "Learn network security fundamentals.", "Understand protection practices."],
        requirements: ["A computer or laptop.", "Basic computer skills.", "Interest in technology and security."],
        icon: "bi-shield-lock"
    },
    {
        id: "react",
        name: "React Development",
        category: "Development",
        level: "Intermediate",
        duration: "8 weeks",
        price: 130,
        status: "Active",
        image: "",
        description: "Learn React and build modern interactive user interfaces.",
        longDescription: "Learn reusable components, application state, events and modern frontend development.",
        learningOutcomes: ["Understand React fundamentals.", "Create reusable components.", "Work with props and state.", "Build interactive applications."],
        requirements: ["Basic HTML and CSS knowledge.", "Basic JavaScript knowledge.", "A computer or laptop."],
        icon: "bi-bootstrap"
    }
];

// Each HTML page starts with its own fresh in-memory arrays.
let courses = defaultCourses.map(course => ({
    ...course,
    learningOutcomes: [...course.learningOutcomes],
    requirements: [...course.requirements]
}));

// Example student registrations.
// The Students page is generated from these registration records.
let registrations = [
    {
        id: 1,
        fullName: "Ahmad Ali",
        email: "ahmad@gmail.com",
        phone: "70123456",
        courseName: "Web Development",
        status: "Approved",
        registeredAt: "2026-11-01",
        message: "I want to learn web development."
    },
    {
        id: 2,
        fullName: "Sara Hassan",
        email: "sara@gmail.com",
        phone: "71123456",
        courseName: "Python Programming",
        status: "Pending",
        registeredAt: "2026-11-03",
        message: "I am interested in Python."
    },
    {
        id: 3,
        fullName: "Mohammad Khalil",
        email: "mohammad@gmail.com",
        phone: "76123456",
        courseName: "Data Analytics",
        status: "Approved",
        registeredAt: "2026-11-05",
        message: "I want to improve my data analysis skills."
    },
    {
        id: 4,
        fullName: "Lina Ahmad",
        email: "lina@gmail.com",
        phone: "03123456",
        courseName: "UI/UX Design",
        status: "Rejected",
        registeredAt: "2026-11-06",
        message: "I am interested in UI/UX design."
    },
    {
        id: 5,
        fullName: "Ahmad Ali",
        email: "ahmad@gmail.com",
        phone: "70123456",
        courseName: "React Development",
        status: "Pending",
        registeredAt: "2026-11-08",
        message: "I also want to learn React."
    },
    {
        id: 6,
        fullName: "Maya Samir",
        email: "maya@gmail.com",
        phone: "79123456",
        courseName: "Cybersecurity Fundamentals",
        status: "Approved",
        registeredAt: "2026-11-10",
        message: "I want to study cybersecurity."
    }
];


/* -------------------------
   2. GENERAL HELPERS
------------------------- */

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = getElement(id);
    if (element) element.textContent = value;
}

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
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}

function getRegistrationDate(registration) {
    return registration.registeredAt ||
        registration.createdAt ||
        registration.date ||
        "";
}

function formatDate(value) {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function normalizeRegistrationStatus(status) {
    const value = String(status || "Pending").toLowerCase();
    if (value === "approved") return "Approved";
    if (value === "rejected") return "Rejected";
    return "Pending";
}

function getRegistrationStatusClass(status) {
    return normalizeRegistrationStatus(status).toLowerCase();
}

function generateCourseId(name) {
    const base = String(name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "course";

    return `${base}-${Date.now()}`;
}

function getCategoryIcon(category) {
    const icons = {
        Development: "bi-code-slash",
        Programming: "bi-filetype-py",
        Data: "bi-bar-chart-line",
        Design: "bi-palette",
        Security: "bi-shield-lock"
    };
    return icons[category] || "bi-book";
}

function getTextareaItems(id) {
    const element = getElement(id);
    if (!element) return [];
    return element.value.split("\n").map(item => item.trim()).filter(Boolean);
}


/* -------------------------
   3. DATE, SIDEBAR AND LOGOUT
------------------------- */

function displayDate() {
    const dateElement = getElement("currentDate");
    const yearElement = getElement("currentYear");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function setupSidebar() {
    const sidebar = getElement("sidebar");
    const menuToggle = getElement("menuToggle");
    const overlay = getElement("sidebarOverlay");

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

function setupLogoutButton() {
    const logoutButton = getElement("logoutBtn");
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


/* =========================================================
   4. COURSES PAGE
========================================================= */

function updateCourseStatistics() {
    setText("courseCount", courses.length);
    setText("activeCount", courses.filter(course => course.status === "Active").length);
    setText("inactiveCount", courses.filter(course => course.status === "Inactive").length);
}

function displayCourses() {
    const tableBody = getElement("coursesTable");
    if (!tableBody) return;

    const searchValue = (getElement("searchCourse")?.value || "").trim().toLowerCase();
    const categoryValue = getElement("filterCategory")?.value || "all";
    const statusValue = getElement("filterStatus")?.value || "all";

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchValue);
        const matchesCategory = categoryValue === "all" || course.category === categoryValue;
        const matchesStatus = statusValue === "all" || course.status === statusValue;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (filteredCourses.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="bi bi-search fs-4 d-block mb-2"></i>
                    No courses found.
                </td>
            </tr>`;
    } else {
        tableBody.innerHTML = filteredCourses.map(course => {
            const statusClass = course.status === "Active" ? "approved" : "rejected";
            const imageHTML = course.image
                ? `<img src="${escapeHTML(course.image)}" alt="${escapeHTML(course.name)}" class="course-table-image">`
                : `<i class="bi ${escapeHTML(course.icon || getCategoryIcon(course.category))}"></i>`;

            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div class="course-table-icon">${imageHTML}</div>
                            <div>
                                <div class="course-table-name">${escapeHTML(course.name)}</div>
                                <div class="course-table-id">ID: ${escapeHTML(course.id)}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="course-category">${escapeHTML(course.category)}</span></td>
                    <td>${escapeHTML(course.level)}</td>
                    <td>${escapeHTML(course.duration)}</td>
                    <td>$${Number(course.price || 0).toFixed(2)}</td>
                    <td><span class="status-badge ${statusClass}">${escapeHTML(course.status)}</span></td>
                    <td>
                        <div class="course-actions">
                            <button type="button" class="action-btn view" data-course-action="edit" data-id="${escapeHTML(course.id)}" title="Edit course">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="action-btn reject" data-course-action="delete" data-id="${escapeHTML(course.id)}" title="Delete course">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        }).join("");
    }

    setText("courseResults", `Showing ${filteredCourses.length} of ${courses.length} courses`);
    updateCourseStatistics();
}

function showCourseError(message) {
    const errorElement = getElement("courseError");
    if (!errorElement) {
        alert(message);
        return;
    }
    errorElement.textContent = message;
    errorElement.classList.remove("d-none");
}

function hideCourseError() {
    const errorElement = getElement("courseError");
    if (!errorElement) return;
    errorElement.textContent = "";
    errorElement.classList.add("d-none");
}

function updateImagePreview(image) {
    const preview = getElement("courseImagePreview");
    const placeholder = getElement("imagePlaceholder");
    if (!preview || !placeholder) return;

    if (image) {
        preview.src = image;
        preview.classList.remove("d-none");
        placeholder.classList.add("d-none");
    } else {
        preview.removeAttribute("src");
        preview.classList.add("d-none");
        placeholder.classList.remove("d-none");
    }
}

function openAddCourseModal() {
    const form = getElement("courseForm");
    if (!form || !courseModal) return;

    form.reset();
    form.classList.remove("was-validated");
    setText("courseModalTitle", "Add New Course");
    getElement("courseId").value = "";
    currentImage = "";
    updateImagePreview("");
    hideCourseError();
    courseModal.show();
}

function openEditCourseModal(courseId) {
    const course = courses.find(item => item.id === courseId);
    if (!course) {
        alert("Course not found.");
        return;
    }

    const form = getElement("courseForm");
    if (!form || !courseModal) return;

    form.reset();
    form.classList.remove("was-validated");

    getElement("courseId").value = course.id;
    getElement("courseName").value = course.name;
    getElement("courseCategory").value = course.category;
    getElement("courseLevel").value = course.level;
    getElement("courseDuration").value = course.duration;
    getElement("coursePrice").value = course.price;
    getElement("courseStatus").value = course.status;
    getElement("courseDescription").value = course.description || "";
    getElement("longDescription").value = course.longDescription || "";
    getElement("learningOutcomes").value = (course.learningOutcomes || []).join("\n");
    getElement("courseRequirements").value = (course.requirements || []).join("\n");

    currentImage = course.image || "";
    updateImagePreview(currentImage);
    setText("courseModalTitle", "Edit Course");
    hideCourseError();
    courseModal.show();
}

function setupImageUpload() {
    const imageInput = getElement("courseImage");

    imageInput?.addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            showCourseError("Please upload a JPG, PNG, or WEBP image.");
            imageInput.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            showCourseError("Image size must not exceed 2 MB.");
            imageInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            currentImage = reader.result;
            updateImagePreview(currentImage);
            hideCourseError();
        };

        reader.onerror = () => showCourseError("Unable to read this image. Please try another one.");
        reader.readAsDataURL(file);
    });

    getElement("removeImageBtn")?.addEventListener("click", () => {
        currentImage = "";
        if (imageInput) imageInput.value = "";
        updateImagePreview("");
        hideCourseError();
    });
}

function handleCourseSubmit(event) {
    event.preventDefault();

    const form = getElement("courseForm");
    if (!form) return;

    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const id = getElement("courseId").value;
    const name = getElement("courseName").value.trim();
    const category = getElement("courseCategory").value;
    const level = getElement("courseLevel").value;
    const duration = getElement("courseDuration").value.trim();
    const price = Number(getElement("coursePrice").value);
    const status = getElement("courseStatus").value;
    const description = getElement("courseDescription").value.trim();
    const longDescription = getElement("longDescription").value.trim();

    if (!name || !category || !level || !duration || !description || !longDescription || !Number.isFinite(price) || price < 0) {
        showCourseError("Please complete all required fields correctly.");
        return;
    }

    const courseData = {
        id: id || generateCourseId(name),
        name,
        category,
        level,
        duration,
        price,
        status,
        image: currentImage,
        description,
        longDescription,
        learningOutcomes: getTextareaItems("learningOutcomes"),
        requirements: getTextareaItems("courseRequirements"),
        icon: getCategoryIcon(category)
    };

    if (id) {
        const index = courses.findIndex(course => course.id === id);
        if (index !== -1) courses[index] = courseData;
    } else {
        courses.push(courseData);
    }

    displayCourses();
    refreshDashboard();
    courseModal?.hide();
}

function setupCourseEvents() {
    const modalElement = getElement("courseModal");
    const form = getElement("courseForm");
    const addButton = getElement("addCourseBtn");

    if (modalElement && typeof bootstrap !== "undefined") {
        courseModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    }

    addButton?.addEventListener("click", openAddCourseModal);
    form?.addEventListener("submit", handleCourseSubmit);

    ["searchCourse", "filterCategory", "filterStatus"].forEach(id => {
        getElement(id)?.addEventListener(id === "searchCourse" ? "input" : "change", displayCourses);
    });

    getElement("resetFilters")?.addEventListener("click", () => {
        if (getElement("searchCourse")) getElement("searchCourse").value = "";
        if (getElement("filterCategory")) getElement("filterCategory").value = "all";
        if (getElement("filterStatus")) getElement("filterStatus").value = "all";
        displayCourses();
    });

    getElement("coursesTable")?.addEventListener("click", event => {
        const button = event.target.closest("[data-course-action]");
        if (!button) return;

        const id = button.dataset.id;

        if (button.dataset.courseAction === "edit") {
            openEditCourseModal(id);
        }

        if (button.dataset.courseAction === "delete") {
            const course = courses.find(item => item.id === id);
            if (!course) return;

            if (confirm(`Are you sure you want to delete "${course.name}"?`)) {
                courses = courses.filter(item => item.id !== id);
                displayCourses();
                refreshDashboard();
            }
        }
    });

    setupImageUpload();
    displayCourses();
}





/* =========================================================
   5. REGISTRATIONS PAGE
========================================================= */

function populateRegistrationCourseFilter() {
    const select = getElement("registrationCourseFilter");
    if (!select) return;

    const currentValue = select.value || "all";
    const courseNames = [...new Set(registrations.map(reg => reg.courseName || "Unspecified course"))].sort();

    select.innerHTML = '<option value="all">All courses</option>';

    courseNames.forEach(courseName => {
        const option = document.createElement("option");
        option.value = courseName;
        option.textContent = courseName;
        select.appendChild(option);
    });

    select.value = courseNames.includes(currentValue) ? currentValue : "all";
}

function updateRegistrationStatistics() {
    setText("totalRegistrations", registrations.length);
    setText("pendingRegistrations", registrations.filter(reg => normalizeRegistrationStatus(reg.status) === "Pending").length);
    setText("approvedRegistrations", registrations.filter(reg => normalizeRegistrationStatus(reg.status) === "Approved").length);
    setText("rejectedRegistrations", registrations.filter(reg => normalizeRegistrationStatus(reg.status) === "Rejected").length);
}

function renderRegistrations() {
    const tbody = getElement("registrationsTable");
    if (!tbody) return;

    const search = (getElement("registrationSearch")?.value || "").trim().toLowerCase();
    const selectedCourse = getElement("registrationCourseFilter")?.value || "all";
    const selectedStatus = getElement("registrationStatusFilter")?.value || "all";

    updateRegistrationStatistics();

    const filtered = registrations.filter(registration => {
        const name = registration.fullName || registration.name || "";
        const matchesSearch = [name, registration.email, registration.courseName]
            .some(value => String(value || "").toLowerCase().includes(search));
        const matchesCourse = selectedCourse === "all" ||
            (registration.courseName || "Unspecified course") === selectedCourse;
        const matchesStatus = selectedStatus === "all" ||
            normalizeRegistrationStatus(registration.status) === selectedStatus;

        return matchesSearch && matchesCourse && matchesStatus;
    }).sort((a, b) => new Date(getRegistrationDate(b) || 0) - new Date(getRegistrationDate(a) || 0));

    setText("registrationResults", `Showing ${filtered.length} of ${registrations.length} registrations`);

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No registrations found. There are currently no registration records in this temporary session.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(registration => {
        const status = normalizeRegistrationStatus(registration.status);
        const id = escapeHTML(String(registration.id ?? ""));
        const name = escapeHTML(registration.fullName || registration.name || "Unknown student");
        const email = escapeHTML(registration.email || "");
        const course = escapeHTML(registration.courseName || "Unspecified course");

        const statusActions = status === "Pending" ? `
            <button class="action-btn approve" type="button" data-registration-action="approve" data-id="${id}" title="Approve">
                <i class="bi bi-check-lg"></i>
            </button>
            <button class="action-btn reject" type="button" data-registration-action="reject" data-id="${id}" title="Reject">
                <i class="bi bi-x-lg"></i>
            </button>` : "";

        return `
            <tr>
                <td><strong>${name}</strong><div class="small text-muted">${email}</div></td>
                <td>${course}</td>
                <td>${formatDate(getRegistrationDate(registration))}</td>
                <td><span class="status-badge ${getRegistrationStatusClass(status)}">${status}</span></td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="action-btn view" type="button" data-registration-action="view" data-id="${id}" title="View details">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${statusActions}
                    </div>
                </td>
            </tr>`;
    }).join("");
}

function updateRegistrationStatus(id, newStatus) {
    const registration = registrations.find(item => String(item.id) === String(id));
    if (!registration) return;

    registration.status = newStatus;
    renderRegistrations();
    refreshDashboard();
}

function viewRegistrationDetails(id) {
    const registration = registrations.find(item => String(item.id) === String(id));
    if (!registration) return;

    const name = registration.fullName || registration.name || "Unknown student";
    setText("registrationAvatar", getInitials(name));
    setText("registrationStudentName", name);
    setText("registrationStudentEmail", registration.email || "Not provided");
    setText("registrationPhone", registration.phone || "Not provided");
    setText("registrationCourse", registration.courseName || "Not specified");
    setText("registrationDate", formatDate(getRegistrationDate(registration)));
    setText("registrationStatus", normalizeRegistrationStatus(registration.status));
    setText("registrationMessage", registration.message || "No message provided.");

    const modal = getElement("registrationModal");
    if (modal && typeof bootstrap !== "undefined") {
        bootstrap.Modal.getOrCreateInstance(modal).show();
    }
}

function setupRegistrationEvents() {
    populateRegistrationCourseFilter();
    renderRegistrations();

    getElement("registrationSearch")?.addEventListener("input", renderRegistrations);
    getElement("registrationCourseFilter")?.addEventListener("change", renderRegistrations);
    getElement("registrationStatusFilter")?.addEventListener("change", renderRegistrations);

    getElement("resetRegistrationFilters")?.addEventListener("click", () => {
        if (getElement("registrationSearch")) getElement("registrationSearch").value = "";
        if (getElement("registrationCourseFilter")) getElement("registrationCourseFilter").value = "all";
        if (getElement("registrationStatusFilter")) getElement("registrationStatusFilter").value = "all";
        renderRegistrations();
    });

    getElement("registrationsTable")?.addEventListener("click", event => {
        const button = event.target.closest("[data-registration-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.registrationAction;

        if (action === "view") viewRegistrationDetails(id);
        if (action === "approve") updateRegistrationStatus(id, "Approved");
        if (action === "reject") updateRegistrationStatus(id, "Rejected");
    });
}



/* =========================================================
   6. STUDENTS PAGE
========================================================= */

function getStudents() {
    const studentsMap = new Map();

    registrations.forEach(registration => {
        const email = String(registration.email || "").trim().toLowerCase();
        const name = registration.fullName || registration.name || "Unknown student";
        const key = email || name.toLowerCase();

        if (!studentsMap.has(key)) {
            studentsMap.set(key, {
                key,
                fullName: name,
                email: registration.email || "",
                phone: registration.phone || "",
                registrations: []
            });
        }

        studentsMap.get(key).registrations.push(registration);
    });

    return [...studentsMap.values()].map(student => {
        const dates = student.registrations
            .map(getRegistrationDate)
            .filter(Boolean)
            .sort((a, b) => new Date(b) - new Date(a));

        return {
            ...student,
            latestDate: dates[0] || ""
        };
    });
}

function populateStudentCourseFilter() {
    const select = getElement("studentCourseFilter");
    if (!select) return;

    const currentValue = select.value || "all";
    const courseNames = [...new Set(registrations.map(reg => reg.courseName || "Unspecified course"))].sort();

    select.innerHTML = '<option value="all">All courses</option>';

    courseNames.forEach(courseName => {
        const option = document.createElement("option");
        option.value = courseName;
        option.textContent = courseName;
        select.appendChild(option);
    });

    select.value = courseNames.includes(currentValue) ? currentValue : "all";
}

function renderStudents() {
    const tbody = getElement("studentsTable");
    if (!tbody) return;

    const students = getStudents();
    const search = (getElement("studentSearch")?.value || "").trim().toLowerCase();
    const selectedCourse = getElement("studentCourseFilter")?.value || "all";

    const filtered = students.filter(student => {
        const matchesSearch = [student.fullName, student.email, student.phone]
            .some(value => String(value || "").toLowerCase().includes(search));

        const matchesCourse = selectedCourse === "all" ||
            student.registrations.some(reg => (reg.courseName || "Unspecified course") === selectedCourse);

        return matchesSearch && matchesCourse;
    });

    setText("studentTotal", students.length);
    setText("studentEnrollmentTotal", registrations.length);
    setText("studentCourseTotal", new Set(registrations.map(reg => reg.courseName).filter(Boolean)).size);
    setText("studentResults", `Showing ${filtered.length} of ${students.length} students`);

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No students found. There are currently no student records in this temporary session.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(student => {
        const courseNames = [...new Set(student.registrations.map(reg => reg.courseName || "Unspecified course"))];
        const courseLabel = courseNames.length > 2
            ? `${courseNames.slice(0, 2).map(escapeHTML).join(", ")} +${courseNames.length - 2} more`
            : courseNames.map(escapeHTML).join(", ");

        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="student-detail-avatar">${escapeHTML(getInitials(student.fullName))}</div>
                        <strong>${escapeHTML(student.fullName)}</strong>
                    </div>
                </td>
                <td>${escapeHTML(student.email)}</td>
                <td>${escapeHTML(student.phone || "—")}</td>
                <td>${courseLabel || "—"}</td>
                <td>${formatDate(student.latestDate)}</td>
                <td>
                    <button class="action-btn view" type="button" data-student-key="${encodeURIComponent(student.key)}">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>`;
    }).join("");
}

function viewStudent(key) {
    let decodedKey = key;
    try { decodedKey = decodeURIComponent(key); } catch {}

    const student = getStudents().find(item => item.key === decodedKey);
    if (!student) return;

    setText("studentAvatar", getInitials(student.fullName));
    setText("detailStudentName", student.fullName);
    setText("detailStudentEmail", student.email || "Not provided");
    setText("detailStudentPhone", student.phone || "Not provided");
    setText("detailRegistrationCount", student.registrations.length);

    const dates = student.registrations
        .map(getRegistrationDate)
        .filter(Boolean)
        .sort((a, b) => new Date(a) - new Date(b));

    setText("detailFirstDate", formatDate(dates[0] || ""));

    const history = getElement("studentHistory");
    if (history) {
        history.innerHTML = student.registrations.map(registration => {
            const status = normalizeRegistrationStatus(registration.status);
            return `
                <tr>
                    <td>${escapeHTML(registration.courseName || "Unspecified course")}</td>
                    <td>${formatDate(getRegistrationDate(registration))}</td>
                    <td><span class="status-badge ${getRegistrationStatusClass(status)}">${status}</span></td>
                </tr>`;
        }).join("");
    }

    const modal = getElement("studentModal");
    if (modal && typeof bootstrap !== "undefined") {
        bootstrap.Modal.getOrCreateInstance(modal).show();
    }
}

function setupStudentEvents() {
    populateStudentCourseFilter();
    renderStudents();

    getElement("studentSearch")?.addEventListener("input", renderStudents);
    getElement("studentCourseFilter")?.addEventListener("change", renderStudents);

    getElement("resetStudentFilters")?.addEventListener("click", () => {
        if (getElement("studentSearch")) getElement("studentSearch").value = "";
        if (getElement("studentCourseFilter")) getElement("studentCourseFilter").value = "all";
        renderStudents();
    });

    getElement("studentsTable")?.addEventListener("click", event => {
        const button = event.target.closest("[data-student-key]");
        if (button) viewStudent(button.dataset.studentKey);
    });
}




/* =========================================================
   7. DASHBOARD PAGE
========================================================= */

function refreshDashboard() {
    if (!getElement("totalCourses")) return;

    const uniqueStudents = new Set(
        registrations
            .map(registration => String(registration.email || "").trim().toLowerCase())
            .filter(Boolean)
    );

    setText("totalCourses", courses.length);
    setText("totalStudents", uniqueStudents.size);
    setText("totalRegistrations", registrations.length);
    setText("activeCourses", courses.filter(course => course.status === "Active").length);

    const recentBody = getElement("recentRegistrations");

    if (recentBody) {
        const recent = [...registrations]
            .sort((a, b) => new Date(getRegistrationDate(b) || 0) - new Date(getRegistrationDate(a) || 0))
            .slice(0, 5);

        recentBody.innerHTML = recent.length ? recent.map(registration => {
            const name = registration.fullName || registration.name || "Unknown Student";
            const status = normalizeRegistrationStatus(registration.status);

            return `
                <tr>
                    <td>
                        <div class="student-cell">
                            <div class="student-avatar">${escapeHTML(getInitials(name))}</div>
                            <div>
                                <div class="student-name">${escapeHTML(name)}</div>
                                <div class="student-email">${escapeHTML(registration.email || "")}</div>
                            </div>
                        </div>
                    </td>
                    <td>${escapeHTML(registration.courseName || "Not specified")}</td>
                    <td>${formatDate(getRegistrationDate(registration))}</td>
                    <td><span class="status-badge ${getRegistrationStatusClass(status)}">${status}</span></td>
                </tr>`;
        }).join("") : `
            <tr><td colspan="4" class="empty-state">No registrations yet.</td></tr>`;
    }

    const overview = getElement("courseOverview");

    if (overview) {
        overview.innerHTML = courses.length ? courses.map(course => {
            const imageHTML = course.image
                ? `<img src="${escapeHTML(course.image)}" alt="${escapeHTML(course.name)}" class="dashboard-course-image">`
                : `<i class="bi ${escapeHTML(course.icon || getCategoryIcon(course.category))}"></i>`;

            const statusClass = course.status === "Active" ? "course-active" : "course-inactive";

            return `
                <div class="col-12 col-sm-6 col-lg-4">
                    <div class="course-mini-card">
                        <div class="course-mini-icon">${imageHTML}</div>
                        <h6>${escapeHTML(course.name)}</h6>
                        <p>${escapeHTML(course.category)}</p>
                        <span class="${statusClass}">${escapeHTML(course.status)}</span>
                    </div>
                </div>`;
        }).join("") : `
            <div class="col-12">
                <div class="empty-state">No courses available yet.</div>
            </div>`;
    }
}


/* =========================================================
   8. INITIALIZE THE PAGE THAT IS CURRENTLY OPEN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    displayDate();
    setupSidebar();
    setupLogoutButton();

    // Courses page
    if (getElement("coursesTable")) {
        setupCourseEvents();
    }

    // Registrations page
    if (getElement("registrationsTable")) {
        setupRegistrationEvents();
    }

    // Students page
    if (getElement("studentsTable")) {
        setupStudentEvents();
    }

    // Dashboard page
    if (getElement("recentRegistrations") || getElement("courseOverview")) {
        refreshDashboard();
    }

    console.log("DivCodes Admin app.js loaded successfully.");
});