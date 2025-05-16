
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "trainings.json");

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const fileData = await fs.readFile(filePath, "utf-8");
    let trainings = JSON.parse(fileData);

    trainings = trainings.filter((t: any) => t.id !== id);

    await fs.writeFile(filePath, JSON.stringify(trainings, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Treinamento excluído." });
  } catch (error) {
    console.error("Erro ao excluir treinamento:", error);
    return NextResponse.json({ success: false, error: "Erro ao excluir o treinamento." }, { status: 500 });
  }
}
