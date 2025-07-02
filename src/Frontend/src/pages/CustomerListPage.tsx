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
  TablePagination,
  TextField,
} from "@mui/material";
import { StyledTableHeadCell } from "./components/StyledTablleHeadCell";

interface CustomerCategory {
  code: string;
  description: string;
}


interface CustomerListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  category?: CustomerCategory;
}

export default function CustomerListPage() {
  const [dataList, setDataList] = useState<CustomerListQuery[]>([]);
  const [paginationOptions, setPaginationOptions] = useState({
    page: 0,
    rowsPerPage: 10,
  });
  const [filterInputs, setFilterInputs] = useState({
    nameFilter: "",
    emailFilter: "",
  });

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "iban", label: "IBAN" },
    { key: "category.code", label: "Code" },
    { key: "category.description", label: "Description" },
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
    const query = new URLSearchParams();
    if (filterInputs.nameFilter) query.append("name", filterInputs.nameFilter);
    if (filterInputs.emailFilter)
      query.append("email", filterInputs.emailFilter);
    
     fetch(`/api/customers/list?${query.toString()}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDataList(data as CustomerListQuery[]);
      });
    console.log(filterInputs);
  }, [filterInputs.emailFilter, filterInputs.nameFilter]);

function getNestedValue<T>(obj: T, path: string): string {
  return path.split(".").reduce<any>((acc, part) => acc?.[part], obj) ?? "";
}
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
            <TableRow>
              {tableColumns.map((column) => (
                <TableCell key={column.key}>
                  {["name", "email"].includes(column.key) ? (
                    <TextField
                      variant="standard"
                      placeholder={`Filter ${column.label}`}
                      value={
                        column.key === "name"
                          ? filterInputs.nameFilter
                          : filterInputs.emailFilter
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (column.key === "name")
                          setFilterInputs((prev) => ({
                            ...prev,
                            nameFilter: value,
                          }));
                        if (column.key === "email")
                          setFilterInputs((prev) => ({
                            ...prev,
                            emailFilter: value,
                          }));
                      }}
                      fullWidth
                    />
                  ) : null}
                </TableCell>
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
                    {getNestedValue(row, column.key)}
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
