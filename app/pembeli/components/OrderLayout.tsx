import { ReactNode } from "react";
import Image from "next/image";

type OrderLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function OrderLayout({ children, title }: OrderLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-400 to-green-500 px-4 py-8">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <Image src="/Frame 7.png" alt="Tuang Logo" width={40} height={40} className="mr-2" />
          <h1 className="font-bold text-2xl text-gray-800">Tuang</h1>
        </div>
        
        <h2 className="font-bold text-xl mb-6 text-center text-gray-800 border-b border-gray-100 pb-3">{title}</h2>
        
        {children}
      </div>
    </div>
  );
}