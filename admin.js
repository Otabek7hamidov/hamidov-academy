// Ma'lumotlar bazasi (localStorage'da saqlanadi)
let departments = JSON.parse(localStorage.getItem('departments')) || [
    {
        id: 1,
        name: "Samarqand shahar",
        director: {
            name: "Abdullayev Javohir",
            phone: "+998 90 123 45 67",
            birthDate: "15.03.1985",
            photo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%231e3c72' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' font-size='30' fill='white' text-anchor='middle' dy='.3em'%3EAJ%3C/text%3E%3C/svg%3E"
        },
        employees: [
            {
                name: "Karimov Otabek",
                position: "Bosh mutaxassis",
                phone: "+998 91 234 56 78",
                birthDate: "18.11.1990",
                photo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%232a5298' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' font-size='30' fill='white' text-anchor='middle' dy='.3em'%3EKO%3C/text%3E%3C/svg%3E"
            }
        ]
    }
];

let regionName = localStorage.getItem('regionName') || "Samarqand viloyati";
let nextId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
let confirmCallback = null;

// LocalStorage'ga saqlash
function saveData() {
    localStorage.setItem('departments', JSON.stringify(departments));
    localStorage.setItem('regionName', regionName);
}

// Viloyat nomini yangilash
function updateRegionName() {
    const newName = document.getElementById('regionNameInput').value.trim();
    if (newName) {
        regionName = newName;
        saveData();
        alert('Viloyat nomi yangilandi!');
    }
}

// Telefon raqam formatlash
function formatPhoneInput(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value;
        
        if (!value.startsWith('+998 ')) {
            value = '+998 ';
        }
        
        let cleaned = value.replace(/[^\d+]/g, '');
        
        if (cleaned.length > 12) {
            cleaned = cleaned.substring(0, 12);
        }
        
        let formatted = '+998 ';
        let digits = cleaned.substring(4);
        
        if (digits.length > 0) formatted += digits.substring(0, 2);
        if (digits.length > 2) formatted += ' ' + digits.substring(2, 5);
        if (digits.length > 5) formatted += ' ' + digits.substring(5, 7);
        if (digits.length > 7) formatted += ' ' + digits.substring(7, 9);
        
        e.target.value = formatted;
    });

    input.addEventListener('keydown', function(e) {
        if (e.target.selectionStart <= 5 && (e.key === 'Backspace' || e.key === 'Delete')) {
            e.preventDefault();
        }
    });
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('regionNameInput').value = regionName;
    
    const phoneInputs = ['directorPhone', 'employeePhone'];
    phoneInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) formatPhoneInput(input);
    });
    
    renderDepartments();
    updateDepartmentSelects();
    renderDirectorsList();
    renderEmployeesList();
});

// Bo'limlarni render qilish
function renderDepartments() {
    const grid = document.getElementById('adminDepartmentsGrid');
    
    const html = departments.map(dept => `
        <div class="department-card" data-dept-name="${dept.name.toLowerCase()}">
            <button class="delete-dept-btn" onclick="confirmDelete('department', ${dept.id})" title="Bo'limni o'chirish">×</button>
            <div class="department-name">${dept.name}</div>
            <p style="color: #666; margin-top: 10px;">
                👤 Rahbar: ${dept.director ? '1' : '0'} | 
                👥 Xodimlar: ${dept.employees.length}
            </p>
        </div>
    `).join('');
    
    grid.innerHTML = html;
}

// Bo'limlar select'ini yangilash
function updateDepartmentSelects() {
    const directorSelect = document.getElementById('directorDept');
    const employeeSelect = document.getElementById('employeeDept');
    
    const options = departments.map(dept => 
        `<option value="${dept.id}">${dept.name}</option>`
    ).join('');
    
    if (directorSelect) directorSelect.innerHTML = '<option value="">Tanlang...</option>' + options;
    if (employeeSelect) employeeSelect.innerHTML = '<option value="">Tanlang...</option>' + options;
}

