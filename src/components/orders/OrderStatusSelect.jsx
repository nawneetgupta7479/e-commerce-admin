function OrderStatusSelect({ status, onChange, isUpdating }) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className="select select-sm select-bordered"
      disabled={isUpdating}
    >
      <option value="pending">Pending</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
    </select>
  );
}

export default OrderStatusSelect;