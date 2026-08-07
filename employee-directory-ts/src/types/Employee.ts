export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: "Active" | "Inactive";
}