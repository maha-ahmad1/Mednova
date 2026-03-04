import { memo } from "react";
import Image from "next/image";
import type { ControlPanelProgram } from "../../types/program";
import { ProgramActionsDropdown } from "./ProgramActionsDropdown";
import { ProgramStatusDropdown } from "./ProgramStatusDropdown";

interface ProgramRowProps {
  program: ControlPanelProgram;
  isUpdatingStatus?: boolean;
  onStatusChange: (status: "approved" | "rejected") => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProgramRowComponent({ program, isUpdatingStatus = false, onStatusChange, onView, onEdit, onDelete }: ProgramRowProps) {
  const normalizedStatus =
    program.status === "approved" || program.status === "rejected" ? program.status : "draft";

  return (
    <tr className="border-t align-middle">
      <td className="px-4 py-3">{program.id}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
            {program.coverImage ? (
              <Image src={program.coverImage} alt={program.title} fill className="object-cover" unoptimized />
            ) : null}
          </div>
          <span className="font-medium text-foreground">{program.title}</span>
        </div>
      </td>
      <td className="px-4 py-3">{program.creator}</td>
      <td className="px-4 py-3">
        <ProgramStatusDropdown
          status={normalizedStatus}
          isLoading={isUpdatingStatus}
          onSelectStatus={onStatusChange}
        />
      </td>
      {/* <td className="px-4 py-3">
        <Badge variant={program.isApproved ? "default" : "secondary"}>
          {program.isApproved ? "Approved" : "Pending"}
        </Badge>
      </td> */}
      <td className="px-4 py-3">{program.price ?? "-"}</td>
      <td className="px-4 py-3">{program.currency ?? "-"}</td>
      <td className="px-4 py-3">
        <ProgramActionsDropdown onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

export const ProgramRow = memo(ProgramRowComponent);
