---
id: US-001
title: User registration
layer: backend
priority: high
status: pending
---

# US-001 — User registration

**As** an unauthenticated user
**I want** to create an account with email and password
**So that** I can access protected features

## Acceptance criteria

- [ ] `POST /api/auth/register` accepts `{ email, password, name }`
- [ ] Password is hashed with IPasswordHasher<T> before persisting
- [ ] If email already exists, returns `422 Unprocessable Entity`
- [ ] If validation fails, returns `400 Bad Request` with field errors
- [ ] On success, returns `201 Created` with `{ userId }`

## Technical notes

- Entity: `User` in Domain layer
- Use case: `RegisterUserCommand` in Application layer
- Repository: `IUserRepository`
- Validator: `RegisterUserValidator` (FluentValidation)
