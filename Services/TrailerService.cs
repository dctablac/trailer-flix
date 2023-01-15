namespace TrailerFlix.Services;

using Microsoft.EntityFrameworkCore;
using TrailerFlix.Data;
using TrailerFlix.Models;

public class TrailerService {
    TrailerContext _context;

    public TrailerService(TrailerContext context)
    {
        _context = context;
    }

    // Get trailer associated with movie_id
    public Trailer? GetTrailerByMovieId(int id)
    {
        return _context.Trailers
            .AsNoTracking()
            .SingleOrDefault(t => t.MovieId == id);
    }

    // Create a new entry mapping a movie_id with a trailer_id
    public Trailer? AddMovieTrailer(Trailer newTrailer)
    {
        _context.Trailers.Add(newTrailer);
        _context.SaveChanges();

        return newTrailer;
    }
}