// Rahbarlar ro'yxatini render qilish
function renderDirectorsList() {
    const list = document.getElementById('directorsListAdmin');
    if (!list) return;

    const html = departments.map(dept => {
        if (!dept.director) return '';
        return `
            <div class="staff-item-admin" data-dir-name="${dept.director.name.toLowerCase()}" data-dept-name="${dept.name.toLowerCase()}">
                <div class="staff-item-info">
                    <img src="${dept.director.photo}" class="staff-item-photo">
                    <div class="staff-item-details">
                        <h4>${dept.director.name}</h4>
                        <p>📍 ${dept.name}</p>
                        <p>📞 ${dept.director.phone}</p>
                        <p>🎂 ${dept.director.birthDate}</p>
                    </div>
                </div>
                <button class="delete-btn" onclick="confirmDelete('director', ${dept.id})">O'chirish</button>
            </div>
        `;
    }).join('');

    list.innerHTML = html || '<p style="text-align:center; color:#666; padding: 40px;">Hozircha rahbarlar yo\'q</p>';
}

// Xodimlar ro'yxatini render qilish
function renderEmployeesList() {
    const list = document.getElementById('employeesListAdmin');
    if (!list) return;

    let html = '';
    departments.forEach(dept => {
        dept.employees.forEach((emp, index) => {
            html += `
                <div class="staff-item-admin" data-emp-name="${emp.name.toLowerCase()}" data-dept-name="${dept.name.toLowerCase()}">
                    <div class="staff-item-info">
                        <img src="${emp.photo}" class="staff-item-photo">
                        <div class="staff-item-details">
                            <h4>${emp.name}</h4>
                            <p>💼 ${emp.position}</p>
                            <p>📍 ${dept.name}</p>
                            <p>📞 ${emp.phone}</p>
                            <p>🎂 ${emp.birthDate}</p>
                        </div>
                    </div>
                    <button class="delete-btn" onclick="confirmDelete('employee', ${dept.id}, ${index})">O'chirish</button>
                </div>
            `;
        });
    });

    list.innerHTML = html || '<p style="text-align:center; color:#666; padding: 40px;">Hozircha xodimlar yo\'q</p>';
}

// Qidiruv funksiyalari
function searchDepartments() {
    const query = document.getElementById('deptSearch').value.toLowerCase();
    const cards = document.querySelectorAll('#adminDepartmentsGrid .department-card');
    let hasResults = false;

    cards.forEach(card => {
        const deptName = card.getAttribute('data-dept-name');
        if (deptName.includes(query)) {
            card.classList.remove('hidden');
            hasResults = true;
        } else {
            card.classList.add('hidden');
        }
    });

    document.getElementById('noResultsDept').style.display = hasResults ? 'none' : 'block';
}

function searchDirectors() {
    const query = document.getElementById('dirSearch').value.toLowerCase();
    const items = document.querySelectorAll('#directorsListAdmin .staff-item-admin');
    let hasResults = false;

    items.forEach(item => {
        const name = item.getAttribute('data-dir-name');
        const dept = item.getAttribute('data-dept-name');
        if (name.includes(query) || dept.includes(query)) {
            item.classList.remove('hidden');
            hasResults = true;
        } else {
            item.classList.add('hidden');
        }
    });

    document.getElementById('noResultsDir').style.display = hasResults ? 'none' : 'block';
}

function searchEmployees() {
    const query = document.getElementById('empSearch').value.toLowerCase();
    const items = document.querySelectorAll('#employeesListAdmin .staff-item-admin');
    let hasResults = false;

    items.forEach(item => {
        const name = item.getAttribute('data-emp-name');
        const dept = item.getAttribute('data-dept-name');
        if (name.includes(query) || dept.includes(query)) {
            item.classList.remove('hidden');
            hasResults = true;
        } else {
            item.classList.add('hidden');
        }
    });

    document.getElementById('noResultsEmp').style.display = hasResults ? 'none' : 'block';
}

// Tasdiqlash
function confirmDelete(type, deptId, empIndex) {
    let message = '';
    
    if (type === 'department') {
        const dept = departments.find(d => d.id === deptId);
        message = `"${dept.name}" bo'limini o'chirmoqchimisiz?`;
        confirmCallback = () => deleteDepartment(deptId);
    } else if (type === 'director') {
        const dept = departments.find(d => d.id === deptId);
        message = `"${dept.director.name}" rahbarni o'chirmoqchimisiz?`;
        confirmCallback = () => deleteDirector(deptId);
    } else if (type === 'employee') {
        const dept = departments.find(d => d.id === deptId);
        const emp = dept.employees[empIndex];
        message = `"${emp.name}" xodimni o'chirmoqchimisiz?`;
        confirmCallback = () => deleteEmployee(deptId, empIndex);
    }

    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').style.display = 'block';
}

document.getElementById('confirmYes').onclick = function() {
    if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
    }
    closeModal('confirmModal');
};

// Tab almashtirish
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

