# Testing Patterns for API Endpoints

This document provides comprehensive guidance for writing unit tests and integration tests for API endpoints in the OctoCAT Supply Chain application.

## Overview

**Always create unit tests** for new repositories in `api/src/repositories/{entity}sRepo.test.ts`.

All tests use Vitest as the testing framework with the following key libraries:
- `vitest` - Test runner and assertion library
- `supertest` - HTTP testing for route integration tests (optional)

## Repository Unit Tests

### Test File Structure

Create tests in `api/src/repositories/{entity}sRepo.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EntityNamesRepository } from './entityNamesRepo';
import { NotFoundError } from '../utils/errors';
import { DatabaseRow } from '../utils/sql';

describe('EntityNamesRepository', () => {
  let repository: EntityNamesRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
      close: vi.fn()
    };
    repository = new EntityNamesRepository(mockDb);
    vi.clearAllMocks();
  });

  // Test suites for each method...
});
```

### Required Test Coverage

Test all CRUD operations with the following scenarios:

#### findAll()
```typescript
describe('findAll', () => {
  it('should return all entities mapped to camelCase', async () => {
    const mockRows: DatabaseRow[] = [
      { entity_name_id: 1, name: 'Test 1', status: 'active' },
      { entity_name_id: 2, name: 'Test 2', status: 'inactive' }
    ];
    mockDb.all.mockResolvedValue(mockRows);

    const result = await repository.findAll();

    expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM entity_names ORDER BY entity_name_id');
    expect(result).toEqual([
      { entityNameId: 1, name: 'Test 1', status: 'active' },
      { entityNameId: 2, name: 'Test 2', status: 'inactive' }
    ]);
  });

  it('should handle empty result set', async () => {
    mockDb.all.mockResolvedValue([]);

    const result = await repository.findAll();

    expect(result).toEqual([]);
  });

  it('should handle database errors', async () => {
    mockDb.all.mockRejectedValue(new Error('Database connection failed'));

    await expect(repository.findAll()).rejects.toThrow();
  });
});
```

#### findById()
```typescript
describe('findById', () => {
  it('should return entity when found', async () => {
    const mockRow: DatabaseRow = { entity_name_id: 1, name: 'Test', status: 'active' };
    mockDb.get.mockResolvedValue(mockRow);

    const result = await repository.findById(1);

    expect(mockDb.get).toHaveBeenCalledWith(
      'SELECT * FROM entity_names WHERE entity_name_id = ?',
      [1]
    );
    expect(result).toEqual({ entityNameId: 1, name: 'Test', status: 'active' });
  });

  it('should return null when not found', async () => {
    mockDb.get.mockResolvedValue(null);

    const result = await repository.findById(999);

    expect(result).toBeNull();
  });
});
```

#### create()
```typescript
describe('create', () => {
  it('should create entity and return created record', async () => {
    const newEntity = { name: 'New Entity', status: 'active' };
    const mockCreated = { entity_name_id: 5, ...newEntity };
    
    mockDb.run.mockResolvedValue({ lastID: 5, changes: 1 });
    mockDb.get.mockResolvedValue(mockCreated);

    const result = await repository.create(newEntity);

    expect(mockDb.run).toHaveBeenCalled();
    expect(mockDb.get).toHaveBeenCalledWith(
      'SELECT * FROM entity_names WHERE entity_name_id = ?',
      [5]
    );
    expect(result).toEqual({
      entityNameId: 5,
      name: 'New Entity',
      status: 'active'
    });
  });

  it('should throw error if created entity cannot be retrieved', async () => {
    mockDb.run.mockResolvedValue({ lastID: 5, changes: 1 });
    mockDb.get.mockResolvedValue(null);

    await expect(repository.create({ name: 'Test' })).rejects.toThrow(
      'Failed to retrieve created entity'
    );
  });
});
```

#### update()
```typescript
describe('update', () => {
  it('should update entity and return updated record', async () => {
    const updates = { name: 'Updated Name', status: 'inactive' };
    const mockUpdated = { entity_name_id: 1, ...updates };
    
    mockDb.run.mockResolvedValue({ changes: 1 });
    mockDb.get.mockResolvedValue(mockUpdated);

    const result = await repository.update(1, updates);

    expect(mockDb.run).toHaveBeenCalled();
    expect(result).toEqual({
      entityNameId: 1,
      name: 'Updated Name',
      status: 'inactive'
    });
  });

  it('should throw NotFoundError when entity does not exist', async () => {
    mockDb.run.mockResolvedValue({ changes: 0 });

    await expect(repository.update(999, { name: 'Test' })).rejects.toThrow(NotFoundError);
  });
});
```

#### delete()
```typescript
describe('delete', () => {
  it('should delete entity successfully', async () => {
    mockDb.run.mockResolvedValue({ changes: 1 });

    await repository.delete(1);

    expect(mockDb.run).toHaveBeenCalledWith(
      'DELETE FROM entity_names WHERE entity_name_id = ?',
      [1]
    );
  });

  it('should throw NotFoundError when entity does not exist', async () => {
    mockDb.run.mockResolvedValue({ changes: 0 });

    await expect(repository.delete(999)).rejects.toThrow(NotFoundError);
  });
});
```

