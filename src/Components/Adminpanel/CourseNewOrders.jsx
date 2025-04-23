import React, { useState } from 'react';
import { ShoppingBag, Search, ChevronLeft, ChevronRight, AlertCircle, Eye } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CourseNewOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1, 
      orderId: '65d97e1e546cb760930b8c6c',
      instructorName: 'Jackie',
      studentName: 'Testing16',
      orderDate: 'Feb 24, 2024',
      orderCost: '450 AUD'
    },
    {
      id: 2, 
      orderId: '65b642741be44b4b5072a4d2',
      instructorName: 'John Moffit',
      studentName: 'Jackie',
      orderDate: 'Jan 28, 2024',
      orderCost: '617.5 USD'
    },
    {
      id: 3, 
      orderId: '655b3a9c8e85330aa958c052',
      instructorName: 'Jackie',
      studentName: 'John Moffit',
      orderDate: 'Nov 20, 2023',
      orderCost: '237.5 USD'
    },
    {
      id: 4, 
      orderId: '655734aa7f42d84163179882',
      instructorName: 'Jackie',
      studentName: 'John Moffit',
      orderDate: 'Nov 17, 2023',
      orderCost: '427.5 AUD'
    },
    {
      id: 5, 
      orderId: '65321e94bc64036c6b778071',
      instructorName: 'John Moffit',
      studentName: 'Appysa',
      orderDate: 'Oct 20, 2023',
      orderCost: '237.5 USD'
    },
    {
      id: 6, 
      orderId: '65259d2d42102302e4475b2',
      instructorName: 'Appysa',
      studentName: 'John Moffit',
      orderDate: 'Oct 11, 2023',
      orderCost: '332.5 USD'
    },
    {
      id: 7, 
      orderId: '6421be9b5fbbed04fe6f3362',
      instructorName: 'John Moffit',
      studentName: 'Jackie',
      orderDate: 'Mar 27, 2023',
      orderCost: '285 USD'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ordersPerPage = 5;

  const handleView = (id) => {
    // Implement view functionality
    console.log(`Viewing order with id ${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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
          <ShoppingBag size={24} className="text-primary" />
          <h4 className="fw-bold mb-0">New Orders</h4>
        </div>
        <p className="text-muted mb-0">View and manage all new course orders in the system</p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary rounded-pill me-2">{filteredOrders.length}</span>
            <span className="fw-medium">Total Orders</span>
          </div>
          
          <div className="position-relative">
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search orders..."
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
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Order ID</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Instructor Name</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Student Name</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Order Date</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Order Cost</th>
                  <th className="px-4 text-center" style={{ width: '10%', borderLeft: '3px solid transparent' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <tr key={order.id} 
                        style={{ borderLeft: '3px solid transparent', transition: 'all 0.2s' }} 
                        className="order-row"
                    >
                      <td className="px-4 py-3">{indexOfFirstOrder + index + 1}</td>
                      <td className="px-4 py-3"><span className="fw-medium text-primary">{order.orderId}</span></td>
                      <td className="px-4 py-3">{order.instructorName}</td>
                      <td className="px-4 py-3">{order.studentName}</td>
                      <td className="px-4 py-3">{order.orderDate}</td>
                      <td className="px-4 py-3 fw-medium">{order.orderCost}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleView(order.id)}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="View Order Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center">
                        <AlertCircle size={40} className="text-muted mb-3" />
                        <p className="text-muted mb-1">No orders found</p>
                        <small className="text-muted">Try adjusting your search criteria</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {currentOrders.length > 0 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing <span className="fw-bold text-primary">{indexOfFirstOrder + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastOrder, filteredOrders.length)}</span> of <span className="fw-bold">{filteredOrders.length}</span> entries
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
        .order-row:hover {
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

export default CourseNewOrders;