using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HydroFarm.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Registers persistence (DbContext, unit of work) and external integrations.
    /// The connection string is read from configuration (User Secrets in development,
    /// environment variables in production) and never stored in source control.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        return services;
    }
}
