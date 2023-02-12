namespace TrailerFlix.Services;

using TrailerFlix.Data;
using TrailerFlix.Models;
using Microsoft.EntityFrameworkCore;
using TrailerFlix.Util;

public class FavoriteService
{
    private readonly IHttpClientFactory _httpClientFactory;
    TrailerContext _context;
    private readonly string? TMDBApiKey;

    public FavoriteService(TrailerContext context, IHttpClientFactory httpClientFactory)
    {
        // Set context and client factory
        _context = context;
        _httpClientFactory = httpClientFactory;

        // Load configurations
        ConfigurationBuilder _configBuilder = new ConfigurationBuilder();
        _configBuilder.SetBasePath(Directory.GetCurrentDirectory());
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            _configBuilder.AddJsonFile("appsettings.development.json", true);
        }
        else
        {
            _configBuilder.AddJsonFile("appsettings.json", false);
        }
        _configBuilder.AddEnvironmentVariables();
        IConfiguration _config = _configBuilder.Build();

        // TMDB Api Key
        TMDBApiKey = _config["TMDB_Key"];
    }
    
    // Get all favorites of a user
    public MoviePosters GetFavorites(string userId)
    {
        // Get id list of favorite movies
        List<int> favoriteIds =  _context.Favorites
                                    .AsNoTracking()
                                    .Where(f => f.UserId == userId)
                                    .Select(f => f.MovieId)
                                    .ToList();

        // Make API calls to retrieve movie title and posters for each id
        HttpClient httpClient = _httpClientFactory.CreateClient("TMDB");
        List<MoviePoster> favorites = new();
        foreach (int id in favoriteIds)
        {
            string favoriteUri = $"movie/{id}?api_key={TMDBApiKey}";
            var res = Request.Get(httpClient, favoriteUri);
            if (res.IsSuccessStatusCode)
            {
                var favorite = res.Content.ReadFromJsonAsync<MoviePoster>().Result;
                if (favorite is not null)
                {
                    favorites.Add(favorite);
                }
            }
        }

        return new MoviePosters(favorites);
    }

    // Get a favorite of a user
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

    // Delete all favorites from a user. (account deletion)
    public void DeleteAllFavorites(string id) {
        // Query all favorites of the user
        var favorites = _context.Favorites
                            .AsNoTracking()
                            .Where(f => f.UserId == id)
                            .ToList();
        // Delete the favorites
        foreach (Favorite f in favorites)
        {    
            _context.Favorites.Remove(f);
        }
        _context.SaveChanges();
    }
}