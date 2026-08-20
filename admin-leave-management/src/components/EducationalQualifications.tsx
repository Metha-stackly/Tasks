import "../styles/EducationalQualifications.css";

interface Education {
  qualification: string;
  specialization: string;
  institution: string;
  yearOfCompletion: string;
  grade: string;
  type: string;
}

interface EducationalQualificationsProps {
  employeeName: string;
  education: Education;
}

function EducationalQualifications({
  employeeName,
  education,
}: EducationalQualificationsProps) {
  return (
    <div className="education-section">

      <div className="education-header">

        <span className="education-label">
          EMPLOYEE PROFILE
        </span>

        <h2>
          Educational Qualifications
        </h2>

        <p>
          Educational qualification details for{" "}
          <strong>{employeeName}</strong>
        </p>

      </div>

      <div className="education-card">

        <div className="education-card-title">
          <h3>Educational Details</h3>
        </div>

        <div className="education-grid">

          <div className="education-field">
            <span>Qualification</span>
            <strong>
              {education.qualification}
            </strong>
          </div>

          <div className="education-field">
            <span>Specialization</span>
            <strong>
              {education.specialization}
            </strong>
          </div>

          <div className="education-field">
            <span>Institution</span>
            <strong>
              {education.institution}
            </strong>
          </div>

          <div className="education-field">
            <span>Year of Completion</span>
            <strong>
              {education.yearOfCompletion}
            </strong>
          </div>

          <div className="education-field">
            <span>Grade / CGPA</span>
            <strong>
              {education.grade}
            </strong>
          </div>

          <div className="education-field">
            <span>Education Type</span>
            <strong>
              {education.type}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default EducationalQualifications;