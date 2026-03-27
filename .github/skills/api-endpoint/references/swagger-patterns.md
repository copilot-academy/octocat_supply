# Swagger/OpenAPI Documentation Patterns

This document details how to write Swagger documentation for API endpoints in the OctoCAT Supply Chain application.

## Overview

The API uses JSDoc-style `@swagger` comments that are parsed by `swagger-jsdoc` to generate OpenAPI 3.0 documentation. Documentation is defined in two places:

1. **Model files** - Schema definitions (`components/schemas`)
2. **Route files** - Endpoint documentation (`paths`)

## Schema Documentation (Models)

Define schemas in model files above the TypeScript interface:

```typescript
// api/src/models/supplier.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - supplierId
 *         - name
 *       properties:
 *         supplierId:
 *           type: integer
 *           description: The unique identifier for the supplier
 *         name:
 *           type: string
 *           description: The name of the supplier
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email for the supplier
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         active:
 *           type: boolean
 *           description: Whether the supplier is active
 */
export interface Supplier {
  supplierId: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}
```

### Property Types

| TypeScript | OpenAPI Type | Format |
|------------|--------------|--------|
| `number` | `integer` | - |
| `number` (decimal) | `number` | `float` or `double` |
| `string` | `string` | - |
| `string` (email) | `string` | `email` |
| `string` (date) | `string` | `date-time` |
| `boolean` | `boolean` | - |
| `string[]` | `array` | items: { type: string } |

### Required vs Optional

Mark required fields in the `required` array:

```yaml
required:
  - supplierId
  - name
properties:
  supplierId:
    type: integer
  name:
    type: string
  description:   # Optional - not in required array
    type: string
```

## Endpoint Documentation (Routes)

### Tags

Group related endpoints with a tag defined at the top of the route file:

```typescript
/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */
```

### GET All (List)

```typescript
/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Returns all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
```

### GET One (By ID)

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 */
```

### POST (Create)

```typescript
/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
```

### PUT (Update)

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 */
```

### DELETE

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */
```

## Query Parameters

For filtering or pagination:

```typescript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns products with optional filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: integer
 *         description: Filter by supplier ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of products
 */
```

## Custom Response Objects

For endpoints returning non-standard data:

```typescript
/**
 * @swagger
 * /api/suppliers/{id}/status:
 *   get:
 *     summary: Get the status of a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [INACTIVE, APPROVED, PENDING]
 *       404:
 *         description: Supplier not found
 */
```

## Error Responses

Standard error response format:

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: NOT_FOUND
 *             message:
 *               type: string
 *               example: Supplier with ID 123 not found
 */
```

Reference in responses:

```yaml
responses:
  404:
    description: Not found
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'
```

## Multiple Operations on Same Path

Document multiple HTTP methods under the same path block:

```typescript
/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     # ... get documentation
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     # ... put documentation
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     # ... delete documentation
 */
```

## Accessing Swagger UI

The generated documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **JSON spec**: `http://localhost:3000/api-docs.json`

## Best Practices

1. **Write summaries first** - Brief, action-oriented (e.g., "Create a new supplier")
2. **Use schema references** - `$ref: '#/components/schemas/...'` for consistency
3. **Document all responses** - Include 200/201, 400, 404, 500 as appropriate
4. **Parameter descriptions** - Always describe what the parameter represents
5. **Keep schemas in models** - Don't duplicate schema definitions in route files
