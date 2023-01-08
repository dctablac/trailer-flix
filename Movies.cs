// Functions for communicating with TMDb API
namespace TrailerFlix;

using System.Text.Json;
using System.Linq;

public static class Movies
{
    private static readonly string tmdbUri = "https://api.themoviedb.org/3";
    private static readonly string api_key = "106bb0c01a5baebe8e721233be42eb3a";

    // Get all popular movies
    public static async Task<MoviePosters> GetPopular(HttpClient client)
    {
        string uri = $"{tmdbUri}/movie/popular?api_key={api_key}";
        await using Stream stream = await client.GetStreamAsync(uri);
        var response = 
            await JsonSerializer.DeserializeAsync<MoviePosters>(stream);
        return response;
    }

    // Get movies by search query
    public static async Task<MoviePosters> GetSearch(HttpClient client, string query)
    {
        string searchUri = $"{tmdbUri}/search/movie?api_key={api_key}&query={query}";
        await using Stream stream = await client.GetStreamAsync(searchUri);
        var response = 
            await JsonSerializer.DeserializeAsync<MoviePosters>(stream);
        return response;
        
    }

    // Get movie by id
    public static async Task<MovieDetails> GetById(HttpClient client, string id)
    {
        // Get movie details
        string infoUri = $"{tmdbUri}/movie/{id}?api_key={api_key}";
        Stream stream = await client.GetStreamAsync(infoUri);
        var infoResponse = 
            await JsonSerializer.DeserializeAsync<MovieInfo>(stream);

        // Get cast and crew
        string creditsUri = $"{tmdbUri}/movie/{id}/credits?api_key={api_key}";
        stream = await client.GetStreamAsync(creditsUri);
        var creditsResponse = 
            await JsonSerializer.DeserializeAsync<MovieCredits>(stream);

        // Combine responses
        if (infoResponse is null || creditsResponse is null)
        {
            return null;
        }

        return new MovieDetails(infoResponse, creditsResponse);
    }
}