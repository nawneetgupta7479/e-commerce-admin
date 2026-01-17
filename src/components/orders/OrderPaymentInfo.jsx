import { CreditCardIcon, ReceiptIcon, ExternalLinkIcon } from "lucide-react";

function OrderPaymentInfo({ paymentResult, totalPrice }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-lg">
          <CreditCardIcon className="w-5 h-5" />
          Payment Info
        </h3>
        <div className="space-y-3 mt-2">
          <div className="flex justify-between">
            <span className="text-base-content/70">Payment Status</span>
            <span
              className={`badge ${
                paymentResult?.status === "succeeded" ? "badge-success" : "badge-warning"
              }`}
            >
              {paymentResult?.status || "Unknown"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/70">Payment ID</span>
            <span className="font-mono text-sm">{paymentResult?.id?.slice(-12) || "N/A"}</span>
          </div>
          <div className="divider my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          {paymentResult?.receiptUrl && (
            <a
              href={paymentResult.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline gap-2 w-full mt-2"
            >
              <ReceiptIcon className="w-4 h-4" />
              View Receipt
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderPaymentInfo;