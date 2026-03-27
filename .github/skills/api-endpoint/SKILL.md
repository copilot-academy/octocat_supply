---
name: api-endpoint
description: Generate REST API endpoints for the OctoCAT Supply Chain application following established patterns. Use this skill when creating new CRUD endpoints, adding routes, implementing repository classes, or defining TypeScript models with Swagger documentation. Triggers on requests to add API features, create endpoints, implement data access layers, or extend the Express.js backend.
---

# API Endpoint Development

This skill guides the creation of REST API endpoints following the OctoCAT Supply Chain application's established patterns.

## Architecture Overview

The API follows a layered architecture:
```
Routes (Express.js) → Repository (Data Access) → SQLite Database
     ↓                      ↓
   Models              SQL Utilities
```

## When to Use This Skill

- Creating new CRUD endpoints for entities
- Adding a new model/entity to the system
- Implementing repository classes for data access
- Writing Swagger/OpenAPI documentation
- Extending existing routes with new operations

## Workflow

### Step 1: Define the Model

Create a TypeScript interface in `api/src/models/{entity}.ts` with Swagger schema documentation.

**Pattern:**
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     EntityName:
 *       type: object
 *       required:
 *         - entityNameId
 *         - name
 *       properties:
 *         entityNameId:
 *           type: integer
 *           description: The unique identifier
 *         name:
 *           type: string
 *           description: The name field
 *         // ... other properties
 */
