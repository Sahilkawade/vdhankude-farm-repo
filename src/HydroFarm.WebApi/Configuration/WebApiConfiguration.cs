using HydroFarm.WebApi.Middleware;

namespace HydroFarm.WebApi.Configuration;

public static class WebApiConfiguration
{
    /// <summary>Registers HTTP-layer services: controllers, ProblemDetails, OpenAPI, CORS and health checks.</summary>
    public static IServiceCollection AddWebApi(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddProblemDetails();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddOpenApi();
        services.AddHealthChecks();
        services.AddCorsPolicy(configuration);

        return services;
    }
}
