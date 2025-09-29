"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ---------- Main DataTable Component ---------- */
export function DataTable({ 
  columns = [], 
  data = [], 
  caption = "",
  className = "",
  emptyMessage = "No data available",
  ...props 
}) {
  return (
    <div className={cn("w-full overflow-auto", className)} {...props}>
      <Table>
        {/* Caption */}
        {caption && <TableCaption>{caption}</TableCaption>}

        {/* Header */}
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={getAlignmentClass(col.align)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={getAlignmentClass(col.align)}
                  >
                    {row[col.accessor] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* Footer */}
        {columns.some(col => col.footer) && (
          <TableFooter>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  className={getAlignmentClass(col.align)}
                >
                  {col.footer
                    ? typeof col.footer === "function"
                      ? col.footer(data)
                      : col.footer
                    : null}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

/* ---------- Helper Function ---------- */
function getAlignmentClass(align) {
  switch (align) {
    case "right":
      return "text-right";
    case "center":
      return "text-center";
    default:
      return "text-left";
  }
}

/* ---------- Usage Examples ---------- */

// Example 1: Basic Table
export function InvoiceTable() {
  const columns = [
    { header: "Invoice", accessor: "invoice" },
    { header: "Status", accessor: "status", align: "center" },
    { header: "Amount", accessor: "amount", align: "right", footer: "Total" },
  ];

  const data = [
    { invoice: "INV001", status: "Paid", amount: "$250.00" },
    { invoice: "INV002", status: "Pending", amount: "$150.00" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      caption="Recent Invoices"
    />
  );
}

// Example 2: User Management Table
export function UserTable() {
  const userColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role", align: "center" },
    { header: "Status", accessor: "status", align: "center" },
    { header: "Join Date", accessor: "joinDate", align: "center" },
  ];

  const userData = [
    { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", joinDate: "2024-01-15" },
    { name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive", joinDate: "2024-02-20" },
  ];

  return (
    <DataTable
      columns={userColumns}
      data={userData}
      caption="User Management"
      className="mt-4"
    />
  );
}

// Example 3: Product Table with Custom Footer
export function ProductTable() {
  const productColumns = [
    { header: "Product", accessor: "product" },
    { header: "Category", accessor: "category", align: "center" },
    { 
      header: "Price", 
      accessor: "price", 
      align: "right",
      footer: (data) => `Total: $${data.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0).toFixed(2)}`
    },
    { 
      header: "Stock", 
      accessor: "stock", 
      align: "right",
      footer: (data) => `Avg: ${(data.reduce((sum, item) => sum + item.stock, 0) / data.length).toFixed(1)}`
    },
  ];

  const productData = [
    { product: "Laptop", category: "Electronics", price: "$999.99", stock: 15 },
    { product: "Mouse", category: "Electronics", price: "$29.99", stock: 50 },
  ];

  return (
    <DataTable
      columns={productColumns}
      data={productData}
      caption="Product Inventory"
      emptyMessage="No products found"
    />
  );
}

// Example 4: Simple Usage in any component
export function MyComponent() {
  const myData = [
    { id: 1, task: "Design Homepage", priority: "High", due: "2024-12-31" },
    { id: 2, task: "Fix Login Bug", priority: "Medium", due: "2024-12-25" },
  ];

  const myColumns = [
    { header: "Task", accessor: "task" },
    { header: "Priority", accessor: "priority", align: "center" },
    { header: "Due Date", accessor: "due", align: "center" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      <DataTable
        columns={myColumns}
        data={myData}
        emptyMessage="No tasks assigned"
      />
    </div>
  );
}

/* ---------- Default Export ---------- */
export default DataTable;