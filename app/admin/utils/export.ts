/**
 * Downloads data as a CSV file
 * @param filename Name for the downloaded file
 * @param rows Data to be included in the CSV
 */
export function downloadCSV(filename: string, rows: string[][]): void {
  const process = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
  const content = rows.map(row => row.map(process).join(",")).join("\r\n");
  const blob = new Blob([content], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}