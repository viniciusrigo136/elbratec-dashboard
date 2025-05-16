
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "trainings.json");

export async function POST(request: NextRequest) {
  try {
    const newTraining = await request.json();

    const fileData = await fs.readFile(filePath, "utf-8");
    const trainings = JSON.parse(fileData);

    trainings.push(newTraining);

    await fs.writeFile(filePath, JSON.stringify(trainings, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Treinamento salvo com sucesso." });
  } catch (error) {
    console.error("Erro ao salvar treinamento:", error);
    return NextResponse.json({ success: false, error: "Erro ao salvar o treinamento." }, { status: 500 });
  }
}
