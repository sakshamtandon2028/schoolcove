import ExcelJS from "exceljs";
import { q } from "@/lib/db";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return new Response("Please log in.", { status: 401 });
  const isAdmin = user.role === "admin";
  if (!isAdmin && (user.status !== "approved" || !user.school_id)) return new Response("Not allowed.", { status: 403 });

  const filter = Number(new URL(req.url).searchParams.get("school")) || null;
  const where: string[] = [], params: any[] = [];
  if (!isAdmin) { params.push(user.school_id); where.push(`l.school_id=$${params.length}`, `l.unlocked`); }
  else if (filter) { params.push(filter); where.push(`l.school_id=$${params.length}`); }
  const rows = await q(
    `select l.*, s.name as school, s.locality from leads l join schools s on s.id=l.school_id ${where.length ? "where " + where.join(" and ") : ""} order by l.created_at desc`, params);

  const wb = new ExcelJS.Workbook();
  wb.creator = "SchoolCove";
  const ws = wb.addWorksheet("Enquiries", { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = [
    { header: "Date", key: "date", width: 14 },
    { header: "School", key: "school", width: 38 },
    { header: "Area", key: "locality", width: 20 },
    { header: "Parent name", key: "parent_name", width: 24 },
    { header: "Phone / WhatsApp", key: "phone", width: 20 },
    { header: "Email", key: "email", width: 28 },
    { header: "Child's age", key: "child_age", width: 16 },
    { header: "Interested in", key: "program", width: 22 },
    { header: "Start from", key: "start_month", width: 22 },
    { header: "Message", key: "message", width: 44 },
    { header: "Status", key: "status", width: 16 },
    ...(isAdmin ? [{ header: "Shared with school", key: "shared", width: 18 }] : []),
  ];
  for (const r of rows) ws.addRow({ ...r, date: new Date(r.created_at), shared: r.unlocked ? "Yes" : "No" });
  ws.getColumn("date").numFmt = "dd mmm yyyy";
  const head = ws.getRow(1);
  head.font = { bold: true, color: { argb: "FFFFFFFF" } };
  head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE85D5D" } };
  head.height = 22;
  ws.autoFilter = { from: "A1", to: { row: 1, column: ws.columnCount } };

  const buf = await wb.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="schoolcove-enquiries-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
