import { FC } from "react";

interface TableCellProps {
  className?: string;
  content: string | number;
  width: string;
}

const TableCell: FC<TableCellProps> = ({ className, content, width }) => {
  return (
    <td className={`border-b border-gray-200 ${className}`}>
      <div
        className={`flex m-auto h-30 sm:h-28 ${width} break-all overflow-auto scrollbar font-medium`}
      >
        <p>{content}</p>
      </div>
    </td>
  );
};

export default TableCell;
