---
description: 'Demo: Improve API Test Coverage - Add Unit Tests for Missing Routes.'
tools: ['search', 'edit', 'web','vscode/openSimpleBrowser', 'read', 'execute', 'azure-mcp-server/search', 'playwright/*', 'github/*']
---
# 🧪 Demo: Add Unit Tests for Product and Supplier Routes

## 📊 Current State
<% if demo_options.backend == 'nodejs' %>
- Only **1 test file exists**: `branch.test.ts`
<% elsif demo_options.backend == 'python' %>
- Test files exist for products and suppliers but may have incomplete coverage
- Test configuration in `tests/conftest.py` with async test client and mock fixtures
<% elsif demo_options.backend == 'java' %>
- Only **1 test file exists**: `ProductControllerTest.java`
<% endif %>

## 🎯 Objective
Increase API test coverage by implementing comprehensive unit tests for Product and Supplier routes.

## 📋 Missing Test Files

### 🔗 Route Tests (High Priority)
The following route files need complete test coverage:

<% if demo_options.backend == 'nodejs' %>
- [ ] `src/routes/product.test.ts`
- [ ] `src/routes/supplier.test.ts`
<% elsif demo_options.backend == 'python' %>
- [ ] `tests/test_products.py` (expand coverage)
- [ ] `tests/test_suppliers.py` (expand coverage)
<% elsif demo_options.backend == 'java' %>
- [ ] `src/test/java/com/octodemo/octocatsupply/controller/ProductControllerTest.java` (expand coverage)
- [ ] `src/test/java/com/octodemo/octocatsupply/controller/SupplierControllerTest.java`
<% endif %>

## ✅ Test Coverage Requirements

### For Each Route Test File:

- **CRUD Operations:**
  - ✅ GET all entities
  - ✅ GET single entity by ID
  - ✅ POST create new entity
  - ✅ PUT update existing entity
  - ✅ DELETE entity by ID

- **Error Scenarios:**
  - ❌ 404 for non-existent entities
  - ❌ 400 for invalid request payloads
  - ❌ 422 for validation errors
  - ❌ Edge cases (malformed IDs, empty requests)

## 🛠️ Implementation Guidelines

### Use Existing Pattern
<% if demo_options.backend == 'nodejs' %>
Follow the pattern established in `src/routes/branch.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
```

### Test Structure Template
```typescript
describe('[Entity] API', () => {
    beforeEach(() => {
        // Setup app and reset data
    });

    it('should create a new [entity]', async () => { /* POST test */ });
    it('should get all [entities]', async () => { /* GET all test */ });
    it('should get a [entity] by ID', async () => { /* GET by ID test */ });
    it('should update a [entity] by ID', async () => { /* PUT test */ });
    it('should delete a [entity] by ID', async () => { /* DELETE test */ });
    it('should return 404 for non-existing [entity]', async () => { /* Error test */ });
});
```
<% elsif demo_options.backend == 'python' %>
Follow the pattern established in `tests/test_products.py` and `tests/conftest.py`:
```python
import pytest
from src.main import app
from src.repositories.products_repo import get_products_repository

@pytest.mark.asyncio
async def test_get_all_products(client, mock_products_repo):
    """Test getting all products with mocked repository."""
    # ...
```

### Test Structure Template
```python
import pytest
from src.main import app
from src.repositories.[entity]_repo import get_[entity]_repository

@pytest.mark.asyncio
async def test_create_[entity](client, mock_[entity]_repo):
    """Test creating a new [entity]."""
    # POST test

@pytest.mark.asyncio
async def test_get_all_[entities](client, mock_[entity]_repo):
    """Test getting all [entities]."""
    # GET all test

@pytest.mark.asyncio
async def test_get_[entity]_by_id(client, mock_[entity]_repo):
    """Test getting a [entity] by ID."""
    # GET by ID test

@pytest.mark.asyncio
async def test_update_[entity](client, mock_[entity]_repo):
    """Test updating a [entity] by ID."""
    # PUT test

@pytest.mark.asyncio
async def test_delete_[entity](client, mock_[entity]_repo):
    """Test deleting a [entity] by ID."""
    # DELETE test

@pytest.mark.asyncio
async def test_[entity]_not_found(client, mock_[entity]_repo):
    """Test 404 for non-existing [entity]."""
    # Error test
```
<% elsif demo_options.backend == 'java' %>
Follow the pattern established in `src/test/java/com/octodemo/octocatsupply/controller/ProductControllerTest.java`:
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
```

### Test Structure Template
```java
@ExtendWith(MockitoExtension.class)
class [Entity]ControllerTest {

