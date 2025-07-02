import { useEffect, useState } from "react";
import { Paper, Table, TableContainer, Typography, TableHead, TableRow, TableBody, TableCell, TableFooter } from "@mui/material";
import { StyledTableHeadCell } from "./components/StyledTablleHeadCell";

interface CustomerListQuery {
  Id: number;
  Name: string;
  Address: string;
  Email: string;
  Phone: string;
  Iban: string;
  Code: string;
  Description: string;
}

export default function CustomerListPage() {
  const [dataList, setDataList] = useState<CustomerListQuery[]>([]);

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "iban", label: "IBAN" },
    { key: "code", label: "Code" },
    { key: "description", label: "Description" }
  ]

  useEffect(() => {
    fetch("/api/customers/list")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDataList(data as CustomerListQuery[]);
      });
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customer list table" > 
         <TableHead>
            <TableRow>
                {tableColumns.map((column) => (
                    <StyledTableHeadCell key={column.key}>
                    {column.label}
                    </StyledTableHeadCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                {tableColumns.map((column) => (
                  <TableCell key={column.key}>
                    {row[column.key as keyof CustomerListQuery]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
                
            </TableRow>
          </TableFooter>
        </Table>

      </TableContainer>
    </>
  );
}