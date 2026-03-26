import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pageParam: number;
  totalPages: number;
  startAt: number;
  endAt: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
}

export const CartPagination = ({ pageParam, totalPages, startAt, endAt, totalProducts, onPageChange, hasNext }: Props) => {
  const getPaginationGroup = () => {
    let start = Math.max(pageParam - 2, 1);
    const end = Math.min(start + 4, totalPages);
    if (totalPages > 5 && pageParam > totalPages - 2) start = totalPages - 4;
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex flex-col-reverse md:flex-row mx-auto justify-center items-center gap-6 mt-12 pb-10 border-t pt-8 border-gray-50">
      <div className="text-gray-500 text-sm font-medium">
        Showing <span className="text-black">{startAt}</span> to <span className="text-black">{endAt}</span> of <span className="text-black">{totalProducts}</span> results
      </div>
      <nav className="flex items-center gap-1">
        <button 
          onClick={() => onPageChange(pageParam - 2)} 
          disabled={pageParam === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} /> Previous
        </button>
        {getPaginationGroup().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page - 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all cursor-pointer ${
              pageParam === page ? "bg-cprojectthree text-white shadow-md  shadow-cprojectthree scale-110 animate-bounce" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button 
          onClick={() => onPageChange(pageParam)} 
          disabled={!hasNext}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          Next Page <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
};