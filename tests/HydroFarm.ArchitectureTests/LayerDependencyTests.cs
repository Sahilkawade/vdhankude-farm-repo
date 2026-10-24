using System.Reflection;
using NetArchTest.Rules;

namespace HydroFarm.ArchitectureTests;

/// <summary>
/// Enforces the dependency rules from docs/ARCHITECTURE.md section 7.2.
/// A failing test here means a layer started depending on something it must not see.
/// </summary>
public sealed class LayerDependencyTests
{
    private const string Domain = "HydroFarm.Domain";
    private const string Application = "HydroFarm.Application";
    private const string Services = "HydroFarm.Services";
    private const string Repositories = "HydroFarm.Repositories";
    private const string Infrastructure = "HydroFarm.Infrastructure";
    private const string WebApi = "HydroFarm.WebApi";

    private const string EntityFrameworkCore = "Microsoft.EntityFrameworkCore";
    private const string AspNetCore = "Microsoft.AspNetCore";

    public static TheoryData<string, string[]> ForbiddenDependencies => new()
    {
        { Domain, [Application, Services, Repositories, Infrastructure, WebApi, EntityFrameworkCore, AspNetCore] },
        { Application, [Services, Repositories, Infrastructure, WebApi, EntityFrameworkCore, AspNetCore] },
        { Services, [Repositories, Infrastructure, WebApi, EntityFrameworkCore, AspNetCore] },
        { Infrastructure, [Services, Repositories, WebApi, AspNetCore] },
        { Repositories, [Services, WebApi, AspNetCore] },
    };

    [Theory]
    [MemberData(nameof(ForbiddenDependencies))]
    public void Layer_does_not_depend_on_forbidden_namespaces(string layer, string[] forbidden)
    {
        var result = Types.InAssembly(Assembly.Load(layer))
            .ShouldNot()
            .HaveDependencyOnAny(forbidden)
            .GetResult();

        Assert.True(
            result.IsSuccessful,
            $"{layer} must not depend on [{string.Join(", ", forbidden)}]. Offending types: " +
            string.Join(", ", result.FailingTypeNames ?? []));
    }

    [Fact]
    public void Controllers_do_not_use_services_repositories_or_infrastructure_directly()
    {
        var result = Types.InAssembly(Assembly.Load(WebApi))
            .That().ResideInNamespace($"{WebApi}.Controllers")
            .ShouldNot()
            .HaveDependencyOnAny(Services, Repositories, Infrastructure, EntityFrameworkCore)
            .GetResult();

        Assert.True(
            result.IsSuccessful,
            "Controllers must only use Application interfaces. Offending types: " +
            string.Join(", ", result.FailingTypeNames ?? []));
    }
}
