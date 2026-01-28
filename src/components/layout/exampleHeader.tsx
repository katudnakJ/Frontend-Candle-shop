"use client";


import { useEffect, useState, useRef,} from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("keydown", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

     if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-cprojectone backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href="/customer/home"
            className="flex items-center gap-2 text-base font-medium text-black hover:text-yellow-500 transition-colors"
          >
            <Home size={30} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/customer/myshoppingcart"
            className="relative p-1  text-black hover:text-yellow-500 transition-colors"
          >
            <ShoppingCart size={30} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
              0
            </span>
          </Link>
          <div className="relative" ref={menuRef}>
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border  border-black text-black hover:text-yellow-500 transition-colors">
                <User size={30} />
              </div>
              <ChevronDown
                size={18}
                className={`text-black transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <Link
                  href="/customer/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle size={20} />
                  บัญชีผู้ใช้
                </Link>
                <Link
                  href="/customer/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                  onClick={() => setIsOpen(false)}
                >
                  <ClipboardList size={18} />
                  ประวัติการสั่งซื้อ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
