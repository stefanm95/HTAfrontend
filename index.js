"use strict";

const tableBody = document.getElementById("employeeTableBody");

// loadEmployeeDetails();

const displayTable = function ({ id, name, jobTitle, project }) {
  const row = document.createElement("tr");

  const idCell = document.createElement("td");
  idCell.textContent = id;
  row.appendChild(idCell);

  const nameCell = document.createElement("td");
  const nameLink = document.createElement("a");
  nameLink.href = `employee.html?id=${id}`;
  nameLink.textContent = `${name.firstName} ${name.lastName}`;
  nameCell.appendChild(nameLink);
  row.appendChild(nameCell);

  const jobTitleCell = document.createElement("td");
  jobTitleCell.textContent = jobTitle;
  row.appendChild(jobTitleCell);

  const projectCell = document.createElement("td");
  projectCell.textContent = project.name;
  row.appendChild(projectCell);

  return row;
};

const displayTableRows = async function () {
  try {
    const response = await fetch("http://localhost:8080/employees");
    console.log("Response status: ", response.status);
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }
    const data = await response.json();
    console.log(data);
    data.forEach(function (employee) {
      const row = displayTable({
        id: employee.id,
        name: {
          firstName: employee.firstName,
          lastName: employee.lastName,
        },
        jobTitle: employee.jobTitle,
        project: employee.project,
      });
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.log(err);
  }
};

const searchEmployees = async function (keyword, property) {
  try {
    const response = await fetch("http://localhost:8080/employees");
    console.log("Search employees response status: ", response.status);
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }
    const data = await response.json();

    const filteredEmployees = data.filter((employee) => {
      const value = String(employee[property]).toUpperCase();
      if (property === "name") {
        const fullName = `${employee.firstName} ${employee.lastName}`;
        return fullName.toUpperCase().includes(keyword.toUpperCase());
      }
      return value.includes(keyword.toUpperCase());
    });

    tableBody.innerHTML = ""; // Clear existing table rows

    if (filteredEmployees.length > 0) {
      filteredEmployees.forEach((employee) => {
        const row = displayTable({
          id: employee.id,
          name: {
            firstName: employee.firstName,
            lastName: employee.lastName,
          },
          jobTitle: employee.jobTitle,
          project: employee.project,
        });
        tableBody.appendChild(row);
      });
    } else {
      const row = document.createElement("tr");

      const noResultsCell = document.createElement("td");
      noResultsCell.colSpan = 4;
      noResultsCell.textContent = "No results found.";
      row.appendChild(noResultsCell);

      tableBody.appendChild(row);
    }
  } catch (err) {
    console.log(err);
  }
};

const addEmployee = async function (employee) {
  try {
    tableBody.innerHTML = "";
    //add employees to the backend
    const response = await fetch("http://localhost:8080/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });
    if (response.ok) {
      const addedEmployee = await response.json();
      console.log(`Added Employee: ${addedEmployee}`);
      displayTableRows();
    } else {
      console.log(`Failed to add employee. Status: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
  }
};

const removeEmployee = async function (id) {
  try {
    const response = await fetch(`http://localhost:8080/employees/${id}`, {
      method: "DELETE",
    });
    if (response.status === 404) {
      alert("Employee not found. Please enter a valid employee ID.");
      return;
    }
    console.log(`Response status: ${response.status}`);
    if (response.ok) {
      console.log(`Employee with ID ${id} has been removed. `);
      displayTableRows();
    }
  } catch (err) {
    console.log(err);
  }
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  //Get form values
  const firstName = document.getElementById("firstNameInput").value;
  const lastName = document.getElementById("lastNameInput").value;
  const jobTitle = document.getElementById("jobTitleInput").value;
  const projectID = document.getElementById("projectInput").value;
  const salary = document.getElementById("salaryInput").value;
  const hireDate = document.getElementById("hireDateInput").value;
  const email = document.getElementById("emailInput").value;

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid address: example@exe.ex");
    return;
  }
  try {
    const projectResponse = await fetch(
      `http://localhost:8080/projects/${projectID}`
    );
    if (!projectResponse.ok) {
      throw new Error(`Failed to fetch project with ID ${projectID}`);
    }
    const projectData = await projectResponse.json();
    console.log(projectData);
    const employee = [
      {
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        salary: salary,
        hireDate: hireDate,
        email: email,
        project: projectData,
      },
    ];
    await addEmployee(employee);
  } catch (err) {
    console.log(err);
  }
};

const handleSearch = (event) => {
  event.preventDefault();
  const searchKeyword = document.getElementById("searchKeyword").value;
  const searchProperty = document.getElementById("searchProperty").value;
  searchEmployees(searchKeyword, searchProperty);
};

const removeEmployeeHandler = async (event) => {
  event.preventDefault();
  const employeeId = prompt("Enter the ID of the employee to remove: ");
  if (!employeeId) {
    alert("Provide a valid id number");
    return; // exit if no employee ID is provided
  }
  if (employeeId <= 0 || isNaN(employeeId)) {
    alert("Please provide a valid positive integer.");
    return;
  }

  tableBody.innerHTML = ""; // Clear the table before removing the employee
  await removeEmployee(employeeId);
  displayTableRows(); // Refresh the table after successful removal
};

document.addEventListener("DOMContentLoaded", () => {
  displayTableRows();
  document
    .getElementById("addEmployeeForm")
    .addEventListener("submit", handleFormSubmit);
  document
    .getElementById("searchForm")
    .addEventListener("submit", handleSearch);
  document
    .getElementById("removeEmployeeBtn")
    .addEventListener("click", removeEmployeeHandler);
});
