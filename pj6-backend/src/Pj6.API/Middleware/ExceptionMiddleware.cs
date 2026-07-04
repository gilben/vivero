using Microsoft.AspNetCore.Mvc;
using Pj6.Domain.Exceptions;

namespace Pj6.API.Middleware;

/// <summary>
/// Global exception handler. Converts domain exceptions to ProblemDetails (RFC 7807).
/// Never use try/catch directly in endpoints — let this handle everything.
/// </summary>
public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        try { await next(ctx); }
        catch (NotFoundException ex)     { await Write(ctx, 404, "Not Found", ex.Message); }
        catch (BusinessRuleException ex) { await Write(ctx, 422, "Business Rule Violation", ex.Message); }
        catch (DomainException ex)       { await Write(ctx, 400, "Domain Error", ex.Message); }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await Write(ctx, 500, "Internal Server Error", "An unexpected error occurred.");
        }
    }

    static async Task Write(HttpContext ctx, int status, string title, string detail)
    {
        ctx.Response.StatusCode = status;
        ctx.Response.ContentType = "application/problem+json";
        await ctx.Response.WriteAsJsonAsync(
            new ProblemDetails { Status = status, Title = title, Detail = detail });
    }
}