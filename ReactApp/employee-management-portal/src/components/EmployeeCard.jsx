import { Link } from "react-router-dom";
import "../styles/EmployeeCard.css";

function EmployeeCard({
    id,
    name,
    email,
    company,
    onDelete
}){

    return(

        <div className="employee-card">

            <div className="employee-info">

                <h2>{name}</h2>

                <p>{email}</p>

                <p>{company}</p>

            </div>

            <div className="employee-buttons">

                <Link to={`/employee/${id}`}>

                    <button className="view-btn">

                        View Details

                    </button>

                </Link>

                <button

                    className="delete-btn"

                    onClick={()=>onDelete(id)}

                >

                    Delete

                </button>

            </div>

        </div>

    );

}

export default EmployeeCard;