---
'@ts-rest/core': patch
'@ts-rest/express': patch
'@ts-rest/next': patch
'@ts-rest/nest': patch
'@ts-rest/serverless': patch
---

Make `instanceof TsRestRequestValidationError` work in every server adapter.

Each adapter has to extend a different framework base class, so none of them could extend the core error:
nest threw a `BadRequestException` subclass, next declared its own identically-named class, and express
threw `RequestValidationError`. A `@Catch()` filter or error handler checking the core class therefore saw
`false` and fell through to a 500. The core class now recognises a `Symbol.for`-based brand that the
adapters carry.

Also fixes `@ts-rest/serverless` answering `500 Server Error` instead of `400` for *every* failed request
validation: it threw core's plain-`Error` class, which its error handler maps to a 500.
