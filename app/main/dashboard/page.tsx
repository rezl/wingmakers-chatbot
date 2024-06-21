"use client"

import { BotMessageSquare, BookCheck } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as React from "react"
import { RxCaretSort } from "react-icons/rx";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaAngleDown } from "react-icons/fa6";
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
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { supabase } from "@/lib/supabase-client";
import FileUploadButton from "@/components/documents/add-documents";
import Loading from "@/components/ui/loading";
import { toast } from "react-toastify";

export type Document = {
  id: string
  size: number
  status: "success" | "failed" | "processing"
  name: string
}

const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 m-0 items-center flex justify-start hover:bg-background"
        >
          Name
          <RxCaretSort className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "size",
    header: () => <div className="">Size</div>,
    cell: ({ row }) => {
      const sizeInBytes = parseFloat(row.getValue("size"))

      return <div className=" font-medium">{bytesToMB(sizeInBytes)} MB</div>
    },
  },
]

export default function Dashboard() {
  const [data, setData] = React.useState<Document[]>([])
  const [chatbotData, setChatbotData] = React.useState<Document[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('document_info').select('*')
      if (error) {
        console.error("Error fetching data: ", error)
      } else {
        setData(data)
      }
      setLoading(false)
    }

        // Set up Supabase real-time subscription
        const insertChannel = supabase.channel("document_info");

        insertChannel
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "document_info" },
            fetchData
          )
          .subscribe();
    
    fetchData()
  }, [])

  React.useEffect(() => {
    const fetchChatbotdata = async () => {
      const { data, error } = await supabase.from('chatbots').select('*')
      if (error) {
        console.error("Error fetching data: ", error)
      } else {
        setChatbotData(data)
      }
      setLoading(false)
    }

        // Set up Supabase real-time subscription
        const insertChannel = supabase.channel("chatbots");

        insertChannel
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "chatbots" },
            fetchChatbotdata
          )
          .subscribe();
    
          fetchChatbotdata()
  }, [])

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
  })


  if (loading) return (
    <Loading loadingText="Loading dashboard"/>
  )
  return (
    <>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 w-full mt-2">
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Chatbots
              </CardTitle>
              <BotMessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <div>
              <div className="text-2xl font-bold">{chatbotData.length}</div>
            </div>
          </Card>
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total documents
              </CardTitle>
              <BookCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <div>
              <div className="text-2xl font-bold">{data.length}</div>
              {/* <p className="text-xs text-muted-foreground">
                {data[0].name} +
              </p> */}
            </div>
          </Card>
        </div>
        {/* table */}
      <div className="w-full mt-5">
      <div className="rounded-md border">
        <div className="max-h-[470px] min-h-12 overflow-y-auto scrollbar-hide"> {/* Add this wrapper */}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="max-h-96 overflow-y-auto">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
      </div>
    </div>
    </>

  );
}


