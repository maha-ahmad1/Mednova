import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { DashboardUser } from "../../../types/user"

interface UsersTableProps {
  users: DashboardUser[]
  onViewDetails: (user: DashboardUser) => void
  onApproveUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

const statusStyles: Record<DashboardUser["status"], string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-50 text-slate-600 border-slate-200",
}

export function UsersTable({ users, onViewDetails, onApproveUser, onDeleteUser }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-gray-500">
          No users found matching your current filters.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Full name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">User type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="align-middle">
                  <td className="px-4 py-4 font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-4 py-4 text-gray-600">{user.email}</td>
                  <td className="px-4 py-4 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-4 text-gray-600">{user.userType}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className={statusStyles[user.status]}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => onViewDetails(user)}>
                        View details
                      </Button>
                      {user.status === "Pending" && (
                        <Button size="sm" onClick={() => onApproveUser(user.id)}>
                          Approve
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => onDeleteUser(user.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
