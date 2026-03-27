# Database Conventions Reference

This document details SQLite database conventions for the OctoCAT Supply Chain API.

## File Locations

```
api/
├── data/
│   └── app.db              # SQLite database file (gitignored)
└── sql/
    ├── migrations/         # Schema changes
    │   ├── 001_init.sql
    │   └── 002_add_supplier_status_fields.sql
    └── seed/               # Demo data
        ├── 001_suppliers.sql
        ├── 002_headquarters.sql
        ├── 003_branches.sql
        └── 004_products.sql
```

## Migration Files

### Naming Convention

```
{sequence}_{description}.sql
```

- **sequence**: 3-digit zero-padded number (001, 002, etc.)
- **description**: snake_case description of changes

### Migration Structure

```sql
-- 003_add_inventory_table.sql

-- Create the inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    branch_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_branch ON inventory(branch_id);
```

### Key Conventions

1. **Always use IF NOT EXISTS** - Makes migrations idempotent
2. **INTEGER PRIMARY KEY AUTOINCREMENT** - Standard for auto-incrementing IDs
3. **Foreign keys** - Always define with REFERENCES clause
4. **Indexes** - Create for foreign keys and frequently queried columns
5. **Defaults** - Use SQLite functions like `datetime('now')` for timestamps

## Column Naming

| TypeScript | SQLite Column | Notes |
|------------|---------------|-------|
| `supplierId` | `supplier_id` | Primary key |
| `productName` | `product_name` | Regular field |
| `isActive` | `is_active` | Boolean (stored as INTEGER 0/1) |
| `createdAt` | `created_at` | Timestamp (stored as TEXT ISO 8601) |

## Data Types

| TypeScript | SQLite Type | Notes |
|------------|-------------|-------|
| `number` | `INTEGER` | All numeric values |
| `number` (decimal) | `REAL` | Floating point |
| `string` | `TEXT` | Strings and dates |
| `boolean` | `INTEGER` | 0 = false, 1 = true |
| `Date` | `TEXT` | ISO 8601 format |

## Boolean Handling

SQLite doesn't have a native boolean type. Store as INTEGER (0/1) and convert in repository:

```typescript
private convertBooleanFields(entity: Entity): Entity {
  return {
    ...entity,
    active: Boolean(entity.active),
    verified: Boolean(entity.verified),
  };
}
```

## Seed Files

### Naming Convention

```
{sequence}_{table_name}.sql
```

Order matters! Tables with foreign keys must be seeded after their referenced tables.

### Seed Structure

```sql
-- 004_products.sql

INSERT INTO products (product_id, name, supplier_id, price, description)
VALUES 
  (1, 'Smart Cat Feeder', 1, 129.99, 'Automatic feeding system'),
  (2, 'GPS Cat Collar', 1, 79.99, 'Real-time tracking'),
  (3, 'Interactive Laser Toy', 2, 49.99, 'Automated play system');
```

### Key Conventions

1. **Explicit IDs** - Specify IDs for predictable references
2. **Match model fields** - Column names must match database schema
3. **Order by dependency** - Seed referenced tables first

## SQL Utilities

### buildInsertSQL

Converts camelCase object to snake_case INSERT:

```typescript
const supplier = { name: 'Acme', contactPerson: 'John' };
const { sql, values } = buildInsertSQL('suppliers', supplier);
// sql: "INSERT INTO suppliers (name, contact_person) VALUES (?, ?)"
// values: ['Acme', 'John']
```

### buildUpdateSQL

Converts camelCase object to snake_case UPDATE:

```typescript
const updates = { contactPerson: 'Jane', email: 'jane@acme.com' };
const { sql, values } = buildUpdateSQL('suppliers', updates, 'supplier_id = ?');
// sql: "UPDATE suppliers SET contact_person = ?, email = ? WHERE supplier_id = ?"
// values: ['Jane', 'jane@acme.com']  // Note: WHERE value added separately
```

### Case Conversion

```typescript
// DB row → TypeScript object
const row = { supplier_id: 1, contact_person: 'John' };
const supplier = objectToCamelCase<Supplier>(row);
// { supplierId: 1, contactPerson: 'John' }

// Multiple rows
const suppliers = mapDatabaseRows<Supplier>(rows);
```

## Database Connection

### Production

```typescript
import { getDatabase } from '../db/sqlite';

const db = await getDatabase();
```

Database file location configured via `DB_FILE` environment variable (defaults to `api/data/app.db`).

### Testing (In-Memory)

```typescript
const db = await getDatabase(true);  // isTest = true
```

Uses `:memory:` SQLite database for fast, isolated tests.

## Common Queries

### Select with Order

```typescript
const rows = await this.db.all<DatabaseRow>(
  'SELECT * FROM suppliers ORDER BY supplier_id'
);
```

### Select with Parameter

```typescript
const row = await this.db.get<DatabaseRow>(
  'SELECT * FROM suppliers WHERE supplier_id = ?',
  [id]
);
```

### Insert with Return

```typescript
const result = await this.db.run(sql, values);
const newId = result.lastID;
```

### Update/Delete with Affected Rows

```typescript
const result = await this.db.run(sql, values);
if (result.changes === 0) {
  throw new NotFoundError('Entity', id);
}
```

## Foreign Key Constraints

SQLite foreign keys are enabled in the connection setup. When violated:

```typescript
// Caught by handleDatabaseError and converted to ValidationError
throw new ValidationError('Invalid reference to related entity');
```

## Adding a New Table

1. Create migration: `api/sql/migrations/00X_add_table_name.sql`
2. Create seed (if needed): `api/sql/seed/00X_table_name.sql`
3. Restart API to run migrations
4. Create model, repository, and routes following skill patterns
