# Error Handling Reference

This document details the error handling patterns used in the OctoCAT Supply Chain API.

## Error Class Hierarchy

```
Error
└── DatabaseError (base class)
    ├── NotFoundError (404)
    ├── ValidationError (400)
    └── ConflictError (409)
```

## Error Types

### DatabaseError (Base Class)

Generic database error with customizable status code.

```typescript
export class DatabaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string = 'DATABASE_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
```

### NotFoundError

Use when an entity is not found by ID.

```typescript
export class NotFoundError extends DatabaseError {
  constructor(entity: string, id: string | number) {
    super(`${entity} with ID ${id} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}
```

**Usage:**
```typescript
throw new NotFoundError('Supplier', id);
// → "Supplier with ID 123 not found" (404)
```

### ValidationError

Use for invalid input or constraint violations.

```typescript
export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(`Validation error: ${message}`, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}
```

**Usage:**
```typescript
throw new ValidationError('Email format is invalid');
// → "Validation error: Email format is invalid" (400)
```

### ConflictError

Use for duplicate/unique constraint violations.

```typescript
export class ConflictError extends DatabaseError {
  constructor(message: string) {
    super(`Conflict: ${message}`, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}
```

**Usage:**
```typescript
throw new ConflictError('Supplier with this email already exists');
// → "Conflict: Supplier with this email already exists" (409)
```

## handleDatabaseError Function

Central error handler that converts SQLite-specific errors to appropriate types.

```typescript
export function handleDatabaseError(error: unknown, entity?: string, id?: string | number): never {
  // Re-throw if already a DatabaseError
  if (error instanceof DatabaseError) {
    throw error;
  }

  const message = error instanceof Error ? error.message : error;

  // SQLite constraint violations
  if (error.code === 'SQLITE_CONSTRAINT') {
    if (error.message.includes('UNIQUE')) {
      throw new ConflictError('Resource already exists');
    }
    if (error.message.includes('FOREIGN KEY')) {
      throw new ValidationError('Invalid reference to related entity');
    }
    throw new ValidationError(error.message);
  }

  // SQLite busy/locked
  if (error.code === 'SQLITE_BUSY') {
    throw new DatabaseError('Database is temporarily unavailable', 'DATABASE_BUSY', 503);
  }

  // Default
  throw new DatabaseError(`Database operation failed: ${message}`, 'DATABASE_ERROR', 500);
}
```

## Usage in Repository Methods

Always wrap database calls in try/catch:

```typescript
async findById(id: number): Promise<Entity | null> {
  try {
    const row = await this.db.get<DatabaseRow>('SELECT * FROM entities WHERE id = ?', [id]);
    return row ? objectToCamelCase<Entity>(row) : null;
  } catch (error) {
    handleDatabaseError(error);  // Will throw appropriate error type
  }
}

async update(id: number, data: Partial<Entity>): Promise<Entity> {
  try {
    const { sql, values } = buildUpdateSQL('entities', data, 'id = ?');
    const result = await this.db.run(sql, [...values, id]);
    
    if (result.changes === 0) {
      throw new NotFoundError('Entity', id);
    }
    
    // ... return updated entity
  } catch (error) {
    handleDatabaseError(error, 'Entity', id);  // Pass entity info for context
  }
}
```

## Usage in Route Handlers

Check error types and respond appropriately:

```typescript
router.put('/:id', async (req, res, next) => {
  try {
    const repo = await getEntitiesRepository();
    const updated = await repo.update(parseInt(req.params.id), req.body);
    res.json(updated);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Entity not found');
    } else {
      next(error);  // Let error middleware handle other errors
    }
  }
});
```

## Error Middleware

The global error handler in `index.ts` catches unhandled errors:

```typescript
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof DatabaseError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  // Default 500 response
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

## JSON Error Response Format

All API errors return consistent JSON:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Supplier with ID 123 not found"
  }
}
```

## Best Practices

1. **Always use handleDatabaseError** - Don't throw raw errors from repositories
2. **Provide context** - Pass entity name and ID to `handleDatabaseError()` for meaningful messages
3. **Check specific error types first** - Handle `NotFoundError` explicitly in routes before delegating to `next()`
4. **Use appropriate error types** - `NotFoundError` for missing entities, `ValidationError` for bad input, `ConflictError` for duplicates
