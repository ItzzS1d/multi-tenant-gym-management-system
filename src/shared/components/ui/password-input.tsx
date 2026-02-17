import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

type PasswordInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
> & {
    ref?: React.Ref<HTMLInputElement>;
};

export function PasswordInput({
    className,
    disabled,
    ...props
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className={cn("relative rounded-xl ", className)}>
            <InputGroup>
                <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    disabled={disabled}
                    {...props}
                />
                <InputGroupAddon>
                    <Lock />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground cursor-pointer absolute end-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-xl"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? (
                            <Eye size={19} />
                        ) : (
                            <EyeOff size={19} />
                        )}
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}
