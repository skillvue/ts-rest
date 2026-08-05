---
'@ts-rest/nest': major
---

Remove the legacy `initNestServer` / decorator API. `@TsRestHandler` + `tsRestHandler` is the only supported
style.

Removed exports: `initNestServer`, `NestControllerContract`, `NestControllerInterface`, `NestRequestShapes`,
`NestResponseShapes`, the `@TsRest()` and `@Api()` method decorators, and the `@TsRestRequest()` param
decorator. `TsRestRequestShape` still exists, now defined as
`ServerInferRequest<TRoute, Request['headers']>` in `ts-rest-nest-handler`.

The migration guide has the before/after for a controller.
