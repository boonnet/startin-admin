import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManageHelpPage = () => {
  const navigate = useNavigate()
  const helpPages = [
    { id: 1, title: 'Privacy Policy' },
    { id: 2, title: 'Terms And Conditions' },
    { id: 3, title: 'Support' },
    { id: 4, title: 'Service' },
    { id: 5, title: 'FAQ' },
  ];

  const handleOnClick = () =>{
    navigate('/add-help-page')
}
const handleEditOnClick = () =>{
    navigate('/edit-help-page')
}

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Manage Help Page</h5>
        <button className="btn" style={{backgroundColor:'#0133dc', color:'white'}} onClick={handleOnClick}>
          Add Help Page
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {helpPages.map((page) => (
              <tr key={page.id}>
                <td>{page.id}</td>
                <td>{page.title}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={handleEditOnClick}>
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td>
                  {page.id >= 0 && (
                    <button className="btn btn-danger btn-sm">
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageHelpPage;