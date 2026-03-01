import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { ControlPanelProgram } from "../../types/program";
import { ProgramActionsDropdown } from "./ProgramActionsDropdown";

interface ProgramRowProps {
  program: ControlPanelProgram;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
}

const statusLabel: Record<ControlPanelProgram["status"], string> = {
  draft: "مسودة",
  published: "منشور",
  archived: "مؤرشف",
};

export function ProgramRow({ program, onEdit, onDelete, onApprove }: ProgramRowProps) {
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
        <Badge variant="outline">{statusLabel[program.status]}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={program.isApproved ? "default" : "secondary"}>
          {program.isApproved ? "Approved" : "Pending"}
        </Badge>
      </td>
      <td className="px-4 py-3">{program.price ?? "-"}</td>
      <td className="px-4 py-3">{program.currency ?? "-"}</td>
      <td className="px-4 py-3">
        <ProgramActionsDropdown onEdit={onEdit} onDelete={onDelete} onApprove={onApprove} />
      </td>
    </tr>
  );
}
