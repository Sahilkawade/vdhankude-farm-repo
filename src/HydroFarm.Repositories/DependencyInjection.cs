using Microsoft.Extensions.DependencyInjection;

namespace HydroFarm.Repositories;

public static class DependencyInjection
{
    /// <summary>Registers repository implementations against their Application interfaces.</summary>
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        return services;
    }
}
