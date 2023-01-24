using Microsoft.EntityFrameworkCore;
using TrailerFlix.Services;
using TrailerFlix.Data;

// Arbitray CORS policy name
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// CORS service policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
    policy =>
    {
        policy.WithOrigins(builder.Configuration["ALLOWED_ORIGIN"]);
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Add MySql connection / Register TrailerContext
builder.Services.AddDbContext<TrailerContext>(
    options => options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"), 
        new MySqlServerVersion(new Version(8, 0, 31))
    )
);
// Register TrailerService 
builder.Services.AddScoped<TrailerService>();


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

app.MapFallbackToFile("index.html");;

app.Run();
