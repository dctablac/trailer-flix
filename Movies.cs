// Functions for communicating with TMDb API
namespace TrailerFlix;

using System.Text.Json;
using System.Text;

public static class Movies
{
    // Config for getting API key
    private static IConfiguration config = new ConfigurationBuilder()
                                                    .SetBasePath(Directory.GetCurrentDirectory())
                                                    .AddJsonFile("appsettings.json", false)
                                                    .AddJsonFile("appsettings.Development.json", true)
                                                    .AddEnvironmentVariables()
                                                    .Build();
    private static readonly string TMDBUri = config["TMDB_URL"];
    private static readonly string TMDBApiKey = config["TMDB_KEY"];
    private static readonly string YoutubeApiKey = config["YT_KEY"];
    private static readonly string YoutubeUri = config["YT_URL"] + YoutubeApiKey;

    private static readonly string TrailerUri = config["TRAILER_URL"];

    
    
    

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
        string getTrailerUri = $"{TrailerUri}/{id}";
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
                var cacheResponse = await client.PostAsync(TrailerUri, stringContent);
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