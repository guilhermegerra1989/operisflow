import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import ExcelJS from "exceljs";
import path from "path";
import { ExportEstoqueDto } from './dto/export-estoque.dto';

@Injectable()
export class OrdersExportService {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }



 async generateOrderExcel(order: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const templatePath = path.join(
      process.cwd(),
      "apps",
      "operisflow-api",
      "templates",
      "template_pedido.xlsx"
    );


    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.worksheets[0];

    // ===============================
    // HEADER
    // ===============================
    const createdAt = new Date(order.createdAt);
    const month = createdAt
      .toLocaleString("pt-BR", { month: "long" })
      .toUpperCase();
    const year = createdAt.getFullYear();

    if(order.tipo === "volante"){
      worksheet.getCell("B5").value = 'PEDIDO\n REMANU - '+month+' / '+year;
    }else{
      worksheet.getCell("B5").value = 'PEDIDO\n ESPORTIVO - '+month+' / '+year;
    }
    worksheet.getCell("B5").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
    
    worksheet.getCell("E5").value = `PEDIDO\n N. ${order.orderNumber}`;
    worksheet.getCell("E5").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };


    worksheet.getCell("B7").value = order.client.name;
    worksheet.getCell("B8").value = order.client.address;
    worksheet.getCell("B9").value = order.client.cnpj;
    worksheet.getCell("B10").value = order.client.email;
    worksheet.getCell("B11").value = order.client.phone;

    // ===============================
    // ITEMS (dinâmicos, com estilo)
    // ===============================
    const START_ROW = 14;
    const TEMPLATE_ROW = 14;

    const templateRow = worksheet.getRow(TEMPLATE_ROW);

    order.items.forEach((item, index) => {
      const currentRow =
        index === 0 ? TEMPLATE_ROW : TEMPLATE_ROW + index;

      if (index > 0) {
        worksheet.insertRow(currentRow, [], "i");
        const newRow = worksheet.getRow(currentRow);

        templateRow.eachCell({ includeEmpty: true }, (cell, col) => {
          const newCell = newRow.getCell(col);
          newCell.value = cell.value;
          newCell.style = { ...cell.style };
        });
      }

      const row = worksheet.getRow(currentRow);
      row.getCell("A").value = item.code;
      row.getCell("B").value = item.description;
      row.getCell("C").value = item.quantity;
      row.getCell("D").value = item.unitPrice;
    });

    // ✅ TOTAL DE QTDE
    const lastItemRow = START_ROW + order.items.length - 1;
    const totalRow = lastItemRow + 1;

    worksheet.getCell(`B${totalRow}`).value = "TOTAL";
    worksheet.getCell(`C${totalRow}`).value = {
      formula: `SUM(C${START_ROW}:C${lastItemRow})`,
    };

    // ===============================
    // RETURN BUFFER
    // ===============================
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
 

async generateEstoqueExcel(estoque: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // ✅ path compatível com Render (assets do nest-cli)
  const templatePath = path.join(
    process.cwd(),
    "dist",
    "templates",
    "template_estoque_pedido.xlsx"
  );

  await workbook.xlsx.readFile(templatePath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("Worksheet não encontrada no template");
  }

  const START_ROW = 9; // 🔴 linha modelo do template
  const templateRow = worksheet.getRow(START_ROW);

  // ✅ 1. Inserir TODAS as linhas necessárias de uma vez
  if (estoque.length > 1) {
    worksheet.insertRows(
      START_ROW + 1,
      new Array(estoque.length - 1).fill([])
    );
  }

  // ✅ 2. Copiar estilo da linha modelo para as novas linhas
  for (let i = 1; i < estoque.length; i++) {
    const row = worksheet.getRow(START_ROW + i);

    templateRow.eachCell({ includeEmpty: true }, (cell, col) => {
      const targetCell = row.getCell(col);
      targetCell.style = { ...cell.style };
    });
  }

  // ✅ 3. Preencher os dados
  estoque.forEach((item, index) => {
    const row = worksheet.getRow(START_ROW + index);

    row.getCell("A").value = item.codigo ?? "";
    row.getCell("B").value = item.descricao ?? "";
    row.getCell("C").value = Number(item.qtd_pedidos ?? 0);
    row.getCell("D").value = Number(item.qtd_estoque ?? 0);
    row.getCell("E").value = Number(item.qtd_injetar ?? 0);

    row.commit();
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}


}