
/* ==================================================
   DIVCODES ACADEMY
   COURSE MANAGEMENT SYSTEM
   HTML + CSS + BOOTSTRAP + JAVASCRIPT + LOCAL STORAGE
   ================================================== */


/* ==================================================
   1. CONFIGURATION
   ================================================== */

const COURSE_STORAGE_KEY = "divcodesCourses";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

let courseModal = null;
let currentImage = "";


/* ==================================================
   2. DEFAULT COURSES
   ================================================== */

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
        learningOutcomes: [
            "Understand HTML page structure.",
            "Style responsive websites using CSS and Bootstrap.",
            "Create interactive pages using JavaScript.",
            "Build a complete website project."
        ],
        requirements: [
            "A computer or laptop.",
            "Basic computer skills.",
            "No previous programming experience is required."
        ],
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
        learningOutcomes: [
            "Understand Python syntax and variables.",
            "Use conditions and loops.",
            "Work with lists and dictionaries.",
            "Build small Python applications."
        ],
        requirements: [
            "A computer or laptop.",
            "Basic computer skills."
        ],
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
        learningOutcomes: [
            "Understand data analysis fundamentals.",
            "Use Excel and SQL.",
            "Analyze datasets using Python.",
            "Create visualizations and reports."
        ],
        requirements: [
            "A computer or laptop.",
            "Basic computer skills.",
            "Basic mathematics knowledge is helpful."
        ],
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
        learningOutcomes: [
            "Understand UI and UX principles.",
            "Create wireframes and user flows.",
            "Learn typography and color fundamentals.",
            "Design user-friendly interfaces."
        ],
        requirements: [
            "A computer or laptop.",
            "Interest in design and creativity."
        ],
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
        learningOutcomes: [
            "Understand basic cybersecurity concepts.",
            "Identify common security threats.",
            "Learn network security fundamentals.",
            "Understand protection practices."
        ],
        requirements: [
            "A computer or laptop.",
            "Basic computer skills.",
            "Interest in technology and security."
        ],
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
        learningOutcomes: [
            "Understand React fundamentals.",
            "Create reusable components.",
            "Work with props and state.",
            "Build interactive applications."
        ],
        requirements: [
            "Basic HTML and CSS knowledge.",
            "Basic JavaScript knowledge.",
            "A computer or laptop."
        ],
        icon: "bi-bootstrap"
    }
];


/* ==================================================
   3. NORMALIZE COURSE DATA
   ================================================== */

function normalizeCourse(course) {
    return {
        id: course.id || generateCourseId(course.name || "course"),
        name: String(course.name || ""),
        category: course.category || "Development",
        level: course.level || "Beginner",
        duration: String(course.duration || ""),
        price: Number(course.price) || 0,
        status: course.status || "Active",
        image: course.image || "",
        description: course.description || "",
        longDescription: course.longDescription || "",
        learningOutcomes: Array.isArray(course.learningOutcomes)
            ? course.learningOutcomes
            : [],
        requirements: Array.isArray(course.requirements)
            ? course.requirements
            : [],
        icon: course.icon || "bi-book"
    };
}


/* ==================================================
   4. GET COURSES FROM LOCAL STORAGE
   ================================================== */

function getCourses() {
    try {
        const savedCourses = localStorage.getItem(COURSE_STORAGE_KEY);

        if (savedCourses === null) {
            saveCourses(defaultCourses);
            return defaultCourses.map(course => ({ ...course }));
        }

        const courses = JSON.parse(savedCourses);

        if (!Array.isArray(courses)) {
            console.error("Invalid course data in Local Storage.");
            return [];
        }

        return courses.map(normalizeCourse);

    } catch (error) {
        console.error("Error loading courses:", error);
        return [];
    }
}


/* ==================================================
   5. SAVE COURSES TO LOCAL STORAGE
   ================================================== */

function saveCourses(courses) {
    try {
        localStorage.setItem(
            COURSE_STORAGE_KEY,
            JSON.stringify(courses)
        );

        return true;

    } catch (error) {
        console.error("Error saving courses:", error);

        showCourseError(
            "Unable to save the course. Your browser storage may be full. Try a smaller image."
        );

        return false;
    }
}


/* ==================================================
   6. SAFE HTML
   ================================================== */

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