    @Mock
    private [Entity]Repository [entity]Repository;

    @InjectMocks
    private [Entity]Controller [entity]Controller;

    @Test
    void shouldReturnAll[Entities]() { /* GET all test */ }

    @Test
    void shouldReturn[Entity]ById() { /* GET by ID test */ }

    @Test
    void shouldCreate[Entity]() { /* POST test */ }

    @Test
    void shouldUpdate[Entity]() { /* PUT test */ }

    @Test
    void shouldDelete[Entity]() { /* DELETE test */ }

    @Test
    void shouldReturn404When[Entity]NotFound() { /* Error test */ }
}
```
<% endif %>

## 🔧 Running Tests

<% if demo_options.backend == 'nodejs' %>
```bash
# Run all tests
npm run test:api

# Run tests with coverage
npm run test:api -- -- --coverage

# Run specific test file
npm run test:api -- src/routes/product.test.ts
```
<% elsif demo_options.backend == 'python' %>
```bash
# Run all tests
cd api && pytest

# Run tests with coverage
cd api && pytest --cov

# Run specific test file
cd api && pytest tests/test_products.py
```
<% elsif demo_options.backend == 'java' %>
```bash
# Run all tests
cd api && ./mvnw test

# Run a specific test class
cd api && ./mvnw test -Dtest=ProductControllerTest

# Run tests with coverage (via JaCoCo if configured)
cd api && ./mvnw test jacoco:report
```
<% endif %>

## 📈 Success Criteria
- [ ] Add route test files for Product and Supplier
- [ ] All tests passing in CI/CD

## 🚀 Getting Started
<% if demo_options.backend == 'nodejs' %>
1. Start with `product.test.ts` - copy `branch.test.ts` pattern
2. Implement basic CRUD tests first
3. Add error scenarios incrementally
4. Run coverage after each file to track progress
5. Follow ERD relationships for cross-entity testing
<% elsif demo_options.backend == 'python' %>
1. Start with `test_products.py` - follow existing pattern with `conftest.py` fixtures
2. Use `app.dependency_overrides` for mocking repositories
3. Implement basic CRUD tests first
4. Add error scenarios incrementally
5. Run `pytest --cov` after each file to track progress
<% elsif demo_options.backend == 'java' %>
1. Start with `SupplierControllerTest.java` - copy `ProductControllerTest.java` pattern
2. Use `@Mock` and `@InjectMocks` for dependency injection
3. Implement basic CRUD tests first
4. Add error scenarios incrementally
5. Run `./mvnw test` after each file to track progress
<% endif %>

## 📚 Related Files
<% if demo_options.backend == 'nodejs' %>
- ERD Diagram: `api/ERD.png`
- Existing test: `api/src/routes/branch.test.ts`
- Test config: `api/vitest.config.ts`
- Coverage report: `api/coverage/index.html`
<% elsif demo_options.backend == 'python' %>
- ERD Diagram: `api/ERD.png`
- Existing tests: `api/tests/test_products.py`, `api/tests/test_suppliers.py`
- Test fixtures: `api/tests/conftest.py`
- Config: `api/pyproject.toml`
<% elsif demo_options.backend == 'java' %>
- ERD Diagram: `api/ERD.png`
- Existing test: `api/src/test/java/com/octodemo/octocatsupply/controller/ProductControllerTest.java`
- Config: `api/pom.xml`
<% endif %>