export interface EntityName {
  entityNameId: number;
  name: string;
  // ... other fields using camelCase
}
```

**Key conventions:**
- Primary key: `{entityName}Id` (camelCase)
- Use `boolean` for flags, `string` for dates (ISO format)
- Include Swagger `@swagger` JSDoc comments above the interface

### Step 2: Create the Repository

Create `api/src/repositories/{entityName}sRepo.ts` following the repository pattern.

**Required imports:**
```typescript
import { getDatabase, DatabaseConnection } from '../db/sqlite';
import { EntityName } from '../models/entityName';
import { handleDatabaseError, NotFoundError } from '../utils/errors';
import { buildInsertSQL, buildUpdateSQL, objectToCamelCase, mapDatabaseRows, DatabaseRow } from '../utils/sql';
```

**Repository class structure:**
```typescript
export class EntityNamesRepository {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async findAll(): Promise<EntityName[]> {
    try {
      const rows = await this.db.all<DatabaseRow>('SELECT * FROM entity_names ORDER BY entity_name_id');
      return mapDatabaseRows<EntityName>(rows);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findById(id: number): Promise<EntityName | null> {
    try {
      const row = await this.db.get<DatabaseRow>('SELECT * FROM entity_names WHERE entity_name_id = ?', [id]);
      return row ? objectToCamelCase<EntityName>(row) : null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async create(entity: Omit<EntityName, 'entityNameId'>): Promise<EntityName> {
    try {
      const { sql, values } = buildInsertSQL('entity_names', entity);
      const result = await this.db.run(sql, values);
      const created = await this.findById(result.lastID || 0);
      if (!created) throw new Error('Failed to retrieve created entity');
      return created;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async update(id: number, entity: Partial<Omit<EntityName, 'entityNameId'>>): Promise<EntityName> {
    try {
      const { sql, values } = buildUpdateSQL('entity_names', entity, 'entity_name_id = ?');
      const result = await this.db.run(sql, [...values, id]);
      if (result.changes === 0) throw new NotFoundError('EntityName', id);
      const updated = await this.findById(id);
      if (!updated) throw new Error('Failed to retrieve updated entity');
      return updated;
    } catch (error) {
      handleDatabaseError(error, 'EntityName', id);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.db.run('DELETE FROM entity_names WHERE entity_name_id = ?', [id]);
      if (result.changes === 0) throw new NotFoundError('EntityName', id);
    } catch (error) {
      handleDatabaseError(error, 'EntityName', id);
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.db.get<{ count: number }>(
        'SELECT COUNT(*) as count FROM entity_names WHERE entity_name_id = ?', [id]
      );
      return (result?.count || 0) > 0;
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
```

**Add factory and singleton pattern:**
```typescript
export async function createEntityNamesRepository(isTest: boolean = false): Promise<EntityNamesRepository> {
  const db = await getDatabase(isTest);
  return new EntityNamesRepository(db);
}

let entityNamesRepo: EntityNamesRepository | null = null;

export async function getEntityNamesRepository(isTest: boolean = false): Promise<EntityNamesRepository> {
  if (!entityNamesRepo) {
    entityNamesRepo = await createEntityNamesRepository(isTest);
  }
  return entityNamesRepo;
}
```

### Step 3: Create the Route

Create `api/src/routes/{entityName}.ts` with Swagger documentation and Express handlers.

**Swagger documentation pattern (at top of file):**
```typescript
/**
 * @swagger
 * tags:
 *   name: EntityNames
 *   description: API endpoints for managing entity names
 */

/**
 * @swagger
 * /api/entity-names:
 *   get:
 *     summary: Returns all entity names
 *     tags: [EntityNames]
 *     responses:
 *       200:
 *         description: List of all entity names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EntityName'
 *   post:
 *     summary: Create a new entity name
 *     tags: [EntityNames]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntityName'
 *     responses:
 *       201:
 *         description: Entity created successfully
 *
 * /api/entity-names/{id}:
 *   get:
 *     summary: Get by ID
 *     tags: [EntityNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entity found
 *       404:
 *         description: Entity not found
 *   put:
 *     summary: Update by ID
 *     tags: [EntityNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntityName'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete by ID
 *     tags: [EntityNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
```

**Route handlers:**
```typescript
import express from 'express';
import { EntityName } from '../models/entityName';
import { getEntityNamesRepository } from '../repositories/entityNamesRepo';
import { NotFoundError } from '../utils/errors';

const router = express.Router();

// Create
router.post('/', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const newEntity = await repo.create(req.body as Omit<EntityName, 'entityNameId'>);
    res.status(201).json(newEntity);
  } catch (error) {
    next(error);
  }
});

// Read all
router.get('/', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const entities = await repo.findAll();
    res.json(entities);
  } catch (error) {
    next(error);
  }
});

// Read one
router.get('/:id', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const entity = await repo.findById(parseInt(req.params.id));
    if (entity) {
      res.json(entity);
    } else {
      res.status(404).send('EntityName not found');
    }
  } catch (error) {
    next(error);
  }
});

// Update
router.put('/:id', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    const updated = await repo.update(parseInt(req.params.id), req.body);
    res.json(updated);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('EntityName not found');
    } else {
      next(error);
    }
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const repo = await getEntityNamesRepository();
    await repo.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('EntityName not found');
    } else {
      next(error);
    }
  }
});

export default router;
```

### Step 4: Register the Route

In `api/src/index.ts`, add:
```typescript
import entityNameRoutes from './routes/entityName';
// ...
app.use('/api/entity-names', entityNameRoutes);
```

### Step 5: Create Database Migration

See `references/database-conventions.md` for migration file conventions.

### Step 6: Create Seed Data

**Always create seed data** for new entities in `api/sql/seed/{NNN}_{entity_names}.sql`.

**Seed file naming convention:**
- Use the next sequential number (e.g., `005_categories.sql`)
- Use snake_case plural entity name
- Place in `api/sql/seed/` directory

**Seed data best practices:**
```sql
-- 005_entity_names.sql
-- Seed data for entity_names table
-- Provides realistic test data for development and demo purposes

INSERT INTO entity_names (entity_name_id, name, description, status, created_at) VALUES
  (1, 'Example Entity 1', 'First example for testing', 'active', '2024-01-15T10:00:00.000Z'),
  (2, 'Example Entity 2', 'Second example for testing', 'active', '2024-01-16T11:30:00.000Z'),
  (3, 'Example Entity 3', 'Third example with different status', 'inactive', '2024-01-17T09:15:00.000Z'),
  (4, 'Example Entity 4', 'Fourth example for edge cases', 'pending', '2024-01-18T14:45:00.000Z');
```

**Guidelines for seed data:**
- Provide 3-5 realistic examples per entity
- Use explicit IDs for referential integrity with related entities
- Include variety: different statuses, dates, edge cases
- Use ISO 8601 format for dates (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- Add comments explaining the purpose
- Include data that tests boundaries (empty strings, nulls where allowed, max lengths)
- For foreign keys, reference existing seed data from other tables

**Example with relationships:**
```sql
-- Reference existing suppliers (from 001_suppliers.sql)
INSERT INTO entity_names (entity_name_id, name, supplier_id, stock_quantity) VALUES
  (1, 'Widget A', 1, 100),  -- References supplier_id = 1
  (2, 'Widget B', 1, 50),   -- Same supplier
  (3, 'Widget C', 2, 200);  -- Different supplier
```

### Step 7: Create Unit Tests

**Always create unit tests** for new repositories in `api/src/repositories/{entity}sRepo.test.ts`.

See `references/testing-patterns.md` for:
- Complete test file structure and patterns
- Required test coverage for all CRUD operations
- Mock setup and assertions
- Optional route integration testing
- Commands for running tests

**Test coverage requirements:**
- ✅ All CRUD operations (create, read, update, delete, exists)
- ✅ Success cases with valid data
- ✅ Edge cases (empty results, null values, boundary conditions)
- ✅ Error cases (database failures, not found scenarios, constraint violations)
- ✅ Mock verification (correct SQL queries and parameters)

## Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| TypeScript interface | PascalCase | `Supplier` |
| Interface property | camelCase | `supplierId` |
| Database table | snake_case, plural | `suppliers` |
| Database column | snake_case | `supplier_id` |
| Route path | kebab-case, plural | `/api/suppliers` |
| Repository class | PascalCase + Repository | `SuppliersRepository` |
| Route file | camelCase.ts | `supplier.ts` |

## Error Handling

Use custom error types from `utils/errors.ts`:
- `NotFoundError(entity, id)` - 404 responses
- `ValidationError(message)` - 400 responses  
- `ConflictError(message)` - 409 responses
- `DatabaseError(message, code, statusCode)` - Generic DB errors

Always wrap repository calls in try/catch and use `handleDatabaseError()` for consistent error conversion.

## SQL Utilities

Available helpers from `utils/sql.ts`:
- `buildInsertSQL(table, data)` - Generate INSERT with placeholders
- `buildUpdateSQL(table, data, whereClause)` - Generate UPDATE with placeholders
- `objectToCamelCase<T>(row)` - Convert single DB row to typed model
- `mapDatabaseRows<T>(rows)` - Convert array of DB rows to typed models
- `toSnakeCase(str)` / `toCamelCase(str)` - String conversion

## File Locations

```
api/src/
├── models/{entity}.ts          # TypeScript interface + Swagger schema
├── repositories/{entity}sRepo.ts  # Data access layer
├── routes/{entity}.ts          # Express routes + Swagger docs
├── utils/
│   ├── errors.ts              # Custom error types
│   └── sql.ts                 # SQL helper utilities
└── index.ts                   # Route registration
```

## Quick Reference: Complete Checklist

When creating a new API endpoint, ensure you complete ALL steps:

- [ ] **Model** (`api/src/models/{entity}.ts`) - TypeScript interface + Swagger schema
- [ ] **Repository** (`api/src/repositories/{entity}sRepo.ts`) - Data access with all CRUD methods
- [ ] **Route** (`api/src/routes/{entity}.ts`) - Express handlers + Swagger docs
- [ ] **Register** (`api/src/index.ts`) - Add route to Express app
- [ ] **Migration** (`api/sql/migrations/{NNN}_{description}.sql`) - CREATE TABLE statement
- [ ] **Seed Data** (`api/sql/seed/{NNN}_{entity_names}.sql`) - 3-5 realistic examples
- [ ] **Unit Tests** (`api/src/repositories/{entity}sRepo.test.ts`) - All CRUD operations, edge cases, errors
- [ ] **Route Tests** (`api/src/routes/{entity}.test.ts`) - Integration tests for HTTP endpoints

**Do not skip seed data or unit tests** - they are required for all new endpoints.

## Additional Resources

- See `references/testing-patterns.md` for comprehensive testing guidance
- See `references/error-handling.md` for detailed error patterns
- See `references/database-conventions.md` for SQLite specifics
- See `references/swagger-patterns.md` for OpenAPI documentation