/* ==================================================
   7. GENERATE COURSE ID
   ================================================== */

function generateCourseId(name) {
    const base = String(name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "course";

    return `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}


/* ==================================================
   8. CATEGORY ICON
   ================================================== */

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


/* ==================================================
   9. DISPLAY COURSES
   ================================================== */

function displayCourses() {
    const tableBody = document.getElementById("coursesTable");

    if (!tableBody) return;

    const courses = getCourses();

    const searchValue =
        document.getElementById("searchCourse")?.value
            .trim()
            .toLowerCase() || "";

    const categoryValue =
        document.getElementById("filterCategory")?.value || "all";

    const statusValue =
        document.getElementById("filterStatus")?.value || "all";

    const filteredCourses = courses.filter(course => {

        const matchesSearch =
            course.name.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === "all" ||
            course.category === categoryValue;

        const matchesStatus =
            statusValue === "all" ||
            course.status === statusValue;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (filteredCourses.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="bi bi-search fs-4 d-block mb-2"></i>
                    No courses found.
                </td>
            </tr>
        `;
    } else {

        tableBody.innerHTML = filteredCourses.map(course => {

            const statusClass =
                course.status === "Active" ? "approved" : "rejected";

            const imageHTML = course.image
                ? `<img src="${escapeHTML(course.image)}"
                        alt="${escapeHTML(course.name)}"
                        class="course-table-image">`
                : `<i class="bi ${escapeHTML(course.icon)}"></i>`;

            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div class="course-table-icon">
                                ${imageHTML}
                            </div>

                            <div>
                                <div class="course-table-name">
                                    ${escapeHTML(course.name)}
                                </div>

                                <div class="course-table-id">
                                    ID: ${escapeHTML(course.id)}
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        <span class="course-category">
                            ${escapeHTML(course.category)}
                        </span>
                    </td>

                    <td>${escapeHTML(course.level)}</td>

                    <td>${escapeHTML(course.duration)}</td>

                    <td>$${course.price.toFixed(2)}</td>

                    <td>
                        <span class="status-badge ${statusClass}">
                            ${escapeHTML(course.status)}
                        </span>
                    </td>

                    <td>
                        <div class="course-actions">

                            <button
                                type="button"
                                class="action-btn view"
                                data-action="edit"
                                data-id="${escapeHTML(course.id)}"
                                title="Edit course">
                                <i class="bi bi-pencil"></i>
                            </button>

                            <button
                                type="button"
                                class="action-btn reject"
                                data-action="delete"
                                data-id="${escapeHTML(course.id)}"
                                title="Delete course">
                                <i class="bi bi-trash3"></i>
                            </button>

                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    const results = document.getElementById("courseResults");

    if (results) {
        results.textContent =
            `Showing ${filteredCourses.length} of ${courses.length} courses`;
    }

    updateCourseStatistics(courses);
}


/* ==================================================
   10. UPDATE STATISTICS
   ================================================== */

function updateCourseStatistics(courses) {
    const active = courses.filter(
        course => course.status === "Active"
    ).length;

    const inactive = courses.filter(
        course => course.status === "Inactive"
    ).length;

    document.getElementById("courseCount").textContent =
        courses.length;

    document.getElementById("activeCount").textContent =
        active;

    document.getElementById("inactiveCount").textContent =
        inactive;
}


/* ==================================================
   11. OPEN ADD COURSE MODAL
   ================================================== */

function openAddCourseModal() {
    const form = document.getElementById("courseForm");

    form.reset();
    form.classList.remove("was-validated");

    document.getElementById("courseId").value = "";

    document.getElementById("courseModalTitle").textContent =
        "Add New Course";

    currentImage = "";

    updateImagePreview("");

    hideCourseError();

    courseModal.show();
}


/* ==================================================
   12. OPEN EDIT COURSE MODAL
   ================================================== */

function openEditCourseModal(courseId) {
    const courses = getCourses();

    const course = courses.find(item => item.id === courseId);

    if (!course) {
        alert("Course not found.");
        return;
    }

    const form = document.getElementById("courseForm");

    form.reset();
    form.classList.remove("was-validated");

    document.getElementById("courseId").value = course.id;
    document.getElementById("courseName").value = course.name;
    document.getElementById("courseCategory").value = course.category;
    document.getElementById("courseLevel").value = course.level;
    document.getElementById("courseDuration").value = course.duration;
    document.getElementById("coursePrice").value = course.price;
    document.getElementById("courseStatus").value = course.status;

    document.getElementById("courseDescription").value =
        course.description;

    document.getElementById("longDescription").value =
        course.longDescription;

    document.getElementById("learningOutcomes").value =
        course.learningOutcomes.join("\n");

    document.getElementById("courseRequirements").value =
        course.requirements.join("\n");

    currentImage = course.image;

    updateImagePreview(currentImage);

    document.getElementById("courseModalTitle").textContent =
        "Edit Course";

    hideCourseError();

    courseModal.show();
}


/* ==================================================
   13. IMAGE UPLOAD
   ================================================== */

function setupImageUpload() {
    const imageInput = document.getElementById("courseImage");

    imageInput?.addEventListener("change", event => {

        const file = event.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            showCourseError(
                "Please upload a JPG, PNG, or WEBP image."
            );

            imageInput.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            showCourseError(
                "Image size must not exceed 2 MB."
            );

            imageInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            currentImage = reader.result;
            updateImagePreview(currentImage);
            hideCourseError();
        };

        reader.onerror = () => {
            showCourseError(
                "Unable to read this image. Please try another one."
            );
        };

        reader.readAsDataURL(file);
    });

    document.getElementById("removeImageBtn")
        ?.addEventListener("click", () => {

            currentImage = "";

            if (imageInput) {
                imageInput.value = "";
            }

            updateImagePreview("");
            hideCourseError();
        });
}


/* ==================================================
   14. IMAGE PREVIEW
   ================================================== */

function updateImagePreview(image) {
    const preview = document.getElementById("courseImagePreview");
    const placeholder = document.getElementById("imagePlaceholder");

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


/* ==================================================
   15. GET TEXTAREA LIST
   ================================================== */

function getTextareaItems(elementId) {
    return document
        .getElementById(elementId)
        .value
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);
}


/* ==================================================
   16. ADD OR UPDATE COURSE
   ================================================== */

function handleCourseSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("courseForm");

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
        return;
    }

    const courseId =
        document.getElementById("courseId").value;

    const name =
        document.getElementById("courseName").value.trim();

    const category =
        document.getElementById("courseCategory").value;

    const level =
        document.getElementById("courseLevel").value;

    const duration =
        document.getElementById("courseDuration").value.trim();

    const price =
        Number(document.getElementById("coursePrice").value);

    const status =
        document.getElementById("courseStatus").value;

    const description =
        document.getElementById("courseDescription").value.trim();

    const longDescription =
        document.getElementById("longDescription").value.trim();

    const learningOutcomes =
        getTextareaItems("learningOutcomes");

    const requirements =
        getTextareaItems("courseRequirements");

    if (
        !name ||
        !category ||
        !level ||
        !duration ||
        !description ||
        !longDescription
    ) {
        showCourseError(
            "Please complete all required course information."
        );
        return;
    }

    if (!Number.isFinite(price) || price < 0 || price > 100000) {
        showCourseError("Please enter a valid course price.");
        return;
    }

    if (learningOutcomes.length === 0) {
        showCourseError(
            "Please add at least one learning outcome."
        );
        return;
    }

    if (requirements.length === 0) {
        showCourseError(
            "Please add at least one course requirement."
        );
        return;
    }

    let courses = getCourses();

    // Prevent duplicate course names
    const duplicate = courses.some(course =>
        course.name.toLowerCase() === name.toLowerCase() &&
        course.id !== courseId
    );

    if (duplicate) {
        showCourseError(
            "A course with this name already exists."
        );
        return;
    }

    const courseData = {
        name,
        category,
        level,
        duration,
        price,
        status,
        image: currentImage,
        description,
        longDescription,
        learningOutcomes,
        requirements,
        icon: getCategoryIcon(category)
    };

    if (courseId) {

        // EDIT EXISTING COURSE
        courses = courses.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    ...courseData
                };
            }

            return course;
        });

    } else {

        // ADD NEW COURSE
        const newCourse = {
            id: generateCourseId(name),
            ...courseData
        };

        courses.push(newCourse);
    }

    // SAVE TO LOCAL STORAGE
    if (!saveCourses(courses)) {
        return;
    }

    // CLOSE MODAL
    courseModal.hide();

    // RESET FORM
    form.reset();
    form.classList.remove("was-validated");

    currentImage = "";
    updateImagePreview("");

    // REFRESH TABLE AND STATISTICS
    displayCourses();

    alert(
        courseId
            ? "Course updated successfully!"
            : "New course added successfully!"
    );
}


