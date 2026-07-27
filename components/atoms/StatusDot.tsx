import React from "react";

interface StatusDotProps {
    status: "rejected" | "pending" | "approved";
}

export const StatusDot =  ({ status }: StatusDotProps) =>{
    const colors = {
        rejected: "bg-red-500",     //needs revision / rejected 
        pending: "bg-amber-500",    //waiting approval
        approved: "bg-green-500",   //approved
    };

    return (
        <span
            className={`inline-block w-4 h-4 rounded-full ${colors[status]}`}
            title={status}
        />
    );
};  