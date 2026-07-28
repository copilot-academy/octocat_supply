import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter from './supplier';
import { DatabaseError, errorHandler, NotFoundError, ValidationError } from '../utils/errors';
import { getSuppliersRepository } from '../repositories/suppliersRepo';

vi.mock('../repositories/suppliersRepo', () => ({
  getSuppliersRepository: vi.fn(),
}));

let app: express.Express;
const mockRepo = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
const mockedGetSuppliersRepository = getSuppliersRepository as Mock;

describe('Supplier API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetSuppliersRepository.mockResolvedValue(mockRepo);

    app = express();
    app.use(express.json());
    app.use('/suppliers', supplierRouter);
    app.use(errorHandler);
  });

  const newSupplier = {
    name: 'Northwind Supplies',
    description: 'Office and logistics supplier',
    contactPerson: 'Alex Kim',
    email: 'alex@northwind.test',
    phone: '555-2222',
    active: true,
    verified: false,
  };

  it('should create a new supplier', async () => {
    mockRepo.create.mockResolvedValue({ supplierId: 1, ...newSupplier });

    const response = await request(app).post('/suppliers').send(newSupplier);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newSupplier);
    expect(response.body.supplierId).toBe(1);
  });

  it('should get all suppliers', async () => {
    mockRepo.findAll.mockResolvedValue([{ supplierId: 1, ...newSupplier }]);

    const response = await request(app).get('/suppliers');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('should get a supplier by ID', async () => {
    mockRepo.findById.mockResolvedValue({ supplierId: 1, ...newSupplier });

    const response = await request(app).get('/suppliers/1');

    expect(response.status).toBe(200);
    expect(response.body.supplierId).toBe(1);
  });

  it('should update a supplier by ID', async () => {
    const updatedSupplier = {
      ...newSupplier,
      name: 'Northwind Global Supplies',
      verified: true,
    };
    mockRepo.update.mockResolvedValue({ supplierId: 1, ...updatedSupplier });

    const response = await request(app).put('/suppliers/1').send(updatedSupplier);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Northwind Global Supplies');
    expect(response.body.verified).toBe(true);
  });

  it('should delete a supplier by ID', async () => {
    mockRepo.delete.mockResolvedValue(undefined);

    const response = await request(app).delete('/suppliers/1');

    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existing supplier', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const response = await request(app).get('/suppliers/99999');

    expect(response.status).toBe(404);
  });

  it('should return 404 when updating non-existing supplier', async () => {
    mockRepo.update.mockRejectedValue(new NotFoundError('Supplier', 99999));

    const response = await request(app).put('/suppliers/99999').send(newSupplier);

    expect(response.status).toBe(404);
  });

  it('should return 404 when deleting non-existing supplier', async () => {
    mockRepo.delete.mockRejectedValue(new NotFoundError('Supplier', 99999));

    const response = await request(app).delete('/suppliers/99999');

    expect(response.status).toBe(404);
  });

  it('should return 404 for malformed supplier ID', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const response = await request(app).get('/suppliers/not-a-number');

    expect(response.status).toBe(404);
    expect(mockRepo.findById).toHaveBeenCalledWith(Number.NaN);
  });

  it('should return 200 with APPROVED status for active supplier', async () => {
    mockRepo.findById.mockResolvedValue({
      supplierId: 1,
      ...newSupplier,
      active: true,
      verified: false,
    });

    const response = await request(app).get('/suppliers/1/status');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('APPROVED');
  });

  it('should return 400 for invalid request payload', async () => {
    mockRepo.create.mockRejectedValue(new ValidationError('Name is required'));

    const response = await request(app).post('/suppliers').send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 for validation/business rule errors', async () => {
    mockRepo.update.mockRejectedValue(
      new DatabaseError('Supplier state transition invalid', 'UNPROCESSABLE_ENTITY', 422),
    );

    const response = await request(app).put('/suppliers/1').send(newSupplier);

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('UNPROCESSABLE_ENTITY');
  });
});