import { TDepartment } from "@/types/departments";
import { TUser } from "@/types/users";

export const DEPARTMENTS: TDepartment[] = [
  {
    id: "1",
    name: "Business & Management",
  },
  {
    id: "2",
    name: "Architecture & Design",
  },
  {
    id: "3",
    name: "Education & Teaching",
  },
];

// Sample data
export const USER_DATA: TUser[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@gmail.com",
    phone: "062342332",
    department: "Business & Management",
    role: "Staff",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@gmail.com",
    phone: "061235354",
    department: "Marketing",
    role: "QA Coordinator",
  },
  {
    id: "3",
    name: "Prof. Susan",
    email: "susan@gmail.com",
    phone: "062323232",
    department: "Research",
    role: "QA Manager",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa@gmail.com",
    phone: "065939952",
    department: "Administration",
    role: "Admin",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@gmail.com",
    phone: "062345678",
    department: "IT",
    role: "Developer",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@gmail.com",
    phone: "061234567",
    department: "Human Resources",
    role: "HR Manager",
  },
  {
    id: "7",
    name: "David Wilson",
    email: "david@gmail.com",
    phone: "062345678",
    department: "Finance",
    role: "Accountant",
  },
  {
    id: "8",
    name: "Jennifer Lee",
    email: "jennifer@gmail.com",
    phone: "061234567",
    department: "Marketing",
    role: "Marketing Specialist",
  },
  {
    id: "9",
    name: "Robert Taylor",
    email: "robert@gmail.com",
    phone: "062345678",
    department: "IT",
    role: "System Administrator",
  },
  {
    id: "10",
    name: "Jessica Martinez",
    email: "jessica@gmail.com",
    phone: "061234567",
    department: "Research",
    role: "Researcher",
  },
  {
    id: "11",
    name: "Thomas Anderson",
    email: "thomas@gmail.com",
    phone: "062345678",
    department: "Business & Management",
    role: "Project Manager",
  },
  {
    id: "12",
    name: "Amanda White",
    email: "amanda@gmail.com",
    phone: "061234567",
    department: "Human Resources",
    role: "HR Specialist",
  },
];

export const ROLE_OPTIONS = [
  { label: "Staff", value: "Staff" },
  { label: "QA Coordinator", value: "QA Coordinator" },
  { label: "QA Manager", value: "QA Manager" },
  { label: "Admin", value: "Admin" },
  { label: "Developer", value: "Developer" },
  { label: "HR Manager", value: "HR Manager" },
  { label: "Accountant", value: "Accountant" },
  { label: "Marketing Specialist", value: "Marketing Specialist" },
  { label: "System Administrator", value: "System Administrator" },
  { label: "Researcher", value: "Researcher" },
  { label: "Project Manager", value: "Project Manager" },
  { label: "HR Specialist", value: "HR Specialist" },
];

export const COORDINATOR_OPTIONS = [
  { label: "John Doe", value: "1" },
  { label: "Marry Jane", value: "2" },
  { label: "Bruce Wayne", value: "3" },
];
