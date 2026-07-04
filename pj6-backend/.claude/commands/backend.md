Generate backend code following Clean Architecture rules.

Usage: /backend <task>

Always implement all four layers: Domain, Application, Infrastructure, API. Use Minimal APIs. Return IResult via Results.*. All errors through ExceptionMiddleware. Deliver entity + interface + use case + DTO + validator + repository + endpoint. End with a checklist of every file created.