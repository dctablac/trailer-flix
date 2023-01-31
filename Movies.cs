// Functions for communicating with TMDb API
namespace TrailerFlix;

using System.Text.Json;
using System.Text;
using TrailerFlix.Util;
using TrailerFlix.Records;

public static class Movies
{
    // Config for getting API key
    private static IConfiguration _config;
    private static readonly string? TMDBUri;
    private static readonly string? TMDBApiKey;
    private static readonly string? YoutubeApiKey;
    private static readonly string? YoutubeUri;

    private static readonly string? TrailerUri;

    // Get helper to map get requests to their corresponding Record<T>
    private static T? _GetMovieData<T>(HttpClient client, Uri endpoint)
    {
        HttpResponseMessage res = Request.Get(client, endpoint);
        return res.IsSuccessStatusCode ? res.Content.ReadFromJsonAsync<T>().Result : default(T);
    }

     // Reduce Crew entries
    private static List<CrewMember> _CondenseCrewMemberJobs(MovieCreditsRaw creditsInfo)
    {
        Dictionary <int,CrewMember> crewJobs = new(); // Map crew ID to their list of jobs
        Dictionary <int,int> crewOrder = new(); // Map each member to their position in the Crew array so it is not scrambled when sent to client

        // Map each crew member id to their job list
        for (int i = 0; i < creditsInfo.Crew.Count; i++)
        {
            CrewMemberRaw member = creditsInfo.Crew[i];
            // Create a new list of jobs for new member
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
            // Save their position in the original list if haven't seen
            if (!crewOrder.ContainsKey(member.Id))
            {
                crewOrder.Add(member.Id, i);
            }
            // Add job to their list
            crewJobs[member.Id].Jobs.Add(member.Job); 
        }

        // Reform Crew list with reduced entries
        List<CrewMember> condensedCrew = new List<CrewMember>(new CrewMember[creditsInfo.Crew.Count]);
        foreach( int memberId in crewJobs.Keys )
        {
            // At their position in the original list, place the new CrewMember object
            int position = crewOrder[memberId];
            CrewMember member = crewJobs[memberId];
            condensedCrew[position] = member;
        }

        return condensedCrew.FindAll(member => member is not null); // null values present since Crew Members condensed. skip them.
    }

    // Get movie trailer id
    private static string? _GetVideoId(HttpClient client, HttpRequest request, MovieInfo info)
    {
        string? videoId;
        // Send a request to the trailer endpoint in this domain
        Uri getTrailerUri = new Uri($"https://{request.Host.Value}{TrailerUri}/{info.Id}");
        try
        {
            HttpResponseMessage res = Request.Get(client, getTrailerUri);
            res.EnsureSuccessStatusCode();
            Trailer? trailer = res.Content.ReadFromJsonAsync<Trailer>().Result;
            return trailer!.VideoId;
        }
        catch(Exception e) // Get videoId from YouTube instead
        {
            Console.WriteLine(e);

            // Build search query: [title] [year] 'trailer'
            string year = info.ReleaseDate.Split("-")[0];
            string search = $"{info.Title} {year} trailer";
            Console.WriteLine($"Searching YouTube for {search}");

            // Get movie trailer from YouTube search API
            Uri ytUri = new Uri($"{YoutubeUri}&q={search}");
            try
            {
                HttpResponseMessage res = Request.Get(client, ytUri);
                res.EnsureSuccessStatusCode();
                YoutubeSearch? searchRes = res.Content.ReadFromJsonAsync<YoutubeSearch>().Result;
                if (searchRes is null)
                {
                    throw new Exception("No results found for this YouTube search.");
                }
                videoId = searchRes.Items[0].ItemId.VideoId; // Refer to YouTube API docs on accessing video Id for search query

                Console.WriteLine($"Adding videoId ({videoId}) to cache.");
                // Cache this videoId in the db.
                Trailer trailer = new Trailer(info.Id, videoId);
                string reqBody = JsonSerializer.Serialize(trailer);

                StringContent stringContent = new StringContent(reqBody, UnicodeEncoding.UTF8, "application/json");
                Uri postTrailerUri = new Uri($"https://{request.Host}{TrailerUri}");
                HttpResponseMessage cacheRes = Request.Post(client, postTrailerUri, stringContent);

                string cacheResString = cacheRes.Content.ReadAsStringAsync().Result;
                Console.WriteLine(cacheResString);
            }
            catch(Exception e2)
            {
                Console.WriteLine(e2);
                return null;
            }
        }
        
        return videoId;
    }

    static Movies()
    {
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
        _config = _configBuilder.Build();

        TMDBUri = _config["TMDB_URL"];
        TMDBApiKey = _config["TMDB_KEY"];
        YoutubeApiKey = _config["YT_KEY"];
        YoutubeUri = _config["YT_URL"] + YoutubeApiKey;
        TrailerUri = _config["TRAILER_URL"];
    }

    // Get upcoming movies
    public static MoviePosters? GetUpcoming(HttpClient client)
    {
        Uri upcomingUri = new Uri($"{TMDBUri}/movie/upcoming?api_key={TMDBApiKey}");
        return _GetMovieData<MoviePosters>(client, upcomingUri);
    }

    // Get now playing movies
    public static MoviePosters? GetNowPlaying(HttpClient client)
    {
        Uri nowPlayingUri = new Uri($"{TMDBUri}/movie/now_playing?api_key={TMDBApiKey}");
        return _GetMovieData<MoviePosters>(client, nowPlayingUri);
    }
    
    // Get all popular movies
    public static MoviePosters? GetPopular(HttpClient client)
    {
        Uri popularUri = new Uri($"{TMDBUri}/movie/popular?api_key={TMDBApiKey}");
        return _GetMovieData<MoviePosters>(client, popularUri);
    }

    // Get movies by search query
    public static MoviePosters? GetSearch(HttpClient client, string query)
    {
        Uri searchUri = new Uri($"{TMDBUri}/search/movie?api_key={TMDBApiKey}&query={query}");
        return _GetMovieData<MoviePosters>(client, searchUri);
        
    }

    // Get movie details by id
    public static MovieDetails? GetById(HttpClient client, HttpRequest request, int movieId)
    {
        // Get movie details
        Uri infoUri = new Uri($"{TMDBUri}/movie/{movieId}?api_key={TMDBApiKey}");
        MovieInfo? movieInfo = _GetMovieData<MovieInfo>(client, infoUri);
        if (movieInfo is null) { return null; }

        // Get cast and crew
        Uri creditsUri = new Uri($"{TMDBUri}/movie/{movieId}/credits?api_key={TMDBApiKey}");
        MovieCreditsRaw? creditsInfo = _GetMovieData<MovieCreditsRaw>(client, creditsUri);
        if (creditsInfo is null) { return null; }

        // Condensed redundant CrewMembers into one object with a list of their jobs
        List<CrewMember> condensedCrew = _CondenseCrewMemberJobs(creditsInfo);

        // Create a finalCreditsInfo object
        MovieCredits finalCreditsInfo = new (creditsInfo.Cast, condensedCrew);

        // Retrieve videoId from database, otherwise use YouTube API if not found
        string? videoId = _GetVideoId(client, request, movieInfo);
        
        return new MovieDetails(movieInfo, finalCreditsInfo, videoId);
    }
}