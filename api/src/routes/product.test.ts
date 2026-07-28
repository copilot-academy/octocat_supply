import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter from './product';
import { DatabaseError, errorHandler, NotFoundError, ValidationError } from '../utils/errors';
import { getProductsRepository } from '../repositories/productsRepo';

vi.mock('../repositories/productsRepo', () => ({
  getProductsRepository: vi.fn(),
}));

let app: express.Express;
const mockRepo = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByName: vi.fn(),
};
const mockedGetProductsRepository = getProductsRepository as Mock;

describe('Product API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetProductsRepository.mockResolvedValue(mockRepo);

    app = express();
    app.use(express.json());
    app.use('/products', productRouter);
    app.use(errorHandler);
  });

  const newProduct = {
    supplierId: 1,
    name: 'Notebook',
    description: 'Hardcover notebook',
    price: 19.99,
    sku: 'NB-001',
    unit: 'piece',
    imgName: 'notebook.png',
    discount: 0.1,
  };

  it('should create a new product', async () => {
    mockRepo.create.mockResolvedValue({ productId: 1, ...newProduct });

    const response = await request(app).post('/products').send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newProduct);
    expect(response.body.productId).toBe(1);
  });

  it('should get all products', async () => {
    mockRepo.findAll.mockResolvedValue([{ productId: 1, ...newProduct }]);

    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('should get a product by ID', async () => {
    mockRepo.findById.mockResolvedValue({ productId: 1, ...newProduct });

    const response = await request(app).get('/products/1');

    expect(response.status).toBe(200);
    expect(response.body.productId).toBe(1);
  });

  it('should update a product by ID', async () => {
    const updatedProduct = {
      ...newProduct,
      name: 'Updated Notebook',
      price: 24.99,
    };
    mockRepo.update.mockResolvedValue({ productId: 1, ...updatedProduct });

    const response = await request(app).put('/products/1').send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Notebook');
    expect(response.body.price).toBe(24.99);
  });

  it('should delete a product by ID', async () => {
    mockRepo.delete.mockResolvedValue(undefined);

    const response = await request(app).delete('/products/1');

    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existing product', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const response = await request(app).get('/products/99999');

    expect(response.status).toBe(404);
  });

  it('should return 404 when updating non-existing product', async () => {
    mockRepo.update.mockRejectedValue(new NotFoundError('Product', 99999));

    const response = await request(app).put('/products/99999').send(newProduct);

    expect(response.status).toBe(404);
  });

  it('should return 404 when deleting non-existing product', async () => {
    mockRepo.delete.mockRejectedValue(new NotFoundError('Product', 99999));

    const response = await request(app).delete('/products/99999');

    expect(response.status).toBe(404);
  });

  it('should return 404 for malformed product ID', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const response = await request(app).get('/products/not-a-number');

    expect(response.status).toBe(404);
    expect(mockRepo.findById).toHaveBeenCalledWith(Number.NaN);
  });

  it('should return 400 for invalid request payload', async () => {
    mockRepo.create.mockRejectedValue(new ValidationError('Required fields are missing'));

    const response = await request(app).post('/products').send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 for validation/business rule errors', async () => {
    mockRepo.create.mockRejectedValue(
      new DatabaseError('Validation failed for product data', 'UNPROCESSABLE_ENTITY', 422),
    );

    const response = await request(app).post('/products').send(newProduct);

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('UNPROCESSABLE_ENTITY');
  });
});