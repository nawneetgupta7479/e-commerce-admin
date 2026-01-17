function OrderItemCard({ item }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
      <div className="avatar">
        <div className="w-16 sm:w-20 rounded-lg">
          <img src={item.image} alt={item.name} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{item.name}</h4>
        <p className="text-sm text-base-content/60">Qty: {item.quantity}</p>
        <p className="text-sm text-base-content/60">
          ${item.price.toFixed(2)} each
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default OrderItemCard;