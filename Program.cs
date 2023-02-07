using TrailerFlix.Services;
using TrailerFlix.Data;
using Microsoft.Net.Http.Headers;

// Arbitray CORS policy name
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// CORS service policy
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(builder.Configuration["ALLOWED_ORIGIN"])
                  .WithHeaders(HeaderNames.ContentType)
                  .WithMethods("GET", "POST", "DELETE");
        });
    });
}
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// // Register HttpClients
builder.Services.AddHttpClient("TMDB", httpClient =>
{
    httpClient.BaseAddress = new Uri(builder.Configuration["TMDB_URL"]);
});
// Register database context
builder.Services.AddSqlite<TrailerContext>("Data Source=TrailerFlix.db");
// If using other MySql, make sure to add
// MySql.Data
// Pomelo.EntityFrameworkCore.MySql
// in project file.
// builder.Services.AddDbContext<TrailerContext>(
//     options => options.UseMySql(
//         builder.Configuration.GetConnectionString("DefaultConnection"),
//         new MySqlServerVersion(new Version(8,0,31))
//     )
// );
// Register services
builder.Services.AddScoped<MovieService>();
builder.Services.AddScoped<TrailerService>();
builder.Services.AddScoped<FavoriteService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// CORS middleware, configured above
app.UseCors(myAllowSpecificOrigins);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

// Ensure db is created
app.CreateDbIfNotExists();

app.Run();