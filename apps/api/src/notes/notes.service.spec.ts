import { NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotesService', () => {
  const findMany = jest.fn();
  const create = jest.fn();
  const update = jest.fn();
  const remove = jest.fn();

  const prisma = {
    note: {
      findMany,
      create,
      update,
      delete: remove,
    },
  } as unknown as PrismaService;

  let notesService: NotesService;

  beforeEach(() => {
    jest.clearAllMocks();
    notesService = new NotesService(prisma);
  });

  it('should list notes ordered by latest update', async () => {
    findMany.mockResolvedValue([]);

    await expect(notesService.listNotes()).resolves.toEqual([]);
    expect(findMany).toHaveBeenCalledWith({
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('should create a note', async () => {
    const createdNote = { id: 'note-1', title: 'A', body: 'B' };
    create.mockResolvedValue(createdNote);

    await expect(
      notesService.createNote({ title: 'A', body: 'B' }),
    ).resolves.toBe(createdNote);
    expect(create).toHaveBeenCalledWith({
      data: { title: 'A', body: 'B' },
    });
  });

  it('should return not found when updating a missing note', async () => {
    update.mockRejectedValue({ code: 'P2025' });

    await expect(
      notesService.updateNote('6ef395c0-0d29-4f18-9f4b-06ce3552747c', {
        title: 'Updated',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should return not found when deleting a missing note', async () => {
    remove.mockRejectedValue({ code: 'P2025' });

    await expect(
      notesService.deleteNote('6ef395c0-0d29-4f18-9f4b-06ce3552747c'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
