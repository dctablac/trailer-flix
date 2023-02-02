namespace TrailerFlix.Data;

using TrailerFlix.Models;
using Microsoft.EntityFrameworkCore;

public class FavoriteContext : DbContext
{
    public FavoriteContext(DbContextOptions<FavoriteContext> options)
        : base(options)
    {
    }

     // Since Favorites needs to ID by two fields, userId and movieId
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Favorite>()
            .HasKey(f => new { f.UserId, f.MovieId });
    }

    public DbSet<Favorite> Favorites => Set<Favorite>();
}