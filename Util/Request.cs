namespace TrailerFlix.Util;

public static class Request
{
    public static HttpResponseMessage Get(HttpClient client, string uri)
    {
        return client.GetAsync(uri).Result;
    }

    public static HttpResponseMessage Post(HttpClient client, string uri, StringContent content)
    {
        return client.PostAsync(uri, content).Result;
    }
}