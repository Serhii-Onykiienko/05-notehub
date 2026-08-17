import css from "./Pagination.module.css";
import * as ReactPaginateModule from "react-paginate";
import type { ComponentType } from "react";
import type { ReactPaginateProps } from "react-paginate";

interface ModuleWithDefault<T> {
  default: T;
}

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ModuleWithDefault<ComponentType<ReactPaginateProps>>
  >
).default.default;

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      previousLabel="<"
      nextLabel=">"
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
