namespace TrailerFlix.Services;

using TrailerFlix.Data;
using TrailerFlix.Models;
using Microsoft.EntityFrameworkCore;

public class FavoriteService
{
    FavoriteContext _context;

    public FavoriteService(FavoriteContext context)
    {
        _context = context;
    }
    
    // Get all favorites of a user
    public List<int> GetFavorites(string userId)
    {
        return _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.MovieId)
            .ToList();
    }

    // Get a favorite of a user (used in deleting a favorite)
    public Favorite? GetFavoriteById(string userId, int movieId)
    {
        return _context.Favorites
            .AsNoTracking()
            .SingleOrDefault(f => f.UserId == userId && f.MovieId == movieId);
    }

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

    // Delete a movie trailer entry
    public void DeleteFavorite(Favorite favoriteToDelete)
    {
        if (favoriteToDelete is not null)
        {
            _context.Favorites.Remove(favoriteToDelete);
            _context.SaveChanges();
        }
    }
}