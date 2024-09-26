import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

export default function Table({ data, columns }: any) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting as any,
    onGlobalFilterChange: setFiltering as any,
  });

  return (
    <div>
      <div className="mt-10 mb-3">
        <input
          className="w-4/5 mx-auto block rounded-xl p-3 border border-[#003F62] text-xl"
          type="text"
          placeholder="Enter Search Query"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
        />
      </div>
      <table className="table table-zebra w-4/5 mx-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{ asc: "⬆️", desc: "⬇️" }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center w-4/5 mx-auto mt-10">
        <button
          onClick={() => table.setPageIndex(0)}
          className=" px-5 py-2 rounded-xl bg-[#003F62] text-white mx-5"
        >
          First page
        </button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className={`px-5 py-2 rounded-xl ${
            !table.getCanPreviousPage() ? "bg-[#004062be]" : "bg-[#003F62]"
          }  text-white mx-5`}
        >
          Previous page
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className={`px-5 py-2 rounded-xl ${
            !table.getCanNextPage() ? "bg-[#004062be]" : "bg-[#003F62]"
          }  text-white mx-5`}
        >
          Next page
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          className=" px-5 py-2 rounded-xl bg-[#003F62] text-white mx-5"
        >
          Last page
        </button>
      </div>
    </div>
  );
}
