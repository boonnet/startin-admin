import React, { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const ManageApprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const usersPerPage = 10; // Set to display 10 users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/user/all`);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Unexpected data format received');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDisable = async (uid) => {
    if (!uid) {
      console.error('Error: User UID is undefined.');
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`${baseurl}/api/user/delete/${uid}`);
      setUsers((prevUsers) => prevUsers.filter(user => user.uid !== uid));
      alert("User deleted successfully");
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to render page numbers with ellipsis for large number of pages
  const renderPageNumbers = () => {
    const maxPageButtons = 5; // Show at most 5 page buttons at a time
    
    if (totalPages <= maxPageButtons) {
      // If there are fewer pages than the max, show all pages
      return pageNumbers.map(number => (
        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(number)}>
            {number}
          </button>
        </li>
      ));
    } else {
      // For larger number of pages, show with ellipsis
      let pages = [];
      
      // Always show first page
      pages.push(
        <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      );
      
      // Calculate range of page numbers to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
          </li>
        );
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </li>
        );
      }
      
      return pages;
    }
  };

  return (
    <div className="container-fluid p-4">
      <h4 className="card-title mb-4">Manage Users</h4>

      <div className="mb-4 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search Users"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ boxShadow: 'none' }}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light text-center">
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Username</th>
                <th className="text-center">Email</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.uid}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDisable(user.uid)}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            <p className="mb-0">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </p>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              
              {renderPageNumbers()}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ManageApprovedUsers;