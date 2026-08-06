let students = [];

const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const searchStudent = document.getElementById("searchStudent");

// Add Student
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const student = {
        id: document.getElementById("studentId").value,
        name: document.getElementById("fullName").value,
        age: document.getElementById("age").value,
        department: document.getElementById("department").value,
        email: document.getElementById("email").value
    };

    students.push(student);

    displayStudents();

    studentForm.reset();
});

// Display Students
function displayStudents(studentList = students) {

    studentTableBody.innerHTML = "";

    studentList.forEach(function (student, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.department}</td>
            <td>${student.email}</td>
            <td><button onclick="deleteStudent(${index})">Delete</button></td>
        `;

        studentTableBody.appendChild(row);
    });
}

// Delete Student
function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
}

// Search Student
searchStudent.addEventListener("keyup", function () {

    const searchValue = searchStudent.value.toLowerCase();

    const filteredStudents = students.filter(function (student) {
        return student.name.toLowerCase().includes(searchValue);
    });

    displayStudents(filteredStudents);
});