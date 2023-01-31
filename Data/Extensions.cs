namespace TrailerFlix.Data;

public static class Extensions
{
    // host parameter is referring to this host/project
    public static void CreateDbIfNotExists(this IHost host)
    {
        {
            // Using the scope of this host/project
            using (var scope = host.Services.CreateScope())
            {
                // Access the services in the scope of this host/project
                var services = scope.ServiceProvider;
                // Create a reference to the context
                var context = services.GetRequiredService<TrailerContext>();
                // Creates a new database if one doesn't exist. The new database is not
                // . configured for migrations, so use this with caution.
                context.Database.EnsureCreated();
            }
        }
    }
}