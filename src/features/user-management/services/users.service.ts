import type { DashboardUser } from "../types/user"

const mockUsers: DashboardUser[] = [
  {
    id: "u-001",
    fullName: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    phone: "+1 202-555-0131",
    userType: "Patient",
    status: "Pending",
  },
  {
    id: "u-002",
    fullName: "Pulse Care Center",
    email: "contact@pulsecare.io",
    phone: "+1 202-555-0144",
    userType: "Center",
    status: "Approved",
  },
  {
    id: "u-003",
    fullName: "Dr. Omar Hassan",
    email: "omar.hassan@example.com",
    phone: "+1 202-555-0169",
    userType: "Specialist",
    status: "Active",
  },
  {
    id: "u-004",
    fullName: "Maya Rodriguez",
    email: "maya.rodriguez@example.com",
    phone: "+1 202-555-0188",
    userType: "Patient",
    status: "Rejected",
  },
  {
    id: "u-005",
    fullName: "Wellness Point Center",
    email: "hello@wellnesspoint.com",
    phone: "+1 202-555-0112",
    userType: "Center",
    status: "Inactive",
  },
  {
    id: "u-006",
    fullName: "Dr. Layla Farouk",
    email: "layla.farouk@example.com",
    phone: "+1 202-555-0111",
    userType: "Specialist",
    status: "Pending",
  },
]

export async function getDashboardUsers(): Promise<DashboardUser[]> {
  return Promise.resolve(mockUsers)
}
