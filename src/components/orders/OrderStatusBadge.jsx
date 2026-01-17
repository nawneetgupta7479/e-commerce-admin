function OrderStatusBadge({ status, size = "default" }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { class: "badge-success", text: "Delivered" };
      case "shipped":
        return { class: "badge-info", text: "Shipped" };
      case "pending":
        return { class: "badge-warning", text: "Pending" };
      default:
        return { class: "badge-ghost", text: status };
    }
  };

  const config = getStatusConfig(status);
  const sizeClass = size === "lg" ? "badge-lg" : size === "sm" ? "badge-sm" : "";

  return <div className={`badge ${config.class} ${sizeClass}`}>{config.text}</div>;
}

export default OrderStatusBadge;