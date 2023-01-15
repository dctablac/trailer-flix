// Functions for communicating with TMDb API
namespace TrailerFlix;

using System.Text.Json;
using System.Linq;

public static class Movies
{
    private static readonly string TMDBUri = "https://api.themoviedb.org/3";
    private static readonly string TMDBApiKey = "106bb0c01a5baebe8e721233be42eb3a";

    private static readonly string YoutubeAPIKey = "AIzaSyAG57UZIEQyZzxvpe_Zp0ZVidzDk-SMN7Q";
    private static readonly string YoutubeUri = $"https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key={YoutubeAPIKey}";

    // &q=Avatar%202009%20trailer


    // Get all popular movies
    public static async Task<MoviePosters> GetPopular(HttpClient client)
    {
        string uri = $"{TMDBUri}/movie/popular?api_key={TMDBApiKey}";
        await using Stream stream = await client.GetStreamAsync(uri);
        var response = 
            await JsonSerializer.DeserializeAsync<MoviePosters>(stream);
        return response;
    }

    // Get movies by search query
    public static async Task<MoviePosters> GetSearch(HttpClient client, string query)
    {
        string searchUri = $"{TMDBUri}/search/movie?api_key={TMDBApiKey}&query={query}";
        await using Stream stream = await client.GetStreamAsync(searchUri);
        var response = 
            await JsonSerializer.DeserializeAsync<MoviePosters>(stream);
        return response;
        
    }

    // Get movie by id
    public static async Task<MovieDetails> GetById(HttpClient client, string id)
    {
        // Get movie details
        string infoUri = $"{TMDBUri}/movie/{id}?api_key={TMDBApiKey}";
        Stream stream = await client.GetStreamAsync(infoUri);
        var infoResponse = 
            await JsonSerializer.DeserializeAsync<MovieInfo>(stream);
        if (infoResponse is null)
        {
            return null;
        }

        // Get cast and crew
        string creditsUri = $"{TMDBUri}/movie/{id}/credits?api_key={TMDBApiKey}";
        stream = await client.GetStreamAsync(creditsUri);
        var creditsResponse = 
            await JsonSerializer.DeserializeAsync<MovieCredits>(stream);
        if (creditsResponse is null)
        {
            return null;
        }

        // Get movie trailer from YouTube search API
        // Build search query: [title] [year] 'trailer'
        string year = infoResponse.ReleaseDate.Split("-")[0];
        string search = $"{infoResponse.Title} {year} trailer";

        string ytUri = $"{YoutubeUri}&q={search}";
        stream = await client.GetStreamAsync(ytUri);
        var searchResponse =
            await JsonSerializer.DeserializeAsync<YoutubeSearch>(stream);
        if (searchResponse is null)
        {
            return null;
        }
        
        return new MovieDetails(infoResponse, creditsResponse, searchResponse.Items[0].ItemId.VideoId);
    }
}