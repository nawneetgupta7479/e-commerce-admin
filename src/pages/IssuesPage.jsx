import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issueApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import {
  TicketIcon,
  CheckCircleIcon,
  ClockIcon,
  XIcon,
  MailIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  MessageSquareIcon,
} from "lucide-react";

const ISSUE_TYPE_LABELS = {
  order: "Order Issue",
  payment: "Payment Issue",
  delivery: "Delivery Issue",
  product: "Product Issue",
  account: "Account Issue",
  other: "Other",
};

const ISSUE_TYPE_COLORS = {
  order: "badge-primary",
  payment: "badge-error",
  delivery: "badge-warning",
  product: "badge-info",
  account: "badge-secondary",
  other: "badge-ghost",
};

function IssuesPage() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  const queryClient = useQueryClient();

  // Fetch issues
  const { data, isLoading } = useQuery({
    queryKey: ["issues", filterStatus, filterType],
    queryFn: () => issueApi.getAll({ status: filterStatus, type: filterType }),
  });

  // Mark as resolved mutation
  const resolveMutation = useMutation({
    mutationFn: issueApi.markResolved,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      setSelectedIssue(null);
    },
  });

  const issues = data?.issues || [];
  const pendingCount = issues.filter((i) => i.status === "pending").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  const handleResolve = (issueId) => {
    if (window.confirm("Are you sure you want to mark this issue as resolved?")) {
      resolveMutation.mutate(issueId);
    }
  };

  const openIssueDetail = (issue) => {
    setSelectedIssue(issue);
  };

  const closeModal = () => {
    setSelectedIssue(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Support Tickets</h1>
          <p className="text-base-content/70 mt-1 text-sm sm:text-base">
            Manage customer support requests
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex gap-2">
          <div className="badge badge-warning gap-1 p-3">
            <ClockIcon className="w-4 h-4" />
            {pendingCount} Pending
          </div>
          <div className="badge badge-success gap-1 p-3">
            <CheckCircleIcon className="w-4 h-4" />
            {resolvedCount} Resolved
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text text-sm">Filter by Status</span>
              </label>
              <select
                className="select select-bordered select-sm sm:select-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text text-sm">Filter by Type</span>
              </label>
              <select
                className="select select-bordered select-sm sm:select-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="order">Order Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="delivery">Delivery Issue</option>
                <option value="product">Product Issue</option>
                <option value="account">Account Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ISSUES LIST */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : issues.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center py-12 text-base-content/60">
              <TicketIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg sm:text-xl font-semibold mb-2">No tickets found</p>
              <p className="text-sm">Support tickets will appear here when customers submit them</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW - Card Layout */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {issues.map((issue) => (
              <div key={issue._id} className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TicketIcon className="w-5 h-5 text-primary" />
                      <span className="font-bold text-primary">{issue.ticketNumber}</span>
                    </div>
                    <div
                      className={`badge ${
                        issue.status === "resolved" ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {issue.status === "resolved" ? "Resolved" : "Pending"}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className={`badge ${ISSUE_TYPE_COLORS[issue.type]} badge-sm`}>
                    {ISSUE_TYPE_LABELS[issue.type]}
                  </div>

                  {/* Subject */}
                  <h3 className="font-semibold mt-2 line-clamp-2">{issue.subject}</h3>

                  {/* User Info */}
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <UserIcon className="w-4 h-4" />
                    <span>{issue.userName}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{formatDate(issue.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-3 pt-3 border-t border-base-200">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => openIssueDetail(issue)}
                    >
                      View Details
                    </button>
                    {issue.status === "pending" && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleResolve(issue._id)}
                        disabled={resolveMutation.isPending}
                      >
                        {resolveMutation.isPending ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-4 h-4" />
                            Resolve
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW - Table Layout */}
          <div className="card bg-base-100 shadow-xl hidden sm:block">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Type</th>
                      <th>Subject</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {issues.map((issue) => (
                      <tr key={issue._id} className="hover">
                        <td>
                          <span className="font-bold text-primary">{issue.ticketNumber}</span>
                        </td>

                        <td>
                          <div className={`badge ${ISSUE_TYPE_COLORS[issue.type]} badge-sm`}>
                            {ISSUE_TYPE_LABELS[issue.type]}
                          </div>
                        </td>

                        <td>
                          <div
                            className="font-medium cursor-pointer hover:text-primary max-w-xs truncate"
                            onClick={() => openIssueDetail(issue)}
                          >
                            {issue.subject}
                          </div>
                        </td>

                        <td>
                          <div>
                            <div className="font-medium">{issue.userName}</div>
                            <div className="text-sm opacity-60">{issue.userEmail}</div>
                          </div>
                        </td>

                        <td>
                          <div
                            className={`badge ${
                              issue.status === "resolved" ? "badge-success" : "badge-warning"
                            }`}
                          >
                            {issue.status === "resolved" ? "Resolved" : "Pending"}
                          </div>
                        </td>

                        <td>
                          <span className="text-sm opacity-60">{formatDate(issue.createdAt)}</span>
                        </td>

                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={() => openIssueDetail(issue)}
                            >
                              View
                            </button>
                            {issue.status === "pending" && (
                              <button
                                className="btn btn-sm btn-success gap-1"
                                onClick={() => handleResolve(issue._id)}
                                disabled={resolveMutation.isPending}
                              >
                                {resolveMutation.isPending ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <>
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Resolve
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ISSUE DETAIL MODAL */}
      <input
        type="checkbox"
        className="modal-toggle"
        checked={selectedIssue !== null}
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
          {selectedIssue && (
            <>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TicketIcon className="w-6 h-6 text-primary" />
                  <h3 className="font-bold text-xl">{selectedIssue.ticketNumber}</h3>
                  <div
                    className={`badge ${
                      selectedIssue.status === "resolved" ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {selectedIssue.status === "resolved" ? "Resolved" : "Pending"}
                  </div>
                </div>
                <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Issue Type */}
              <div className={`badge ${ISSUE_TYPE_COLORS[selectedIssue.type]} mb-4`}>
                {ISSUE_TYPE_LABELS[selectedIssue.type]}
              </div>

              {/* Subject */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold">{selectedIssue.subject}</h4>
              </div>

              {/* Customer Info */}
              <div className="bg-base-200 rounded-lg p-4 mb-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Customer Information
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-base-content/60" />
                    <span>{selectedIssue.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4 text-base-content/60" />
                    <a
                      href={`mailto:${selectedIssue.userEmail}`}
                      className="text-primary hover:underline"
                    >
                      {selectedIssue.userEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-base-200 rounded-lg p-4 mb-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4" />
                  Description
                </h5>
                <p className="text-base-content/80 whitespace-pre-wrap">
                  {selectedIssue.description}
                </p>
              </div>

              {/* Timestamps */}
              <div className="flex flex-wrap gap-4 text-sm text-base-content/60 mb-6">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Created: {formatDate(selectedIssue.createdAt)}</span>
                </div>
                {selectedIssue.resolvedAt && (
                  <div className="flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4 text-success" />
                    <span>Resolved: {formatDate(selectedIssue.resolvedAt)}</span>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="modal-action">
                <button onClick={closeModal} className="btn">
                  Close
                </button>
                {selectedIssue.status === "pending" && (
                  <button
                    className="btn btn-success gap-2"
                    onClick={() => handleResolve(selectedIssue._id)}
                    disabled={resolveMutation.isPending}
                  >
                    {resolveMutation.isPending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Mark as Resolved
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="modal-backdrop" onClick={closeModal}></div>
      </div>
    </div>
  );
}

export default IssuesPage;