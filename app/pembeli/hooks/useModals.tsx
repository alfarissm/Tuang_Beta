import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useModals = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Nomor meja dari URL/manual
  const mejaFromUrl = searchParams.get("meja");
  const [currentTable, setCurrentTable] = useState<string | null>(mejaFromUrl || null);

  // Modal meja
  const [manualModalVisible, setManualModalVisible] = useState(!mejaFromUrl);
  const [tableNumber, setTableNumber] = useState("");

  const handleConfirmTable = () => {
    if (tableNumber) {
      setCurrentTable(tableNumber);
      setManualModalVisible(false);
      router.replace(`?meja=${tableNumber}`);
    }
  };

  return {
    currentTable,
    manualModalVisible,
    tableNumber,
    setTableNumber,
    handleConfirmTable
  };
};