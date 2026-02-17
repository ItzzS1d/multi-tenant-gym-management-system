interface EmptyTableStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}
export default function EmptyAttendanceTableState({
    icon,
    title,
    description,
}: EmptyTableStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center ">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                {icon}
            </div>

            <h4 className="text-xl font-bold text-[#0d1b12] dark:text-[#ffffff] mb-2">
                {title}
            </h4>

            <p className="text-[#4c9a66] dark:text-[#a0cbb0] max-w-sm mb-8">
                {description}
            </p>
        </div>
    );
}
