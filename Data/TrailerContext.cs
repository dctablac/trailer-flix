namespace TrailerFlix.Data;

using TrailerFlix.Models;
using Microsoft.EntityFrameworkCore;

public class TrailerContext : DbContext {
    public TrailerContext (DbContextOptions<TrailerContext> options)
        : base(options)
    {
    }

    // Since Favorites needs to ID by two fields, userId and movieId
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Favorite>()
            .HasKey(f => new { f.UserId, f.MovieId });
    }

    public DbSet<Trailer> Trailers => Set<Trailer>();

    public DbSet<Favorite> Favorites => Set<Favorite>();
}

