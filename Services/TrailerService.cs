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

    // Get all favorites of a user
    public List<int> GetFavorites(string userId)
    {
        return _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.MovieId)
            .ToList();
    }

    // Get a favorite of a user
    // Used to delete favorite
    // private Favorite? _GetFavoriteById(string userId, int movieId)
    // {
    //     return _context.Favorites
    //         .AsNoTracking()
    //         .SingleOrDefault(f => f.UserId == userId && f.MovieId == movieId);
    // }

    // Favorite a movie trailer entry
    public Favorite? AddFavorite(Favorite newFavorite)
    {
        try 
        {
            _context.Favorites.Add(newFavorite);
            _context.SaveChanges();
            return newFavorite;
        }
        catch
        {
            return null;
        }    
    }

    // // Delete a movie trailer entry
    // public void DeleteFavorite(string userId, int movieId)
    // {
    //     var favoriteToDelete = _context.Favorites.Find(userId, movieId);
    //     if (favoriteToDelete is not null)
    //     {
    //         _context.Favorites.Remove(favoriteToDelete);
    //         _context.SaveChanges();
    //     }
    // }

}