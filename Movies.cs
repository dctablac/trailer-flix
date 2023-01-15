// Functions for communicating with TMDb API
namespace TrailerFlix;

using System.Text.Json;
using System.Text;

public static class Movies
{
    private static readonly string TMDBUri = "https://api.themoviedb.org/3";
    private static readonly string TMDBApiKey = "106bb0c01a5baebe8e721233be42eb3a";
    private static readonly string YoutubeAPIKey = "AIzaSyAG57UZIEQyZzxvpe_Zp0ZVidzDk-SMN7Q";
    private static readonly string YoutubeUri = $"https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key={YoutubeAPIKey}";

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
    public static async Task<MovieDetails> GetById(HttpClient client, int id)
    {
        // Get movie details
        string infoUri = $"{TMDBUri}/movie/{id}?api_key={TMDBApiKey}";
        Stream stream = await client.GetStreamAsync(infoUri);
        var infoResponse = 
                await JsonSerializer.DeserializeAsync<MovieInfo>(stream);

        // Get cast and crew
        string creditsUri = $"{TMDBUri}/movie/{id}/credits?api_key={TMDBApiKey}";
        stream = await client.GetStreamAsync(creditsUri);
        var creditsResponse = 
            await JsonSerializer.DeserializeAsync<MovieCredits>(stream);

        // Retrieve from database, otherwise YouTube if not found
        var videoId = "";
        string getTrailerUri = $"https://localhost:7234/api/movies/trailer/{id}";
        stream = await client.GetStreamAsync(getTrailerUri);
        try 
        {
            var trailersResponse = 
                await JsonSerializer.DeserializeAsync<Records.Trailer>(stream);
            videoId = trailersResponse.VideoId;
            // Console.WriteLine($"Trailer for movie: {id} found in the db.");
        }
        catch
        {
            // Get movie trailer from YouTube search API
            // Build search query: [title] [year] 'trailer'
            string year = infoResponse.ReleaseDate.Split("-")[0];
            string search = $"{infoResponse.Title} {year} trailer";

            string ytUri = $"{YoutubeUri}&q={search}";
            stream = await client.GetStreamAsync(ytUri);
            try
            {
                var searchResponse =
                    await JsonSerializer.DeserializeAsync<YoutubeSearch>(stream);
                videoId = searchResponse.Items[0].ItemId.VideoId;

                // Cache this result into db
                var trailer = new Records.Trailer(id, videoId);
                var json = JsonSerializer.Serialize(trailer);
                var stringContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");
                string postTrailerUri = "https://localhost:7234/api/movies/trailer";
                var response = await client.PostAsync(postTrailerUri, stringContent);
                var responseString = await response.Content.ReadAsStringAsync();
                // Console.WriteLine(responseString);
            }
            catch
            {
                return null;
            }
        }
        return new MovieDetails(infoResponse, creditsResponse, videoId);
    }
}