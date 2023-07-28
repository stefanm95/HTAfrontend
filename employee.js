"use strict"

const id = document.querySelector("#employeeId");
const emplName = document.querySelector("#employeeName");
const project = document.querySelector("#employeeProject");
const jobTitle = document.querySelector("#employeeJobTitle");
const salary = document.querySelector("#employeeSalary");
const hireDate = document.querySelector("#employeeHireDate");
const email = document.querySelector("#employeeEmail");



const loadEmployeeDetails = async function () {
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   console.log("queryString:", queryString);
//   const employeeId = urlParams.get("id");
//   console.log("employeeId:", employeeId);
    const employeeId = new URLSearchParams(window.location.search).get("id");

  try {
    const response = await fetch(`http://localhost:8080/employees`);
    console.log(response)
    const data = await response.json();
    console.log(data);
    const employee = data.find((emp) => emp.id === parseInt(employeeId));
    if(employee){
      id.textContent = "Employee ID: " + employee.id;
      emplName.textContent = `Name: ${employee.firstName} ${employee.lastName}`;
      jobTitle.textContent = "Job Title: " + employee.jobTitle;
      project.textContent = "Project: " + employee.project.name;
      salary.textContent = "Salary: " + employee.salary;
      hireDate.textContent = "Hire Date: " + employee.hireDate;
      email.textContent = "Email: " + employee.email;
    }else{
      console.log("Employee not found");
    }
    // const employeeImage = document.createElement("img");
    // employeeImage.setAttribute("src", employee.image);
    // employeeImage.setAttribute("alt", employee.name);
    // employeeImage.classList.add("employee-image");
    // document
    //   .getElementById("employeeImageContainer")
    //   .appendChild(employeeImage);
  } catch (err) {
    console.log(err);
  }
};
loadEmployeeDetails();