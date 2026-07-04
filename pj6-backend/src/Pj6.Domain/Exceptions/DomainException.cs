namespace Pj6.Domain.Exceptions;

/// <summary>Base exception for domain business rule violations.</summary>
public class DomainException(string message) : Exception(message);

/// <summary>Requested resource was not found.</summary>
public class NotFoundException(string entity, object key)
    : DomainException($"{entity} with key '{key}' was not found.");

/// <summary>A business rule was violated.</summary>
public class BusinessRuleException(string rule)
    : DomainException($"Business rule violated: {rule}");