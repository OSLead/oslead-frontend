"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { getCookie } from "cookies-next";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export type contributorView = {
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
  enrolledProjects: string[];
};

export function DataTableCAdmin() {

  const [data, setData] = React.useState<contributorView[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const openDialog = (user: contributorView) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  interface DeliveryDetails {
    tshirt?: {
      size?: string;
      color?: string;
    };
    city?: string;
    state?: string;
    pincode?: string;
  }
  

  const columns: ColumnDef<contributorView>[] = [
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
      cell: ({ row }) => {
        const details = (row.getValue("delivery_details") as DeliveryDetails) ?? {};
        return (
          <div>
            T-Shirt Size: {details.tshirt?.size || "N/A"}
            <br />
            T-Shirt Color: {details.tshirt?.color || "N/A"}
            <br />
            City: {details.city || "N/A"}
            <br />
            State: {details.state || "N/A"}
            <br />
            Pin Code: {details.pincode || "N/A"}
          </div>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const contributorTbl = row.original;
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
                onClick={() => handleBanContributor((contributorTbl as any)._id)}
              >
                {isBanned ? "Unban Contributor" : "Ban Contributor"}
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

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isBanned, setIsBanned] = React.useState(false);
  const [selectedUser, setSelectedUser] =
    React.useState<contributorView | null>(null);

  const handleDeleteProject = async (contributorId: string,projectId: string) => {
      const token = getCookie("user-data");
      try {
        const response = await fetch(`https://oslead-backend.vercel.app/api/contributor/delete-enrolled-project/${contributorId}/${projectId}`, 
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: `${JSON.parse(token as string).token}`,
            }),
        });
    
        if (response.ok) {
          closeDialog();
          toast.success("Project deleted successfully!")
        } else {
          alert('Failed to delete the project.');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('An error occurred while deleting the project.');
      }
    };

    const handleBanContributor = async (contributorID: string) => {
      const token = getCookie("user-data");
      try {
        
        const response = await fetch(`https://oslead-backend.vercel.app/api/contributor/ban-contributor/${contributorID}`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: `${JSON.parse(token as string).token}`,
            }),
        });
    
        if (response.ok) {
          
          if(!isBanned) {
            toast.success("Contributor banned Successfully!")
            setIsBanned(true);
          }
          else {
            setIsBanned(false);
            toast.success("Contributor Unbanned Successfully!")
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
    const token = getCookie("user-data");
    const router = useRouter();
    if(!token) {
      router.push('/admin');
    };
    async function fetchData(page: number) {
      try {
        const response = await fetch(
          `https://oslead-backend.vercel.app/api/contributor/get-all-contributors?page=${page}?limit=10`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: `${JSON.parse(token as string).token}`,
            }),
          }
        );

        if (response.ok && isMounted) {
          const jsonData = await response.json();
          setData(jsonData.contributors);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(currentPage);

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

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
        <DialogOverlay className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <DialogContent className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <DialogTitle className="text-xl font-bold mb-2">
              View Contributor Details
            </DialogTitle>
            {selectedUser && (
              <div>
                <div className="containerUserProfile">
                  <p style={{ fontSize: "22px", fontWeight: "600" }}>
                    User Profile
                  </p>
                  <br />
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Name:
                    </span>{" "}
                    {selectedUser.name}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      GitHub Username:
                    </span>{" "}
                    {selectedUser.username}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Email:
                    </span>{" "}
                    {selectedUser.email}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      College Name:
                    </span>{" "}
                    {selectedUser.college_name}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      LinkedIn URL:
                    </span>{" "}
                    {selectedUser.linked_in}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      T-Shirt Size:
                    </span>{" "}
                    {selectedUser.delivery_details?.tshirt?.size}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      T-Shirt Color:
                    </span>{" "}
                    {selectedUser.delivery_details?.tshirt.color}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      City:
                    </span>{" "}
                    {selectedUser.delivery_details?.city}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      State:
                    </span>{" "}
                    {selectedUser.delivery_details?.state}
                  </p>
                  <p>
                    <span style={{ fontSize: "18px", fontWeight: "400" }}>
                      Pin Code:
                    </span>{" "}
                    {selectedUser.delivery_details?.pincode}
                  </p>
                </div>
                <br />
                <div className="containerEnrolledProjects">
                  <p style={{ fontSize: "22px", fontWeight: "600" }}>
                    Enrolled Projects
                  </p>
                  <br />
                  {selectedUser.enrolledProjects.map((item , index) => (
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                      <div
                        className="displayProject"
                        key={((item as any)?.projectId)|| index}
                      >
                        <p style={{ fontSize: "18px" }}>{((item as any)?.projectName)}</p>
                      </div>
                      <div
                        className="deleteProject"
                        style={{
                          marginLeft: "20px",
                          alignItems: "center",
                          display: "flex",
                          backgroundColor: "#D84040",
                          padding: "0px 20px",
                          borderRadius: "10px",
                          color: "white",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        <div onClick={() => handleDeleteProject((selectedUser as any)._id, (selectedUser as any).projectId)}>Delete Project</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="containerAssignPoints">
                  <p style={{ fontSize: "22px", fontWeight: "600" }}>
                    Assign Points
                  </p>
                  <br/>
                  <div className="selectOpt" style={{display:"flex",justifyContent:"left"}}>
                    <div className="textSelectOpt" style={{display:"flex",alignItems:"center",marginRight:"20px"}}>
                      <p>Enter Points: </p>
                    </div>
                    <div className="selectInpt">
                      <Input
                      placeholder="Enter the points"
                      type="number"
                      />
                    </div>
                    <div className="submitBtn" style={{padding:"10px",backgroundColor:"#D84040",marginLeft:"20px",borderRadius:"10px",color:"white",fontWeight:"600",cursor:"pointer"}}>
                      <p>Submit</p>
                    </div>
                  </div>
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
