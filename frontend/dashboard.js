const API_URL = "http://localhost:8080/employees";
const token = localStorage.getItem("jwtToken");

let currentPage = 0;
const pageSize = 5;
let totalPages = 0;
let searchMode = false;
let searchTimeout = null;


// =====================================
// AUTHENTICATION CHECK
// =====================================

if (!token) {
    window.location.href = "index.html";
}


// =====================================
// COMMON API FUNCTION
// =====================================

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        window.location.href = "index.html";
        throw new Error("Session expired or invalid token. Please login again.");
    }

    if (response.status === 403) {
        throw new Error(
            "Access forbidden. Please check that your JWT token is valid and has permission."
        );
    }

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(responseText || `Request failed (${response.status})`);
    }

    if (!responseText) return null;

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}


// =====================================
// LOAD EMPLOYEES
// =====================================

async function loadEmployees(page = 0) {
    if (!token) return;

    currentPage = page;
    searchMode = false;

    const tableBody = document.getElementById("employeeTableBody");

    tableBody.innerHTML = `
        <tr>
            <td colspan="6">Loading employees...</td>
        </tr>
    `;

    try {
        const data = await apiRequest(
            `${API_URL}?page=${currentPage}&size=${pageSize}&sortBy=id`
        );

        const employees = data.content || [];
        totalPages = data.totalPages || 0;

        displayEmployees(employees);
        updateStatistics(data.totalElements || 0, employees);
        renderPagination();

    } catch (error) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">${escapeHTML(error.message)}</td>
            </tr>
        `;
        console.error("Employee loading error:", error);
    }
}


// =====================================
// DISPLAY EMPLOYEES
// =====================================

function displayEmployees(employees) {
    const tableBody = document.getElementById("employeeTableBody");

    if (!employees || employees.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No employees found.</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = employees.map(employee => `
        <tr>
            <td>${escapeHTML(employee.id)}</td>
            <td>${escapeHTML(employee.name)}</td>
            <td>${escapeHTML(employee.email)}</td>
            <td>${escapeHTML(employee.department)}</td>
            <td>${formatSalary(employee.salary)}</td>
            <td>
                <button type="button"
                    class="action-btn edit-btn"
                    onclick="editEmployee(${Number(employee.id)})">
                    Edit
                </button>

                <button type="button"
                    class="action-btn delete-btn"
                    onclick="deleteEmployee(${Number(employee.id)})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// =====================================
// FORMAT SALARY
// =====================================

function formatSalary(salary) {
    if (salary === null || salary === undefined || salary === "") {
        return "—";
    }

    const amount = Number(salary);
    if (!Number.isFinite(amount)) return "—";

    return amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}


// =====================================
// UPDATE DASHBOARD STATISTICS
// =====================================

function updateStatistics(total, employees) {
    document.getElementById("totalEmployees").textContent = total;

    const departments = new Set(
        employees.map(employee => employee.department).filter(Boolean)
    );

    document.getElementById("totalDepartments").textContent =
        departments.size;

    // EmployeeDto has no active-status field.
    // This displays the number of employees on the current page/results.
    document.getElementById("activeEmployees").textContent =
        employees.length;
}


// =====================================
// PAGINATION
// =====================================

function renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    if (searchMode || totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    pagination.innerHTML = `
        <button type="button" id="previousPage"
            ${currentPage === 0 ? "disabled" : ""}>
            Previous
        </button>

        <span>Page ${currentPage + 1} of ${totalPages}</span>

        <button type="button" id="nextPage"
            ${currentPage >= totalPages - 1 ? "disabled" : ""}>
            Next
        </button>
    `;

    document.getElementById("previousPage")
        .addEventListener("click", () => {
            if (currentPage > 0) loadEmployees(currentPage - 1);
        });

    document.getElementById("nextPage")
        .addEventListener("click", () => {
            if (currentPage < totalPages - 1) loadEmployees(currentPage + 1);
        });
}


// =====================================
// ADD EMPLOYEE
// =====================================

async function addEmployee(employee) {
    try {
        await apiRequest(API_URL, {
            method: "POST",
            body: JSON.stringify(employee)
        });

        alert("Employee added successfully!");
        closeEmployeeForm();
        clearSearchAndReload();

    } catch (error) {
        alert("Error: " + error.message);
    }
}


// =====================================
// EDIT EMPLOYEE
// =====================================

async function editEmployee(id) {
    try {
        const employee = await apiRequest(`${API_URL}/${id}`);
        openEmployeeForm(employee);

    } catch (error) {
        alert("Error: " + error.message);
    }
}


// =====================================
// UPDATE EMPLOYEE
// =====================================

async function updateEmployee(id, employee) {
    try {
        // Use the ID passed separately; the update payload has editable fields only.
        await apiRequest(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(employee)
        });

        alert("Employee updated successfully!");
        closeEmployeeForm();

        if (searchMode) {
            await searchEmployees(
                document.getElementById("searchEmployee").value
            );
        } else {
            await loadEmployees(currentPage);
        }

    } catch (error) {
        alert("Error: " + error.message);
    }
}


// =====================================
// DELETE EMPLOYEE
// =====================================

