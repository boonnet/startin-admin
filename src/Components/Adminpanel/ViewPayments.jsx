import React, { useState } from 'react';

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
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'failed':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.subscription_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-4">
      <div>
        <div>
          <h4 className="card-title mb-4">Payment Details</h4>
          <div className="mb-4 d-flex justify-content-end">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search Payments"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light text-center">
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">User ID</th>
                  <th className="text-center">Subscription ID</th>
                  <th className="text-center">Course ID</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Transaction ID</th>
                  <th className="text-center">Payment Method</th>
                  <th className="text-center">Created At</th>
                  <th className="text-center">Updated At</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.user_id}</td>
                    <td>{payment.subscription_id}</td>
                    <td>{payment.course_id}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(payment.payment_status)}`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td>{payment.transaction_id}</td>
                    <td>
                      <span className="text-capitalize">
                        {payment.payment_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td>{formatDate(payment.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-4">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
              </li>
              <li className="page-item active">
                <button className="page-link">1</button>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(2)}
                >
                  2
                </button>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ViewPayments;