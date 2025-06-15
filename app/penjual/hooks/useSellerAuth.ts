import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { penjualList } from '../utils/constants';

export default function useSellerAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/login");
      setLoading(false);
      return;
    }
    
    const u = JSON.parse(userStr);
    if (u.role !== "penjual") {
      router.replace("/login");
      setLoading(false);
      return;
    }
    
    const seller = penjualList.find(s => s.nip === u.nip);
    setUser({ ...u, id: seller?.id ?? 0 });
    setLoading(false);
  }, [router]);

  return { user, loading };
}