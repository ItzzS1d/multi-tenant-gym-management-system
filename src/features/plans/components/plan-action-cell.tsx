import { Edit, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useDialog } from "@/shared/hooks/useDialog";
import NewPlanForm from "./plan-form";
import { UpdatePlanSchema } from "../plans-validations";
import { Switch } from "@/shared/components/ui/switch";
import { useState } from "react";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { togglePlanStatus } from "../plans-actions";

type PlanActionCellProps =
    | {
          type: "status";
          isActive: boolean;
          id: string;
      }
    | {
          type: "edit";
          defaultValues: UpdatePlanSchema;
      };
const PlanActionCell = (props: PlanActionCellProps) => {
    const { openDialog } = useDialog();
    const { handleAction } = useActionHandler();
    const [isChecked, setIsChecked] = useState(
        props.type === "status" ? props.isActive : false,
    );

    async function handleStatusChange(id: string) {
        setIsChecked(!isChecked);
        const data = {
            id,
            isActive: !isChecked,
        };
        await handleAction(togglePlanStatus, data);
    }

    const handleEdit = (defaultValues: UpdatePlanSchema) => {
        openDialog({
            title: "Edit Plan",
            titleIcon: <Edit />,
            type: "form",
            titleDescription: "Edit Plan Details",
            content: <NewPlanForm mode="EDIT" defaultValues={defaultValues} />,
        });
    };

    if (props.type === "status") {
        return (
            <Switch
                checked={isChecked}
                onCheckedChange={() => handleStatusChange(props.id)}
            />
        );
    }
    return (
        <Button
            variant="ghost"
            size={"icon-sm"}
            onClick={() => handleEdit(props.defaultValues)}
        >
            <Pencil />
        </Button>
    );
};

export default PlanActionCell;