#### exists()
```typescript
describe('exists', () => {
  it('should return true when entity exists', async () => {
    mockDb.get.mockResolvedValue({ count: 1 });

    const result = await repository.exists(1);

    expect(result).toBe(true);
  });

  it('should return false when entity does not exist', async () => {
    mockDb.get.mockResolvedValue({ count: 0 });

    const result = await repository.exists(999);

    expect(result).toBe(false);
  });

  it('should handle null result', async () => {
    mockDb.get.mockResolvedValue(null);

    const result = await repository.exists(999);

    expect(result).toBe(false);
  });
});
```

### Test Coverage Requirements

Your repository tests must cover:

- ✅ **CRUD operations** - Test all create, read, update, delete methods
- ✅ **Success cases** - Verify correct behavior with valid data
- ✅ **Edge cases** - Empty results, null values, boundary conditions
- ✅ **Error cases** - Database failures, not found scenarios, constraint violations
- ✅ **Mock verification** - Ensure correct SQL queries and parameters are used

## Route Integration Tests (Optional)

Create integration tests in `api/src/routes/{entity}.test.ts` to test HTTP endpoints:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import entityNameRoutes from './entityName';
import * as repo from '../repositories/entityNamesRepo';

vi.mock('../repositories/entityNamesRepo');

describe('EntityName Routes', () => {
  let app: express.Application;
  let mockRepo: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/entity-names', entityNameRoutes);
    
    mockRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };
    
    vi.mocked(repo.getEntityNamesRepository).mockResolvedValue(mockRepo);
  });

  describe('GET /api/entity-names', () => {
    it('should return all entities', async () => {
      const mockEntities = [
        { entityNameId: 1, name: 'Test 1' },
        { entityNameId: 2, name: 'Test 2' }
      ];
      mockRepo.findAll.mockResolvedValue(mockEntities);

      const response = await request(app).get('/api/entity-names');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEntities);
    });
  });

  describe('GET /api/entity-names/:id', () => {
    it('should return entity when found', async () => {
      const mockEntity = { entityNameId: 1, name: 'Test' };
      mockRepo.findById.mockResolvedValue(mockEntity);

      const response = await request(app).get('/api/entity-names/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEntity);
    });

    it('should return 404 when not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/entity-names/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/entity-names', () => {
    it('should create entity and return 201', async () => {
      const newEntity = { name: 'New Entity' };
      const createdEntity = { entityNameId: 1, ...newEntity };
      mockRepo.create.mockResolvedValue(createdEntity);

      const response = await request(app)
        .post('/api/entity-names')
        .send(newEntity);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdEntity);
    });
  });

  describe('PUT /api/entity-names/:id', () => {
    it('should update entity and return 200', async () => {
      const updates = { name: 'Updated' };
      const updatedEntity = { entityNameId: 1, name: 'Updated' };
      mockRepo.update.mockResolvedValue(updatedEntity);

      const response = await request(app)
        .put('/api/entity-names/1')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEntity);
    });

    it('should return 404 when entity not found', async () => {
      mockRepo.update.mockRejectedValue(new NotFoundError('EntityName', 999));

      const response = await request(app)
        .put('/api/entity-names/999')
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/entity-names/:id', () => {
    it('should delete entity and return 204', async () => {
      mockRepo.delete.mockResolvedValue(undefined);

      const response = await request(app).delete('/api/entity-names/1');

      expect(response.status).toBe(204);
    });

    it('should return 404 when entity not found', async () => {
      mockRepo.delete.mockRejectedValue(new NotFoundError('EntityName', 999));

      const response = await request(app).delete('/api/entity-names/999');

      expect(response.status).toBe(404);
    });
  });
});
```

## Running Tests

### Command Line

```bash
# Run all tests
npm test --workspace=api

# Run specific test file
npm test --workspace=api -- entityNamesRepo.test.ts

# Run with coverage
npm test --workspace=api -- --coverage

# Run in watch mode
npm test --workspace=api -- --watch

# Run tests matching a pattern
npm test --workspace=api -- --grep "findAll"
```

### Test Output

Vitest provides clear, formatted output showing:
- Pass/fail status for each test
- Execution time
- Coverage percentages (when using `--coverage`)
- Detailed error messages and stack traces for failures

## Best Practices

### Mocking
- Always mock database connections in unit tests
- Use `vi.fn()` for mock functions
- Clear mocks between tests with `vi.clearAllMocks()` in `beforeEach`
- Mock at the boundary (database level for repositories, repository level for routes)

### Test Organization
- Group related tests using nested `describe` blocks
- One `describe` per method/function
- Clear, descriptive test names using "should" statements
- Arrange-Act-Assert pattern in each test

### Assertions
- Verify both the result and the side effects (mock calls)
- Check exact SQL queries and parameters when relevant
- Test error types, not just that an error was thrown
- Verify HTTP status codes and response bodies in route tests

### Edge Cases to Test
- Empty collections
- Null/undefined values
- Non-existent IDs (404 scenarios)
- Constraint violations (unique, foreign key)
- Database connection failures
- Invalid input data types

## Example: Complete Test File

See `api/src/repositories/suppliersRepo.test.ts` for a complete, production-ready example following all patterns and best practices.

## Related Documentation

- See `error-handling.md` for testing error scenarios
- See `database-conventions.md` for SQLite-specific testing considerations
