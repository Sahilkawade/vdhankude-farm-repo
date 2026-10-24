using Microsoft.Extensions.DependencyInjection;

namespace HydroFarm.Services;

public static class DependencyInjection
{
    /// <summary>Registers business service implementations against their Application interfaces.</summary>
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        return services;
    }
}
