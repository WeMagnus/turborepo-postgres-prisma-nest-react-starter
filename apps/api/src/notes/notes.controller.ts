import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  parseCreateNoteInput,
  parseNoteId,
  parseNoteResponse,
  parseNotesResponse,
  parseUpdateNoteInput,
  type NoteResponse,
  type NotesResponse,
} from '@repo/contracts';
import type { Note } from '@repo/db';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async listNotes(): Promise<NotesResponse> {
    return parseNotesResponse(
      (await this.notesService.listNotes()).map((note) =>
        this.toNoteResponse(note),
      ),
    );
  }

  @Post()
  async createNote(@Body() body: unknown): Promise<NoteResponse> {
    const input = this.parseRequest(parseCreateNoteInput, body);

    return parseNoteResponse(
      this.toNoteResponse(await this.notesService.createNote(input)),
    );
  }

  @Patch(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<NoteResponse> {
    const noteId = this.parseRequest(parseNoteId, id);
    const input = this.parseRequest(parseUpdateNoteInput, body);

    return parseNoteResponse(
      this.toNoteResponse(await this.notesService.updateNote(noteId, input)),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNote(@Param('id') id: string): Promise<void> {
    const noteId = this.parseRequest(parseNoteId, id);
    await this.notesService.deleteNote(noteId);
  }

  private parseRequest<T>(parser: (data: unknown) => T, data: unknown): T {
    try {
      return parser(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid notes request';
      throw new BadRequestException(message);
    }
  }

  private toNoteResponse(note: Note): NoteResponse {
    return {
      id: note.id,
      title: note.title,
      body: note.body,
      type: note.type,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt?.toISOString() ?? null,
    };
  }
}
