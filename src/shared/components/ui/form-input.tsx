import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "./field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { CSSProperties, ReactNode } from "react";
import { PasswordInput } from "./password-input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./select";
import { Textarea } from "./textarea";
import { DatePicker } from "./date-picker";
import { Switch } from "./switch";
import { cn } from "@/shared/lib/utils";
import { Phone } from "lucide-react";

type SelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

type BaseFormInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label: string;
    placeholder?: string;
    icon?: ReactNode;
    disabled?: boolean;
};

type TextInputProps<T extends FieldValues> = BaseFormInputProps<T> & {
    type?: "text" | "email" | "tel" | "number" | "url" | "date";
};
type SwitchInputProps<T extends FieldValues> = BaseFormInputProps<T> & {
    type: "switch";
    title: string;
    description: string;
    checked?: boolean;
};

type PasswordInputProps<T extends FieldValues> = BaseFormInputProps<T> & {
    type: "password";
};

type SelectInputProps<T extends FieldValues> = BaseFormInputProps<T> & {
    type: "select";
    options: SelectOption[];
    className?: CSSProperties;
};

type ComboBoxInputProps<T extends FieldValues> = BaseFormInputProps<T> & {
    type: "combobox";
    options: SelectOption[];
    emptyState: string;
};

type TextareaInputProps<T extends FieldValues> = BaseFormInputProps<T> & {
    type: "textarea";
    rows?: number
};

type FormInputProps<T extends FieldValues> =
    | TextInputProps<T>
    | PasswordInputProps<T>
    | SelectInputProps<T>
    | SwitchInputProps<T>
    | TextareaInputProps<T>
    | ComboBoxInputProps<T>;

function FormInput<T extends FieldValues>(props: FormInputProps<T>) {
    const { label, name, control, disabled } = props;

    return (
        <FieldGroup>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => {
                    if (props.type === "switch") {
                        const { title, description, checked } = props;
                        return (
                            <FieldGroup className="w-full ">
                                <FieldLabel htmlFor="plan-active">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>{title}</FieldTitle>
                                            <FieldDescription>
                                                {description}
                                            </FieldDescription>
                                        </FieldContent>
                                        <Switch
                                            id="plan-active"
                                            defaultChecked={checked}
                                            onCheckedChange={field.onChange}
                                            checked={field.value ?? false}
                                            name={field.name}
                                        />
                                    </Field>
                                </FieldLabel>
                            </FieldGroup>
                        );
                    }
                    if (props.type === "password") {
                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel>{label}</FieldLabel>
                                <PasswordInput
                                    {...field}
                                    placeholder={props.placeholder}
                                    disabled={disabled}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        );
                    }

                    if (props.type === "select") {

                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel>{label}</FieldLabel>
                                <Select
                                    items={props.options}
                                    disabled={disabled}
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={(e) => {
                                        field.onChange(e);
                                    }}
                                >
                                    <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectValue
                                            placeholder={
                                                props.placeholder || "Select..."
                                            }
                                        ></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent
                                        className={cn("py-1", props.className)}
                                    >
                                        {props.options?.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                disabled={option.disabled}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        );
                    }

                    if (props.type === "textarea") {
                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel>{label}</FieldLabel>
                                <Textarea
                                    {...field}
                                    placeholder={props.placeholder}
                                    disabled={disabled}
                                    rows={props.rows}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        );
                    }
                    if (props.type === "date") {
                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel>{label}</FieldLabel>
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        );
                    }
                    if (props.type === "tel") {
                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel>{label}</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        type={props.type || "text"}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={props.placeholder}
                                        disabled={disabled}
                                        onChange={(e) => {
                                            let digits = e.target.value.replace(
                                                /\D/g,
                                                "",
                                            );

                                            // If user +91
                                            if (
                                                digits.startsWith("91") &&
                                                digits.length > 10
                                            ) {
                                                digits = digits.slice(2);
                                            }

                                            // If user typed leading 0
                                            if (
                                                digits.startsWith("0") &&
                                                digits.length > 10
                                            ) {
                                                digits = digits.slice(1);
                                            }

                                            //  limit to 10 digits
                                            digits = digits.slice(0, 10);

                                            field.onChange(digits);
                                        }}
                                    />
                                    {props.icon && (
                                        <InputGroupAddon>
                                            <Phone />
                                        </InputGroupAddon>
                                    )}
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        );
                    }

                    // Default: text input (text, email, tel, number, url)
                    return (
                        <Field
                            data-invalid={fieldState.invalid}
                            className="gap-1"
                        >
                            <FieldLabel>{label}</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    type={props.type || "text"}
                                    aria-invalid={fieldState.invalid}
                                    placeholder={props.placeholder}
                                    disabled={disabled}
                                />
                                {props.icon && (
                                    <InputGroupAddon>
                                        {props.icon}
                                    </InputGroupAddon>
                                )}
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    );
                }}
            />
        </FieldGroup>
    );
}

export default FormInput;
