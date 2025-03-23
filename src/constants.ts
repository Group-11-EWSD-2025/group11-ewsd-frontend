import { TDepartment } from "@/types/departments";

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