/* ==================================================
   17. DELETE COURSE
   ================================================== */

function deleteCourse(courseId) {
    const courses = getCourses();

    const course = courses.find(
        item => item.id === courseId
    );

    if (!course) {
        alert("Course not found.");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${course.name}"?`
    );

    if (!confirmed) return;

    const updatedCourses = courses.filter(
        item => item.id !== courseId
    );

    if (saveCourses(updatedCourses)) {
        displayCourses();
        alert("Course deleted successfully!");
    }
}


/* ==================================================
   18. TABLE ACTIONS
   ================================================== */

function setupCourseActions() {
    const tableBody = document.getElementById("coursesTable");

    tableBody?.addEventListener("click", event => {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const courseId = button.dataset.id;

        if (action === "edit") {
            openEditCourseModal(courseId);
        }

        if (action === "delete") {
            deleteCourse(courseId);
        }
    });
}


/* ==================================================
   19. SEARCH AND FILTERS
   ================================================== */

function setupFilters() {

    document.getElementById("searchCourse")
        ?.addEventListener("input", displayCourses);

    document.getElementById("filterCategory")
        ?.addEventListener("change", displayCourses);

    document.getElementById("filterStatus")
        ?.addEventListener("change", displayCourses);

    document.getElementById("resetFilters")
        ?.addEventListener("click", () => {

            document.getElementById("searchCourse").value = "";
            document.getElementById("filterCategory").value = "all";
            document.getElementById("filterStatus").value = "all";

            displayCourses();
        });
}


