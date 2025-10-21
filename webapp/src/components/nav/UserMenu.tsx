'use client';

import {User} from "next-auth";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import {Avatar} from "@heroui/avatar";
import {signOut} from "next-auth/react";

type Props = {
    user: User;
}

export default function UserMenu({user}: Props) {
    return (
        <Dropdown>
            <DropdownTrigger>
                <div className='flex items-center gap-2 cursor-pointer'>
                    <Avatar color='secondary' size='sm' name={user.name?.charAt(0).toUpperCase()}/>
                    {user.name}
                </div>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem key='edit'>Edit Profile</DropdownItem>
                <DropdownItem key='logout' className='text-danger' color='danger'
                              onClick={() => signOut({redirectTo: '/'})}>Sign Out</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}