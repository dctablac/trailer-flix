namespace TrailerFlix.Util;

public static class Request
{
    public static HttpResponseMessage Get(HttpClient client, Uri uri)
    {
        return client.GetAsync(uri).Result;
    }

    public static HttpResponseMessage Post(HttpClient client, Uri uri, StringContent content)
    {
        return client.PostAsync(uri, content).Result;
    }
}