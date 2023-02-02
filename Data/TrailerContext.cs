namespace TrailerFlix.Data;

using TrailerFlix.Models;
using Microsoft.EntityFrameworkCore;

public class TrailerContext : DbContext {
    public TrailerContext (DbContextOptions<TrailerContext> options)
        : base(options)
    {
    }

    public DbSet<Trailer> Trailers => Set<Trailer>();
}