/* ==================================================
   20. ERROR MESSAGES
   ================================================== */

function showCourseError(message) {
    const errorElement = document.getElementById("courseError");

    if (!errorElement) {
        alert(message);
        return;
    }

    errorElement.textContent = message;
    errorElement.classList.remove("d-none");
}

function hideCourseError() {
    const errorElement = document.getElementById("courseError");

    if (!errorElement) return;

    errorElement.textContent = "";
    errorElement.classList.add("d-none");
}


/* ==================================================
   21. DATE AND YEAR
   ================================================== */

function displayDate() {
    const dateElement = document.getElementById("currentDate");
    const yearElement = document.getElementById("currentYear");

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


/* ==================================================
   22. MOBILE SIDEBAR
   ================================================== */

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


/* ==================================================
   23. BACK TO WEBSITE
   ================================================== */

function setupLogoutButton() {
    const logoutBtn = document.getElementById("logoutBtn");

    // The button is optional in the current HTML.
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        const confirmExit = confirm(
            "Do you want to return to the DivCodes website?"
        );

        if (confirmExit) {
            window.location.href = "../DivCodes/index.html";
        }
    });
}


/* ==================================================
   24. INITIALIZE COURSE MANAGEMENT
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Check that Bootstrap is available.
    if (typeof bootstrap === "undefined") {
        console.error("Bootstrap JavaScript was not loaded.");
        return;
    }

    const modalElement = document.getElementById("courseModal");
    const form = document.getElementById("courseForm");
    const addButton = document.getElementById("addCourseBtn");

    if (!modalElement || !form || !addButton) {
        console.error(
            "Course Management HTML is missing a required element."
        );
        return;
    }

    // Initialize Bootstrap modal.
    courseModal = bootstrap.Modal.getOrCreateInstance(modalElement);

    // Load courses and statistics.
    displayCourses();

    // Initialize page functions.
    displayDate();
    setupFilters();
    setupCourseActions();
    setupImageUpload();
    setupSidebar();
    setupLogoutButton();

    // ADD COURSE BUTTON
    addButton.addEventListener("click", openAddCourseModal);

    // SAVE COURSE FORM
    form.addEventListener("submit", handleCourseSubmit);

    console.log("DivCodes Course Management initialized successfully.");

});
