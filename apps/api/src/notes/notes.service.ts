import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateNoteInput, UpdateNoteInput } from '@repo/contracts';
import type { Note } from '@repo/db';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async listNotes(): Promise<Note[]> {
    return this.prisma.note.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    return this.prisma.note.create({
      data: input,
    });
  }

  async updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    try {
      return await this.prisma.note.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (this.isMissingRecordError(error)) {
        throw new NotFoundException(`Note ${id} not found`);
      }

      throw error;
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      await this.prisma.note.delete({
        where: { id },
      });
    } catch (error) {
      if (this.isMissingRecordError(error)) {
        throw new NotFoundException(`Note ${id} not found`);
      }

      throw error;
    }
  }

  private isMissingRecordError(error: unknown): error is { code: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    );
  }
}
