namespace TrailerFlix.Services;

using System.Text;
using System.Text.Json;
using TrailerFlix.Util;
using TrailerFlix.Records;

public class MovieService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string? TMDBApiKey;
    private readonly string? YouTubeUri;
    public MovieService(IHttpClientFactory httpClientFactory)
    {
        // Instantiate httpClient
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

        // Parse for key and urls
        TMDBApiKey = _config["TMDB_KEY"];
        YouTubeUri = _config["YT_URL"];
    }

    // Get upcoming movies
    public MoviePosters? GetUpcoming()
    {
        HttpClient httpClient = _httpClientFactory.CreateClient("TMDB");
        string upcomingUri = $"movie/upcoming?api_key={TMDBApiKey}";
        return _GetMovieData<MoviePosters>(httpClient, upcomingUri);
    }

    // Get now playing movies
    public MoviePosters? GetNowPlaying()
    {
        HttpClient httpClient = _httpClientFactory.CreateClient("TMDB");
        string nowPlayingUri = $"movie/now_playing?api_key={TMDBApiKey}";
        return _GetMovieData<MoviePosters>(httpClient, nowPlayingUri);
    }
    
    // Get all popular movies
    public MoviePosters? GetPopular()
    {
        HttpClient httpClient = _httpClientFactory.CreateClient("TMDB");
        string popularUri = $"movie/popular?api_key={TMDBApiKey}";
        return _GetMovieData<MoviePosters>(httpClient, popularUri);
    }

    // Get movies by search query
    public MoviePosters? GetSearch(string query)
    {
        HttpClient httpClient = _httpClientFactory.CreateClient("TMDB");
        string searchUri = $"search/movie?api_key={TMDBApiKey}&query={query}";
        return _GetMovieData<MoviePosters>(httpClient, searchUri);
    }

    // Get movie details by id
    public MovieDetails? GetById(HttpRequest request, int movieId)
    {
        HttpClient httpClient = _httpClientFactory.CreateClient("TMDB");
        // Get movie info
        string infoUri = $"movie/{movieId}?api_key={TMDBApiKey}";
        MovieInfo? movieInfo = _GetMovieData<MovieInfo>(httpClient, infoUri);
        if (movieInfo is null) { return null; }

        // Get cast and crew
        string creditsUri = $"movie/{movieId}/credits?api_key={TMDBApiKey}";
        MovieCreditsRaw? creditsInfo = _GetMovieData<MovieCreditsRaw>(httpClient, creditsUri);
        if (creditsInfo is null) { return null; }

        // Condensed redundant CrewMembers into one object with a list of their jobs
        List<CrewMember> condensedCrew = _CondenseCrewMemberJobs(creditsInfo);

        // Create a finalCreditsInfo object
        MovieCredits finalCreditsInfo = new (creditsInfo.Cast, condensedCrew);

        // Retrieve videoId from database, otherwise use YouTube API if not found
        string? videoId = _GetVideoId(request, movieInfo);
        
        return new MovieDetails(movieInfo, finalCreditsInfo, videoId);
    }


    // ------------------------------- Helpers ------------------------------- //

    // Get helper to map get requests to their corresponding Record<T>
    private T? _GetMovieData<T>(HttpClient client, string uri)
    {
        HttpResponseMessage res = Request.Get(client, uri);
        return res.IsSuccessStatusCode ? res.Content.ReadFromJsonAsync<T>().Result : default(T);
    }

     // Reduce Crew entries
    private List<CrewMember> _CondenseCrewMemberJobs(MovieCreditsRaw creditsInfo)
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

    // Get movie trailer YouTube videoId
    private string? _GetVideoId(HttpRequest request, MovieInfo info)
    {
        HttpClient httpClient = _httpClientFactory.CreateClient();
        string trailerUri = $"https://{request.Host}/api/movies/trailer";
        try // See if we have the trailer's videoId in the db already
        {
            var cacheRes = Request.Get(httpClient, $"{trailerUri}/{info.Id}");
            cacheRes.EnsureSuccessStatusCode();
            Trailer? trailer = cacheRes.Content.ReadFromJsonAsync<Trailer>().Result;
            return trailer!.VideoId;
        }
        catch // Get videoId from YouTube instead
        {
            // Build search query: [title] [year] 'trailer'
            string year = info.ReleaseDate.Split("-")[0];
            string search = $"{info.Title} {year} trailer";

            // Build YouTube url to send the search request to
            UriBuilder ytUriBuilder = new UriBuilder(YouTubeUri!);
            ytUriBuilder.Query += $"&q={search}";
            Uri ytUri = ytUriBuilder.Uri;

            string? videoId = _RequestVideoId(httpClient, ytUri);
            if (videoId is not null)
            {
                _CacheVideoId(httpClient, trailerUri, info.Id, videoId!);
                return videoId;
            }
            
            return null;
        }
    }

    // Store the videoId in our db
    private void _CacheVideoId(HttpClient httpClient, string trailerUri, int movieId, string videoId)
    {
        // Create a new trailer to send as a request body
        Trailer trailer = new Trailer(movieId, videoId);
        string reqBody = JsonSerializer.Serialize(trailer);
        // Serialize req body as a json string
        var stringContent = new StringContent(reqBody, UnicodeEncoding.UTF8, "application/json");
        // Send the request
        var cacheRes = Request.Post(httpClient, trailerUri, stringContent);
        // Output the response
        // string cacheResString = cacheRes.Content.ReadAsStringAsync().Result;
    }

    // Make the HTTPRequest to YouTube
    private string? _RequestVideoId(HttpClient httpClient, Uri ytUri)
    {
        HttpResponseMessage res = Request.Get(httpClient, ytUri.AbsoluteUri);
        res.EnsureSuccessStatusCode();
        YoutubeSearch? searchRes = res.Content.ReadFromJsonAsync<YoutubeSearch>().Result;
        // Refer to YouTube API docs to confirm parsing of VideoId in response
        return searchRes is not null ? searchRes.Items[0].ItemId.VideoId : null; 
    }

    // ----------------------------------------------------------------------- //
}