import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
jest.mock('@repo/contracts', () => ({
  parseCreateNoteInput: (data: unknown) => {
    if (
      typeof data !== 'object' ||
      data === null ||
      !('title' in data) ||
      typeof data.title !== 'string' ||
      data.title.trim().length === 0 ||
      !('body' in data) ||
      typeof data.body !== 'string' ||
      data.body.trim().length === 0 ||
      !('type' in data) ||
      (data.type !== 'danger' &&
        data.type !== 'success' &&
        data.type !== 'info' &&
        data.type !== 'warning')
    ) {
      throw new Error('Invalid create note payload');
    }

    return data;
  },
  parseNoteId: (data: unknown) => {
    if (
      typeof data !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        data,
      )
    ) {
      throw new Error('Invalid note id');
    }

    return data;
  },
  parseNoteResponse: (data: unknown) => data,
  parseNotesResponse: (data: unknown) => data,
  parseUpdateNoteInput: (data: unknown) => data,
}));
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

describe('NotesController', () => {
  let notesController: NotesController;

  const notesService = {
    listNotes: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: notesService,
        },
      ],
    }).compile();

    notesController = app.get<NotesController>(NotesController);
  });

  it('should return notes as serialized API responses', async () => {
    notesService.listNotes.mockResolvedValue([
      {
        id: '6ef395c0-0d29-4f18-9f4b-06ce3552747c',
        title: 'First note',
        body: 'Body',
        type: 'warning',
        createdAt: new Date('2026-03-21T10:00:00.000Z'),
        updatedAt: new Date('2026-03-21T11:00:00.000Z'),
      },
    ]);

    await expect(notesController.listNotes()).resolves.toEqual([
      {
        id: '6ef395c0-0d29-4f18-9f4b-06ce3552747c',
        title: 'First note',
        body: 'Body',
        type: 'warning',
        createdAt: '2026-03-21T10:00:00.000Z',
        updatedAt: '2026-03-21T11:00:00.000Z',
      },
    ]);
    expect(notesService.listNotes).toHaveBeenCalledTimes(1);
  });

  it('should reject invalid create payloads', async () => {
    await expect(
      notesController.createNote({ title: '   ', body: 'Body', type: 'info' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should forward deletes after validating the note id', async () => {
    notesService.deleteNote.mockResolvedValue(undefined);

    await expect(
      notesController.deleteNote('6ef395c0-0d29-4f18-9f4b-06ce3552747c'),
    ).resolves.toBeUndefined();
    expect(notesService.deleteNote).toHaveBeenCalledWith(
      '6ef395c0-0d29-4f18-9f4b-06ce3552747c',
    );
  });
});
