import React, { useState } from 'react';
import { DollarSign, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const ViewPayments = () => {
  const [payments] = useState([
    {
      id: 1,
      user_id: "USR001",
      subscription_id: "SUB123",
      course_id: "CRS456",
      amount: 299.99,
      payment_status: "completed",
      transaction_id: "TXN789",
      payment_method: "credit_card",
      createdAt: "2024-02-20T10:30:00",
      updatedAt: "2024-02-20T10:30:00"
    },
    // Add more sample payments for pagination demo
    {
      id: 2,
      user_id: "USR002",
      subscription_id: "SUB124",
      course_id: "CRS457",
      amount: 199.99,
      payment_status: "pending",
      transaction_id: "TXN790",
      payment_method: "paypal",
      createdAt: "2024-02-20T11:30:00",
      updatedAt: "2024-02-20T11:30:00"
    },
    // Adding more sample data for better pagination demonstration
    {
      id: 3,
      user_id: "USR003",
      subscription_id: "SUB125",
      course_id: "CRS458",
      amount: 149.99,
      payment_status: "completed",
      transaction_id: "TXN791",
      payment_method: "credit_card",
      createdAt: "2024-02-21T09:15:00",
      updatedAt: "2024-02-21T09:15:00"
    },
    {
      id: 4,
      user_id: "USR004",
      subscription_id: "SUB126",
      course_id: "CRS459",
      amount: 99.99,
      payment_status: "failed",
      transaction_id: "TXN792",
      payment_method: "bank_transfer",
      createdAt: "2024-02-22T14:20:00",
      updatedAt: "2024-02-22T14:20:00"
    },
    {
      id: 5,
      user_id: "USR005",
      subscription_id: "SUB127",
      course_id: "CRS460",
      amount: 349.99,
      payment_status: "completed",
      transaction_id: "TXN793",
      payment_method: "paypal",
      createdAt: "2024-02-23T16:45:00",
      updatedAt: "2024-02-23T16:45:00"
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const paymentsPerPage = 3; // For demonstration purposes

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'failed':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment =>
    payment.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.subscription_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.course_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  // Function to render page numbers with ellipsis for large number of pages
  const renderPageNumbers = () => {
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <button 
          key={number} 
          className={`btn ${currentPage === number ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </button>
      ));
    } else {
      let pages = [];
      
      // Always show first page
      pages.push(
        <button 
          key={1} 
          className={`btn ${currentPage === 1 ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      
      // Calculate range of page numbers to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push(
          <button key="ellipsis1" className="btn btn-light mx-1 disabled">...</button>
        );
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button 
            key={i} 
            className={`btn ${currentPage === i ? 'btn-primary' : 'btn-light'} mx-1`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push(
          <button key="ellipsis2" className="btn btn-light mx-1 disabled">...</button>
        );
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <button 
            key={totalPages} 
            className={`btn ${currentPage === totalPages ? 'btn-primary' : 'btn-light'} mx-1`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
      
      return pages;
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="bg-light p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <DollarSign size={24} className="text-primary" />
          <h4 className="fw-bold mb-0">Payment Details</h4>
        </div>
        <p className="text-muted mb-0">View and manage all payment transactions in the system</p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary rounded-pill me-2">{filteredPayments.length}</span>
            <span className="fw-medium">Total Payments</span>
          </div>
          
          <div className="position-relative">
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: '300px', paddingLeft: '40px' }}
            />
            <Search size={18} className="position-absolute text-muted" style={{ left: '12px', top: '10px' }} />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0 table-striped">
              <thead>
                <tr className="text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>#</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>User ID</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Subscription ID</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Course ID</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Amount</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Status</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Transaction ID</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Payment Method</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length > 0 ? (
                  currentPayments.map((payment, index) => (
                    <tr key={payment.id} 
                        style={{ borderLeft: '3px solid transparent', transition: 'all 0.2s' }} 
                        className="payment-row"
                    >
                      <td className="px-4 py-3">{indexOfFirstPayment + index + 1}</td>
                      <td className="px-4 py-3 fw-medium">{payment.user_id}</td>
                      <td className="px-4 py-3">{payment.subscription_id}</td>
                      <td className="px-4 py-3">{payment.course_id}</td>
                      <td className="px-4 py-3 fw-medium">${payment.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${getStatusBadgeClass(payment.payment_status)} rounded-pill px-3 py-2`}>
                          {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-primary">{payment.transaction_id}</td>
                      <td className="px-4 py-3 text-capitalize">{payment.payment_method.replace('_', ' ')}</td>
                      <td className="px-4 py-3">{formatDate(payment.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center">
                        <AlertCircle size={40} className="text-muted mb-3" />
                        <p className="text-muted mb-1">No payments found</p>
                        <small className="text-muted">Try adjusting your search criteria</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {currentPayments.length > 0 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing <span className="fw-bold text-primary">{indexOfFirstPayment + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastPayment, filteredPayments.length)}</span> of <span className="fw-bold">{filteredPayments.length}</span> entries
                </small>
              </div>
              
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="d-flex">
                  {renderPageNumbers()}
                </div>
                
                <button
                  className="btn btn-outline-primary ms-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .payment-row:hover {
          background-color: #f8f9ff !important;
          border-left: 3px solid #0d6efd !important;
          cursor: pointer;
        }
        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
};

export default ViewPayments;