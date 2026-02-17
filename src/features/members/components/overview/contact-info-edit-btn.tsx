"use client";
import { Button } from "@/shared/components/ui/button";
import React from "react";

const ContactInfoEditBtn = () => {
    return (
        <Button
            className="text-[1rem] font-medium hover:underline"
            variant="link"
        >
            Edit
        </Button>
    );
};

export default ContactInfoEditBtn;
