import * as React from 'react';
import Link from '@mui/material/Link';
import { ChevronLeft } from 'lucide-react';
  
interface ManualBreadCrumbProps {
  title: string;
  href?: string;
}
export default function ManualBreadCrumb(
  { 
    title, 
    href = "/"
  }: ManualBreadCrumbProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Link href={href}
      style={{ textDecoration: 'none', color: 'inherit' }}>

    <div className="flex items-center">
        <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
      <span>
        <p className="text-xl md:text-2xl font-black text-black ">
          {title}
        </p>
      </span>
    </div>
      </Link>
  </div>
  );
}