async function deleteEmployee(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        alert("Employee deleted successfully!");

        if (searchMode) {
            await searchEmployees(
                document.getElementById("searchEmployee").value
            );
        } else {
            const visibleRows =
                document.querySelectorAll("#employeeTableBody tr").length;

            const pageToLoad =
                currentPage > 0 && visibleRows === 1
                    ? currentPage - 1
                    : currentPage;

            await loadEmployees(pageToLoad);
        }

    } catch (error) {
        alert("Error: " + error.message);
    }
}


// =====================================
// EMPLOYEE FORM
// =====================================

function openEmployeeForm(employee = null) {
    closeEmployeeForm();

    const isEdit = employee !== null;
    const modal = document.createElement("div");

    modal.id = "employeeModal";
    modal.className = "employee-modal";

    modal.innerHTML = `
        <div class="modal-content">
            <h2>${isEdit ? "Edit Employee" : "Add Employee"}</h2>

            <form id="employeeForm">
                <label for="employeeName">Name</label>
                <input type="text" id="employeeName" maxlength="100" required>

                <label for="employeeEmail">Email</label>
                <input type="email" id="employeeEmail" maxlength="150" required>

                <label for="employeeDepartment">Department</label>
                <input type="text" id="employeeDepartment" maxlength="100" required>

                <label for="employeeSalary">Salary</label>
                <input type="number" id="employeeSalary"
                    min="0.01" step="0.01" required>

                <div class="modal-actions">
                    <button type="submit" id="saveEmployeeBtn">
                        ${isEdit ? "Update Employee" : "Save Employee"}
                    </button>

                    <button type="button" id="cancelEmployeeForm">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    if (isEdit) {
        document.getElementById("employeeName").value = employee.name || "";
        document.getElementById("employeeEmail").value = employee.email || "";
        document.getElementById("employeeDepartment").value =
            employee.department || "";
        document.getElementById("employeeSalary").value =
            employee.salary ?? "";
    }

    document.getElementById("cancelEmployeeForm")
        .addEventListener("click", closeEmployeeForm);

    modal.addEventListener("click", event => {
        if (event.target === modal) closeEmployeeForm();
    });

    document.getElementById("employeeForm")
        .addEventListener("submit", async function(event) {
            event.preventDefault();

            const employeeData = {
                name: document.getElementById("employeeName").value.trim(),
                email: document.getElementById("employeeEmail").value.trim(),
                department: document.getElementById("employeeDepartment").value.trim(),
                salary: Number(document.getElementById("employeeSalary").value)
            };

            if (
                !employeeData.name ||
                !employeeData.email ||
                !employeeData.department ||
                !Number.isFinite(employeeData.salary) ||
                employeeData.salary <= 0
            ) {
                alert("Please enter valid employee details.");
                return;
            }

            const saveButton = document.getElementById("saveEmployeeBtn");
            saveButton.disabled = true;
            saveButton.textContent = isEdit ? "Updating..." : "Saving...";

            if (isEdit) {
                await updateEmployee(employee.id, employeeData);
            } else {
                await addEmployee(employeeData);
            }

            // Restore the button if the modal remains open after an error.
            if (document.getElementById("saveEmployeeBtn")) {
                saveButton.disabled = false;
                saveButton.textContent =
                    isEdit ? "Update Employee" : "Save Employee";
            }
        });
}


function closeEmployeeForm() {
    const modal = document.getElementById("employeeModal");
    if (modal) modal.remove();
}


// =====================================
// SEARCH EMPLOYEES BY NAME
// =====================================

async function searchEmployees(name) {
    const query = name.trim();

    if (!query) {
        await loadEmployees(0);
        return;
    }

    searchMode = true;
    totalPages = 0;

    const tableBody = document.getElementById("employeeTableBody");

    tableBody.innerHTML = `
        <tr>
            <td colspan="6">Searching...</td>
        </tr>
    `;

    try {
        const employees = await apiRequest(
            `${API_URL}/search/name?name=${encodeURIComponent(query)}`
        );

        displayEmployees(employees);
        updateStatistics(employees.length, employees);
        renderPagination();

    } catch (error) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">${escapeHTML(error.message)}</td>
            </tr>
        `;
        console.error("Search error:", error);
    }
}


// =====================================
// CLEAR SEARCH AND RELOAD
// =====================================

function clearSearchAndReload() {
    const searchInput = document.getElementById("searchEmployee");
    if (searchInput) searchInput.value = "";

    loadEmployees(0);
}


// =====================================
// SAFE HTML TEXT
// =====================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// =====================================
// BUTTON EVENTS
// =====================================

const addEmployeeButton = document.getElementById("addEmployeeBtn");

if (addEmployeeButton) {
    addEmployeeButton.addEventListener("click", () => {
        openEmployeeForm();
    });
}


const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("jwtToken");
        window.location.href = "index.html";
    });
}


// Refresh button in dashboard.html.
const refreshButton = document.getElementById("refreshBtn");

if (refreshButton) {
    refreshButton.addEventListener("click", clearSearchAndReload);
}


// Search input with debounce.
const searchInput = document.getElementById("searchEmployee");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        clearTimeout(searchTimeout);

        const value = this.value;

        searchTimeout = setTimeout(() => {
            searchEmployees(value);
        }, 400);
    });
}


// =====================================
// INITIALIZE DASHBOARD
// =====================================

if (token) {
    loadEmployees(0);
}