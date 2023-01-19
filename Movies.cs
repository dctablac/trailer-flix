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

    // Get upcoming movies
    public static async Task<MoviePosters> GetUpcoming(HttpClient client)
    {
        string uri = $"{TMDBUri}/movie/upcoming?api_key={TMDBApiKey}";
        await using Stream stream = await client.GetStreamAsync(uri);
        var response = 
            await JsonSerializer.DeserializeAsync<MoviePosters>(stream);
        return response;
    }

    // Get now playing movies
    public static async Task<MoviePosters> GetNowPlaying(HttpClient client)
    {
        string uri = $"{TMDBUri}/movie/now_playing?api_key={TMDBApiKey}";
        await using Stream stream = await client.GetStreamAsync(uri);
        var response = 
            await JsonSerializer.DeserializeAsync<MoviePosters>(stream);
        return response;
    }
    
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
        Stream stream;

        // Get movie details
        string infoUri = $"{TMDBUri}/movie/{id}?api_key={TMDBApiKey}";
        stream = await client.GetStreamAsync(infoUri);
        var infoResponse = 
                await JsonSerializer.DeserializeAsync<MovieInfo>(stream);

        // Get cast and crew
        string creditsUri = $"{TMDBUri}/movie/{id}/credits?api_key={TMDBApiKey}";
        stream = await client.GetStreamAsync(creditsUri);
        var creditsResponse = 
            await JsonSerializer.DeserializeAsync<MovieCreditsRaw>(stream); // Initial crew without jobs consolidated

        // Consolidate crew with their jobs to prevent repeated entries
        Dictionary <int,CrewMember> crewJobs = new(); // Map crew ID to their list of jobs
        List<CrewMember> consolidatedCrew = new(); // Final Crew list
        // Map each crew member id to their job list
        creditsResponse.Crew.ForEach((member) => {
            // If we haven't seen this crew member before, create an entry
            if (!crewJobs.ContainsKey(member.Id)) 
            {
                crewJobs.Add(
                    member.Id, 
                    new CrewMember(
                        member.Id, 
                        member.ProfilePath, 
                        member.Name, 
                        member.Department, 
                        new List<string>()
                    )
                );
            }
            crewJobs[member.Id].Jobs.Add(member.Job); // Add job to their list
        });
        // Add to consolidatedCrew
        foreach( int memberId in crewJobs.Keys )
        {
            consolidatedCrew.Add(crewJobs[memberId]);
        }
        // Create a finalCreditsResponse with crew jobs consolidated
        var finalCreditsResponse = new MovieCredits(creditsResponse.Cast, consolidatedCrew);

        // Retrieve videoId from database, otherwise use YouTube API if not found
        var videoId = "";
        string getTrailerUri = $"https://localhost:7234/api/movies/trailer/{id}";
        stream = await client.GetStreamAsync(getTrailerUri);
        try 
        {
            var trailersResponse = 
                await JsonSerializer.DeserializeAsync<Records.Trailer>(stream);
            videoId = trailersResponse.VideoId;
        }
        catch
        { // Get videoId of first result from YouTube instead
            // Build search query: [title] [year] 'trailer'
            string year = infoResponse.ReleaseDate.Split("-")[0];
            string search = $"{infoResponse.Title} {year} trailer";

            // Get movie trailer from YouTube search API
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
                var cacheResponse = await client.PostAsync(postTrailerUri, stringContent);
                // var responseString = await cacheResponse.Content.ReadAsStringAsync();
            }
            catch
            {
                return null;
            }
        }
        return new MovieDetails(infoResponse, finalCreditsResponse, videoId);
    }
}