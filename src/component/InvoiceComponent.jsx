import  { useState } from 'react';
import { FaTrashAlt, FaPlus, FaEdit } from 'react-icons/fa';
import './InvoiceComponent.css';

const InvoiceComponent = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Sample', quantity: 1, cost: 0, gstRate: 18 }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ id: null, name: '', quantity: 1, cost: 0, gstRate: 18 });
  const [isEditMode, setIsEditMode] = useState(false);

  const addNewItem = () => {
    setIsEditMode(false);
    setNewItem({ id: null, name: '', quantity: 1, cost: 0, gstRate: 18 });
    setIsModalOpen(true);
  };

  const saveItem = () => {
    if (isEditMode && newItem.id !== null) {
      setItems(items.map(item => (item.id === newItem.id ? newItem : item)));
    } else {
      const itemWithId = { ...newItem, id: items.length + 1 };
      setItems([...items, itemWithId]);
    }
    setNewItem({ id: null, name: '', quantity: 1, cost: 0, gstRate: 18 });
    setIsModalOpen(false);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const editItem = (item) => {
    setIsEditMode(true);
    setNewItem(item);
    setIsModalOpen(true);
  };

  const updateItemField = (field, value) => {
    setNewItem({ ...newItem, [field]: value });
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  };

  const calculateGSTSummary = () => {
    const gstRates = [...new Set(items.map(item => item.gstRate))];
    return gstRates.map(rate => {
      const itemsWithRate = items.filter(item => item.gstRate === rate);
      const taxableAmount = itemsWithRate.reduce((sum, item) =>
        sum + (item.quantity * item.cost), 0);
      const gstAmount = (taxableAmount * rate) / 100;
      return { rate, taxableAmount, gstAmount };
    });
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const totalGST = calculateGSTSummary().reduce((sum, { gstAmount }) =>
      sum + gstAmount, 0);
    return subtotal + totalGST;
  };

  return (
    <div className="invoice-container">
      <h1 className="invoice-title">Invoice Generator</h1>

      {/* Line Items */}
      <div className="line-items-section">
        <div className="grid-header">
          <div className="col-name">Item Name</div>
          <div className="col-quantity">Quantity</div>
          <div className="col-cost">Cost (₹)</div>
          <div className="col-gst">GST Rate (%)</div>
          <div className="col-actions">Actions</div>
        </div>

        {items.map(item => (
          <div key={item.id} className="grid-row">
            <input
              type="text"
              className="input-field name-input"
              value={item.name}
              onChange={(e) => updateItemField('name', e.target.value)}
              placeholder="Enter item name"
            />
            <input
              type="number"
              className="input-field quantity-input"
              value={item.quantity}
              min="1"
              onChange={(e) => updateItemField('quantity', parseInt(e.target.value) || 0)}
            />
            <input
              type="number"
              className="input-field cost-input"
              value={item.cost}
              min="0"
              onChange={(e) => updateItemField('cost', parseFloat(e.target.value) || 0)}
            />
            <select
              className="input-field gst-select"
              value={item.gstRate}
              onChange={(e) => updateItemField('gstRate', parseInt(e.target.value))}
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
            <button className="edit-button" onClick={() => editItem(item)}>
              <FaEdit className="edit-icon" />
            </button>
            <button className="delete-button" onClick={() => removeItem(item.id)}>
              <FaTrashAlt className="trash-icon" />
            </button>
          </div>
        ))}

        <button className="add-item-button" onClick={addNewItem}>
          <FaPlus className="plus-icon" />
          Add Item
        </button>
      </div>

      {/* Modal for Adding or Editing Item */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditMode ? 'Edit Item' : 'Add New Item'}</h2>
            <input
              type="text"
              className="input-field name-input"
              value={newItem.name}
              onChange={(e) => updateItemField('name', e.target.value)}
              placeholder="Enter item name"
            />
            <input
              type="number"
              className="input-field quantity-input"
              value={newItem.quantity}
              min="1"
              onChange={(e) => updateItemField('quantity', parseInt(e.target.value) || 0)}
            />
            <input
              type="number"
              className="input-field cost-input"
              value={newItem.cost}
              min="0"
              onChange={(e) => updateItemField('cost', parseFloat(e.target.value) || 0)}
            />
            <select
              className="input-field gst-select"
              value={newItem.gstRate}
              onChange={(e) => updateItemField('gstRate', parseInt(e.target.value))}
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
            <button className="save-button" onClick={saveItem}>Save</button>
            <button className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* GST Summary */}
      <div className="gst-summary-section">
        <h2 className="section-title">GST Summary</h2>
        <div className="summary-grid-header">
          <div>Rate</div>
          <div>Taxable Amount</div>
          <div>GST Amount</div>
        </div>
        {calculateGSTSummary().map(({ rate, taxableAmount, gstAmount }, index) => (
          <div key={index} className="summary-grid-row">
            <div>{rate}%</div>
            <div>₹{taxableAmount.toFixed(2)}</div>
            <div>₹{gstAmount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="total-summary-section">
        <div className="total-grid">
          <div className="label">Subtotal:</div>
          <div className="amount">₹{calculateSubtotal().toFixed(2)}</div>
          <div className="label">Total GST:</div>
          <div className="amount">₹{calculateGSTSummary().reduce((sum, { gstAmount }) =>
            sum + gstAmount, 0).toFixed(2)}</div>
          <div className="label total">Total Amount:</div>
          <div className="amount total">₹{calculateTotal().toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComponent;
