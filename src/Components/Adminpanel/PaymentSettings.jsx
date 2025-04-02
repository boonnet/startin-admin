import React from 'react';

const PaymentSettings = () => {
  return (
    <div className="container-fluid p-4">
      <h4 className="mb-4">Settings Management</h4>
      
      <form>
        
        <div className="mb-3">
          <label htmlFor="stripePublicKey" className="form-label">Public Key</label>
          <input type="text" className="form-control" id="stripePublicKey" placeholder="Stripe Public Key" />
        </div>
        
        <div className="mb-3">
          <label htmlFor="stripePrivateKey" className="form-label">Private Key</label>
          <input type="text" className="form-control" id="stripePrivateKey" placeholder="Stripe Private Key" />
        </div>
        
        <button type="submit" className="btn" style={{backgroundColor:'#0133dc', color:'white'}}>Submit</button>
      </form>
    </div>
  );
};

export default PaymentSettings;