using Microsoft.Extensions.DependencyInjection;

namespace HydroFarm.Application;

public static class DependencyInjection
{
    /// <summary>Registers application-layer types (validators, application settings).</summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services;
    }
}
