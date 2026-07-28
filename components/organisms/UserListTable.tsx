import React from "react";
import { UserRowItem } from "../molecules/UserRowItem";
import { SearchBar } from "../molecules/SearchBar";
import { ScrollContainer } from "../atoms/ScrollContainer";

export interface UserData {
    id: string;
    name: string;
    username: string;
    email?: string;
    role
}