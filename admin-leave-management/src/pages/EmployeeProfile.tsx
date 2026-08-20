import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import employees from "../data/employees.json";

import "../styles/EmployeeProfile.css";

type ProfileSection =
  | "personal"
  | "contact"
  | "kin"
  | "education"
  | "guarantor"
  | "family"
  | "job"
  | "financial";

interface Employee {
  id: number;
  name: string;

  personal: {
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
    bloodGroup: string;
    address: string;
  };

  contact: {
    email: string;
    phone: string;
    alternatePhone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };

  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  };

  education: {
    qualification: string;
    specialization: string;
    institution: string;
    yearOfCompletion: string;
    grade: string;
    type: string;
  };

  family: {
    name: string;
    relationship: string;
    occupation: string;
    phone: string;
  }[];

  guarantor: {
    name: string;
    relationship: string;
    phone: string;
    occupation: string;
    address: string;
  };

  job: {
    department: string;
    jobTitle: string;
    category: string;
    employeeId: string;
    startDate: string;
    workLocation: string;
    manager: string;
    employmentStatus: string;
  };

  financial: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountType: string;
    panNumber: string;
    paymentMode: string;
  };
}

function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();

  const [activeSection, setActiveSection] =
    useState<ProfileSection>("personal");

  const employee = (employees as Employee[]).find(
    (item) => item.id === Number(id)
  );

  if (!employee) {
    return (
      <main className="employee-profile-page">
        <div className="profile-not-found">
          <h1>Employee Not Found</h1>

          <Link
            to="/employees"
            className="profile-back-link"
          >
            ← Back to Employee Management
          </Link>
        </div>
      </main>
    );
  }

  const navigationItems: {
    id: ProfileSection;
    label: string;
  }[] = [
    {
      id: "personal",
      label: "Personal Details",
    },
    {
      id: "contact",
      label: "Contact Details",
    },
    {
      id: "kin",
      label: "Next of Kin Details",
    },
    {
      id: "education",
      label: "Educational Qualifications",
    },
    {
      id: "guarantor",
      label: "Guarantor Details",
    },
    {
      id: "family",
      label: "Family Details",
    },
    {
      id: "job",
      label: "Job Details",
    },
    {
      id: "financial",
      label: "Financial Details",
    },
  ];

  return (
    <main className="employee-profile-page">

      {/* Breadcrumb */}

      <div className="profile-breadcrumb">

        <Link to="/employees">
          Employee Mgmt
        </Link>

        <span>/</span>

        <span>Employee Profile</span>

        <span>/</span>

        <strong>{employee.name}</strong>

      </div>


      <div className="employee-profile-layout">

        {/* LEFT PROFILE NAVIGATION */}

        <aside className="profile-navigation">

          {navigationItems.map((item) => (

            <button
              key={item.id}
              type="button"
              className={`profile-nav-item ${
                activeSection === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveSection(item.id)
              }
            >
              {item.label}
            </button>

          ))}

        </aside>


        {/* RIGHT CONTENT */}

        <section className="personal-details-card">

          {/* PERSONAL DETAILS */}

          {activeSection === "personal" && (

            <div className="profile-content">

              <div className="profile-avatar-large">
                {employee.name.charAt(0).toUpperCase()}
              </div>

              <div className="profile-field employee-name-field">

                <span className="profile-field-label">
                  Employee Name
                </span>

                <h1>
                  {employee.name}
                </h1>

              </div>


              <div className="profile-field">

                <span className="profile-field-label">
                  Department
                </span>

                <h2>
                  {employee.job.department}
                </h2>

              </div>


              <div className="profile-job-grid">

                <div className="profile-field">

                  <span className="profile-field-label">
                    Job Title
                  </span>

                  <strong>
                    {employee.job.jobTitle}
                  </strong>

                </div>


                <div className="profile-field">

                  <span className="profile-field-label">
                    Job Category
                  </span>

                  <strong>
                    {employee.job.category}
                  </strong>

                </div>

              </div>


              <div className="profile-basic-grid">

                <div className="profile-field">

                  <span className="profile-field-label">
                    Start Date
                  </span>

                  <strong>
                    {employee.job.startDate}
                  </strong>

                </div>


                <div className="profile-field">

                  <span className="profile-field-label">
                    Gender
                  </span>

                  <strong>
                    {employee.personal.gender}
                  </strong>

                </div>

              </div>

            </div>

          )}


          {/* CONTACT DETAILS */}

          {activeSection === "contact" && (

            <div className="profile-detail-section">

              <h2>Contact Details</h2>

              <div className="detail-grid">

                <div>
                  <span>Email</span>
                  <strong>{employee.contact.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{employee.contact.phone}</strong>
                </div>

                <div>
                  <span>Alternate Phone</span>
                  <strong>{employee.contact.alternatePhone}</strong>
                </div>

                <div>
                  <span>City</span>
                  <strong>{employee.contact.city}</strong>
                </div>

                <div>
                  <span>State</span>
                  <strong>{employee.contact.state}</strong>
                </div>

                <div>
                  <span>Postal Code</span>
                  <strong>{employee.contact.postalCode}</strong>
                </div>

                <div className="full-width">
                  <span>Address</span>
                  <strong>{employee.contact.address}</strong>
                </div>

              </div>

            </div>

          )}


          {/* NEXT OF KIN */}

          {activeSection === "kin" && (

            <div className="profile-detail-section">

              <h2>Next of Kin Details</h2>

              <div className="detail-grid">

                <div>
                  <span>Name</span>
                  <strong>{employee.nextOfKin.name}</strong>
                </div>

                <div>
                  <span>Relationship</span>
                  <strong>
                    {employee.nextOfKin.relationship}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{employee.nextOfKin.phone}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{employee.nextOfKin.email}</strong>
                </div>

                <div className="full-width">
                  <span>Address</span>
                  <strong>{employee.nextOfKin.address}</strong>
                </div>

              </div>

            </div>

          )}


          {/* EDUCATION */}

          {activeSection === "education" && (

            <div className="profile-detail-section">

              <span className="section-overline">
                EMPLOYEE PROFILE
              </span>

              <h2>Educational Qualifications</h2>

              <p className="section-description">
                Educational qualification details for{" "}
                <strong>{employee.name}</strong>
              </p>


              <div className="education-card">

                <h3>Educational Details</h3>

                <div className="detail-grid">

                  <div>
                    <span>Qualification</span>
                    <strong>
                      {employee.education.qualification}
                    </strong>
                  </div>

                  <div>
                    <span>Specialization</span>
                    <strong>
                      {employee.education.specialization}
                    </strong>
                  </div>

                  <div>
                    <span>Institution</span>
                    <strong>
                      {employee.education.institution}
                    </strong>
                  </div>

                  <div>
                    <span>Year of Completion</span>
                    <strong>
                      {employee.education.yearOfCompletion}
                    </strong>
                  </div>

                  <div>
                    <span>Grade / CGPA</span>
                    <strong>
                      {employee.education.grade}
                    </strong>
                  </div>

                  <div>
                    <span>Education Type</span>
                    <strong>
                      {employee.education.type}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          )}


          {/* GUARANTOR */}

          {activeSection === "guarantor" && (

            <div className="profile-detail-section">

              <h2>Guarantor Details</h2>

              <div className="detail-grid">

                <div>
                  <span>Name</span>
                  <strong>
                    {employee.guarantor.name}
                  </strong>
                </div>

                <div>
                  <span>Relationship</span>
                  <strong>
                    {employee.guarantor.relationship}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {employee.guarantor.phone}
                  </strong>
                </div>

                <div>
                  <span>Occupation</span>
                  <strong>
                    {employee.guarantor.occupation}
                  </strong>
                </div>

                <div className="full-width">
                  <span>Address</span>
                  <strong>
                    {employee.guarantor.address}
                  </strong>
                </div>

              </div>

            </div>

          )}


          {/* FAMILY */}

          {activeSection === "family" && (

            <div className="profile-detail-section">

              <h2>Family Details</h2>

              <div className="family-list">

                {employee.family.map((member, index) => (

                  <div
                    className="family-card"
                    key={index}
                  >

                    <h3>
                      {member.name}
                    </h3>

                    <p>
                      {member.relationship}
                    </p>

                    <span>
                      {member.occupation}
                    </span>

                    <strong>
                      {member.phone}
                    </strong>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* JOB */}

          {activeSection === "job" && (

            <div className="profile-detail-section">

              <h2>Job Details</h2>

              <div className="detail-grid">

                <div>
                  <span>Employee ID</span>
                  <strong>
                    {employee.job.employeeId}
                  </strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>
                    {employee.job.department}
                  </strong>
                </div>

                <div>
                  <span>Job Title</span>
                  <strong>
                    {employee.job.jobTitle}
                  </strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>
                    {employee.job.category}
                  </strong>
                </div>

                <div>
                  <span>Start Date</span>
                  <strong>
                    {employee.job.startDate}
                  </strong>
                </div>

                <div>
                  <span>Work Location</span>
                  <strong>
                    {employee.job.workLocation}
                  </strong>
                </div>

                <div>
                  <span>Manager</span>
                  <strong>
                    {employee.job.manager}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {employee.job.employmentStatus}
                  </strong>
                </div>

              </div>

            </div>

          )}


          {/* FINANCIAL */}

          {activeSection === "financial" && (

            <div className="profile-detail-section">

              <h2>Financial Details</h2>

              <div className="detail-grid">

                <div>
                  <span>Bank Name</span>
                  <strong>
                    {employee.financial.bankName}
                  </strong>
                </div>

                <div>
                  <span>Account Type</span>
                  <strong>
                    {employee.financial.accountType}
                  </strong>
                </div>

                <div>
                  <span>Account Number</span>
                  <strong>
                    {employee.financial.accountNumber}
                  </strong>
                </div>

                <div>
                  <span>IFSC Code</span>
                  <strong>
                    {employee.financial.ifscCode}
                  </strong>
                </div>

                <div>
                  <span>PAN Number</span>
                  <strong>
                    {employee.financial.panNumber}
                  </strong>
                </div>

                <div>
                  <span>Payment Mode</span>
                  <strong>
                    {employee.financial.paymentMode}
                  </strong>
                </div>

              </div>

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default EmployeeProfile;