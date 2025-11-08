import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { id: 'desc' } });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const data = await req.json();
  const task = await prisma.task.create({
    data: { title: data.title, status: 'TODO' },
  });
  return NextResponse.json(task);
}