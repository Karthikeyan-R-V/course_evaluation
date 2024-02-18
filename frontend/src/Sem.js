import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Sem({ sem, setSem, year, setYear }) {
  const handleChange = (e) => {
    setSem(e.target.value);
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            className="form-control"
            value={year}
          >
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="sem">Semester:</label>
          <select
            id="sem"
            className="form-control"
            onChange={handleChange}
            value={sem}
          >
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Sem;
