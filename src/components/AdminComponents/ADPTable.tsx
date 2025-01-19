"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { DialogOverlay } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast,ToastContainer } from "react-toastify";

import { getCookie } from "cookies-next";

export type ProjectAdminView = {
  name: string;
  username: string;
  email: string;
  college_name: string;
  linked_in: string;
  delivery_details: {
    tshirt: {
      size: string;
      color: string;
    };
    city: string;
    state: string;
    pincode: string;
  };
};

export function DataTableProjectAdmin() {
  const [data, setData] = React.useState<ProjectAdminView[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);

  const [selectedPa, setselectedPa] =
    React.useState<ProjectAdminView | null>(null);

  const openDialog = (user: ProjectAdminView) => {
    setselectedPa(user);
    setIsOpen(true);
  };

  const [isBanned, setIsBanned] = React.useState(false);

  const columns: ColumnDef<ProjectAdminView>[] = [
    {
      id: "sno",
      header: () => (
        <div style={{ textAlign: "center", width: "14px" }}>S.No</div>
      ),
      cell: ({ row }) => (
        <div style={{ textAlign: "center", width: "14px" }}>
          {row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div style={{ textAlign: "center" }}>Name</div>,
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "username",
      header: () => <div style={{ textAlign: "center" }}>GitHub Username</div>,
      cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div style={{ textAlign: "center" }}>Email ID</div>,
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "college_name",
      header: () => <div style={{ textAlign: "center" }}>Collage Name</div>,
      cell: ({ row }) => <div>{row.getValue("college_name")}</div>,
    },
    {
      accessorKey: "linked_in",
      header: () => <div style={{ textAlign: "center" }}>LinkedIn URL</div>,
      cell: ({ row }) => <div>{row.getValue("linked_in")}</div>,
    },
    {
      accessorKey: "delivery_details",
      header: () => <div style={{ textAlign: "center" }}>Delivery Details</div>,
      cell: ({ row }) => (
        <div>
          T-Shirt Size: {row.getValue("delivery_details")?.tshirt?.size}
          <br />
          T-Shirt Color: {row.getValue("delivery_details")?.tshirt?.color}
          <br />
          City: {row.getValue("delivery_details")?.city}
          <br />
          State: {row.getValue("delivery_details")?.state}
          <br />
          Pin Code: {row.getValue("delivery_details")?.pincode}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const projectAdminTbl = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={()=> handleBanProjectAdmin(projectAdminTbl._id)}
              >
                {isBanned ? "Unban Project Admin" : "Ban Project Admin"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDialog(row.original)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const token = getCookie("user-data");
  if(!token) {
    window.location.href = '/admin'
  };

  const handleBanProjectAdmin = async (projectAdminID: string) => {
    try {
      const response = await fetch(`https://oslead-backend.vercel.app/api/maintainer/ban-maintainer/${projectAdminID}`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: `${JSON.parse(token).token}`,
          }),
      });
  
      if (response.ok) {
        if(!isBanned) {
          toast.success("Project Admin banned Successfully!");
          setIsBanned(true);
        }
        else {
          setIsBanned(false);
          toast.success("Project Admin Unbanned Successfully!");
        }
      } 
      else {
        toast.error(`Failed to ${isBanned ? "unban" : "ban"} `)
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('An error occurred while deleting the project.');
    }
  };

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData(page: number) {
      try {
        const response = await fetch(
          `https://oslead-backend.vercel.app/api/maintainer/get-all-maintainers?page=${page}?limit=10`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: `${JSON.parse(token).token}`,
            }),
          }
        );

        if (response.ok && isMounted) {
          const jsonData = await response.json();
          setData(jsonData.maintainers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(currentPage); // Fetch data for the current page

    return () => {
      isMounted = false;
    };
  }, [currentPage]); // Dependency on currentPage to fetch data when page changes

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage((prevPage) => {
                const prevPageNumber = prevPage > 1 ? prevPage - 1 : 1;
                return prevPageNumber;
              });
            }}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage((prevPage) => prevPage + 1);
            }}
            disabled={data.length < 5} 
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
          <DialogContent className="bg-white p-6 rounded shadow-lg" style={{height:"80vh",overflow:"scroll",maxWidth:"60vw"}}>
            <DialogTitle className="text-xl font-bold mb-2">
              View Project Admin Details
            </DialogTitle>
                        {selectedPa && (
              <div>
                <div className="containerUserProfile">
                  <p style={{ fontSize: "22px", fontWeight: "600" }}>
                    User Profile
                  </p>
                  <br />
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Collage Name:
                    </span>{" "}
                    {selectedPa.college_name}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      T-Shirt Size:
                    </span>{" "}
                    {selectedPa.delivery_details?.tshirt?.size}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      T-Shirt Color:
                    </span>{" "}
                    {selectedPa.delivery_details?.tshirt.color}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      City:
                    </span>{" "}
                    {selectedPa.delivery_details?.city}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      State:
                    </span>{" "}
                    {selectedPa.delivery_details?.state}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Pin Code:
                    </span>{" "}
                    {selectedPa.delivery_details?.pincode}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Email:
                    </span>{" "}
                    {selectedPa.email}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      LinkedIn:
                    </span>{" "}
                    {selectedPa.linked_in}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Name:
                    </span>{" "}
                    {selectedPa.name}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Is Banned:
                    </span>{" "}
                    {selectedPa.isBanned}
                  </p>
                </div>
                <br />
                <div className="containerPaProjects">
                  <p style={{ fontSize: "22px", fontWeight: "600" }}>
                    PA Projects
                  </p>
                  <br />
                  {selectedPa.projects.map((item, index) => (
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                      <div
                        className="displayProject"
                        key={item._id || index}
                      >
                        <p style={{ fontSize: "22px",fontWeight:"600" }}>{item.projectDetails?.name}</p>
                        <p style={{ fontSize: "16px" }}>{item.projectDetails?.description}</p>
                        <p style={{fontWeight:"600"}}>Repo link: </p><a href="" style={{color:"red"}}>{item.projectDetails?.html_url}</a>
                        <p style={{fontWeight:"600"}}>Tech Stack: </p><a href="" style={{color:"red"}}>{item.projectDetails?.language}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </DialogOverlay>
      </Dialog>
      <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
    </div>
  );
}