// Modal'larni ochish
function openAddDepartmentModal() {
    document.getElementById('addDepartmentModal').style.display = 'block';
}

function openAddDirectorModal() {
    updateDepartmentSelects();
    document.getElementById('addDirectorModal').style.display = 'block';
}

function openAddEmployeeModal() {
    updateDepartmentSelects();
    document.getElementById('addEmployeeModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Rasm preview
function previewPhoto(event, previewId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(previewId).src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Sana formatlash
function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Bo'lim qo'shish
function addDepartment(event) {
    event.preventDefault();
    const name = document.getElementById('deptName').value;
    
    departments.push({
        id: nextId++,
        name: name,
        director: null,
        employees: []
    });
    
    saveData();
    renderDepartments();
    updateDepartmentSelects();
    closeModal('addDepartmentModal');
    document.getElementById('deptName').value = '';
    alert('Bo\'lim muvaffaqiyatli qo\'shildi!');
}

// Bo'lim o'chirish
function deleteDepartment(deptId) {
    departments = departments.filter(d => d.id !== deptId);
    saveData();
    renderDepartments();
    updateDepartmentSelects();
    renderDirectorsList();
    renderEmployeesList();
}

// Rahbar qo'shish
function addDirector(event) {
    event.preventDefault();
    const deptId = parseInt(document.getElementById('directorDept').value);
    const name = document.getElementById('directorName').value;
    const phone = document.getElementById('directorPhone').value;
    const birthDate = formatDateForDisplay(document.getElementById('directorBirth').value);
    const photoFile = document.getElementById('directorPhoto').files[0];
    
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return;

    if (dept.director) {
        alert('Bu bo\'limda allaqachon rahbar mavjud!');
        return;
    }

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dept.director = { name, phone, birthDate, photo: e.target.result };
            saveData();
            renderDepartments();
            renderDirectorsList();
        };
        reader.readAsDataURL(photoFile);
    } else {
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
        dept.director = {
            name, phone, birthDate,
            photo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%231e3c72' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' font-size='30' fill='white' text-anchor='middle' dy='.3em'%3E${initials}%3C/text%3E%3C/svg%3E`
        };
        saveData();
        renderDepartments();
        renderDirectorsList();
    }

    closeModal('addDirectorModal');
    event.target.reset();
    document.getElementById('directorPhone').value = '+998 ';
    document.getElementById('directorPhotoPreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ERasm%3C/text%3E%3C/svg%3E";
    alert('Rahbar muvaffaqiyatli qo\'shildi!');
}

// Rahbar o'chirish
function deleteDirector(deptId) {
    const dept = departments.find(d => d.id === deptId);
    if (dept) {
        dept.director = null;
        saveData();
        renderDepartments();
        renderDirectorsList();
    }
}

// Xodim qo'shish
function addEmployee(event) {
    event.preventDefault();
    const deptId = parseInt(document.getElementById('employeeDept').value);
    const name = document.getElementById('employeeName').value;
    const position = document.getElementById('employeePosition').value;
    const phone = document.getElementById('employeePhone').value;
    const birthDate = formatDateForDisplay(document.getElementById('employeeBirth').value);
    const photoFile = document.getElementById('employeePhoto').files[0];
    
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return;

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dept.employees.push({ name, position, phone, birthDate, photo: e.target.result });
            saveData();
            renderDepartments();
            renderEmployeesList();
        };
        reader.readAsDataURL(photoFile);
    } else {
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
        dept.employees.push({
            name, position, phone, birthDate,
            photo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%232a5298' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' font-size='30' fill='white' text-anchor='middle' dy='.3em'%3E${initials}%3C/text%3E%3C/svg%3E`
        });
        saveData();
        renderDepartments();
        renderEmployeesList();
    }

    closeModal('addEmployeeModal');
    event.target.reset();
    document.getElementById('employeePhone').value = '+998 ';
    document.getElementById('employeePhotoPreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ERasm%3C/text%3E%3C/svg%3E";
    alert('Xodim muvaffaqiyatli qo\'shildi!');
}

// Xodim o'chirish
function deleteEmployee(deptId, empIndex) {
    const dept = departments.find(d => d.id === deptId);
    if (dept) {
        dept.employees.splice(empIndex, 1);
        saveData();
        renderDepartments();
        renderEmployeesList();
    }
}

// Chiqish
function logout() {
    window.location.href = 'index.html';
}

// Modal'ni yopish (tashqarisiga bosganda)
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
