"use client";

import {
    useState,
    useOptimistic,
    use,
    startTransition,
    useRef,
    useEffect,
} from "react";
import { StickyNote, SendHorizonal, FilePen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { formatDate } from "@/shared/lib/utils";
import { addNewNoteAction } from "../../new/member-actions";
import { getMemberNotes } from "../../new/queries";
import { useRouter } from "next/navigation";

const StaffNotes = ({
    memberNotesPromise,
    staffName,
    member,
}: {
    memberNotesPromise: ReturnType<typeof getMemberNotes>;
    staffName: string;
    member: {
        id: string;
        name: string;
    };
}) => {
    const [inputValue, setInputValue] = useState("");
    const { handleAction } = useActionHandler();
    const initialNotes = use(memberNotesPromise);
    type Note = Awaited<ReturnType<typeof getMemberNotes>>[0];
    const listRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const [optimisticNotes, addOptimisticNote] = useOptimistic(
        initialNotes,
        (state, newNote: Note) => {
            return [...state, newNote];
        },
    );

    const handleAddNewNote = () => {
        if (!inputValue.trim()) return;

        const noteContent = inputValue;
        const newNote = {
            id: "temp-" + Date.now(),
            content: inputValue,
            createdAt: new Date(),
            memberId: member.id,
            staff: {
                memberDetails: {
                    firstName: staffName.split(" ")[0],
                    lastName: staffName.split(" ")[1],
                },
                user: {
                    name: staffName,
                },
            },
        };

        setInputValue("");
        startTransition(async () => {
            addOptimisticNote(newNote);

            await handleAction(
                addNewNoteAction,
                { ...newNote, date: newNote.createdAt },
                {
                    onError: () => {
                        setInputValue(noteContent);
                    },
                },
            );
            router.refresh();
        });
    };
    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [optimisticNotes.length]);

    return (
        <section id="staff-notes" className=" lg:col-span-3  dark:bg-surface-dark rounded-xl p-5 shadow-lg border border-[#e7f3eb] dark:border-[#2a4034]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                    <span className="text-primary">
                        <StickyNote />
                    </span>
                    Staff Notes
                </h3>
                <Button variant="link" disabled={optimisticNotes.length === 0}>
                    View All
                </Button>
            </div>

            {optimisticNotes.length === 0 ? (
                <div className="max-h-50">
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                        <div className="mb-4 bg-[#f1f6f2] dark:bg-[#23382b] p-4 rounded-full">
                            <span className="  text-gray-400 dark:text-gray-500">
                                <FilePen size={40} />
                            </span>
                        </div>
                        <h1 className="text-2xl font-medium ">No notes yet</h1>
                        <p className="font-normal  max-w-xs text-primary">
                            Start by adding a note about {member.name} to keep
                            the team informed.
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className="space-y-2 max-h-50 overflow-y-scroll pb-3"
                    ref={listRef}
                >
                    {optimisticNotes.map((note) => (
                        <div key={note.id}>
                            <div className="bg-[#f8fcf9] dark:bg-[#102216] p-3 rounded-lg border border-[#e7f3eb] dark:border-[#2a4034]">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                                        {note.staff?.user?.name}
                                    </p>
                                    <p className="text-[10px] md:text-xs text-text-sub-light font-medium">
                                        {formatDate(note.createdAt)}
                                    </p>
                                </div>
                                <p className="text-sm md:text-base text-text-main-light dark:text-text-main-dark font-medium leading-relaxed">
                                    {note.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-4 flex items-center gap-3">
                <Input
                    className="w-full h-11 bg-[#f8fcf9] dark:bg-[#102216] border border-[#e7f3eb] dark:border-[#2a4034]  text-sm  focus:border-primary "
                    placeholder="Add a new note..."
                    type="text"
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                />
                <Button
                    onClick={handleAddNewNote}
                    disabled={!inputValue.trim()}
                    className="p-4 bg-primary text-black rounded hover:bg-[#0fd650] transition-colors disabled:opacity-50"
                >
                    <SendHorizonal size={20} />
                </Button>
            </div>
        </section>
    );
};

export default StaffNotes;
