import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination
} from "@mui/material";
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
  const [paginationOptions, setPaginationOptions] = useState({
    page: 0,
    rowsPerPage: 10,
  });

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "iban", label: "IBAN" },
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
  ];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPaginationOptions((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationOptions(() => ({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const paginatedData = dataList.slice(
    paginationOptions.page * paginationOptions.rowsPerPage,
    paginationOptions.page * paginationOptions.rowsPerPage +
      paginationOptions.rowsPerPage
  );

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
        <Table sx={{ minWidth: 650 }} aria-label="customer list table">
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
            {paginatedData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                count={dataList.length}
                rowsPerPage={paginationOptions.rowsPerPage}
                page={paginationOptions.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
