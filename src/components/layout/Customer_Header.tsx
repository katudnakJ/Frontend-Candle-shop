"use client";

import { Menu, MenuButton, MenuItem, MenuItems, Transition} from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  ChevronDown,
  Home,
  UserCircle,
  ClipboardList,
} from "lucide-react";


const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-cprojectone backdrop-blur-md font-sans">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-medium text-black hover:text-yellow-500 transition-colors"
          >
            <Home className="w-6 h-6 md:w-8 md:h-8 text-black" />
            
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/customer/myshoppingcart"
            className="relative p-1  text-black hover:text-yellow-500 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
              0
            </span>
          </Link>

          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center gap-1 cursor-pointer group outline-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black text-black group-hover:text-yellow-500 transition-colors">
                <User size={30} />
              </div>
              <ChevronDown size={18} className="text-black" />
            </MenuButton>
            <Transition
             
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >

            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-cprojectone shadow-md ring-1 ring-black ring-opacity-10 focus:outline-none z-50 boarder border-gray-200
              before:content-[''] 
              before:absolute 
              before:-top-[8.8px]
              before:right-4 
              before:w-4 
              before:h-4 
              before:bg-cprojectone 
              before:rotate-45 
              before:border-l 
              before:border-t 
              before:border-black
              before:z-[-1]
              "
              >
            
              <div className="py-1">
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      href="/customer/profile"
                      className={`${focus ? "bg-yellow-50 text-yellow-600" : "text-gray-700"} flex items-center px-4 py-2 text-sm`}
                    >
                      <UserCircle size={20} className="mr-2" />
                      บัญชีผู้ใช้
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      href="/customer/orders"
                      className={`${focus ? "bg-yellow-50 text-yellow-600" : "text-gray-700"} flex items-center px-4 py-2 text-sm`}
                    >
                    <ClipboardList size={18} className="mr-2 " />
                      ประวัติการสั่งซื้อ
                    </Link>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
            </Transition>
          </Menu>

        </div>
      </div>
    </header>
  );
};

export default Header;
