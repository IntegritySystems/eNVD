using System;
using System.Configuration;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp
{
    public class Authentication
    {
        private readonly HttpClient _client;

        public Authentication()
        {
            _client = new HttpClient()
            {
                BaseAddress = new Uri(ConfigurationManager.AppSettings["AuthTokenBaseAddress"])
            };
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
        }

        public string RequestAuthenticationToken()
        {
            var body = BuildAuthRequestBody();
            var content = new StringContent(body, Encoding.UTF8, "application/x-www-form-urlencoded");

            var response =
                _client.PostAsync($"{ConfigurationManager.AppSettings["AuthTokenRequestUri"]}", content)
                    .GetAwaiter()
                    .GetResult();

            response.EnsureSuccessStatusCode();

            return JToken.Parse(response.Content.ReadAsStringAsync().Result).SelectToken("access_token")?.ToString();
        }

        private string BuildAuthRequestBody()
        {
            string username = null;
            string password = null;
            int authScope;
            do
            {
                Console.Clear();
                Console.WriteLine("Please Provide Authentication Details: ");
                Console.WriteLine(
                    $"Available Scope: {Environment.NewLine} 1. Login with LPA{Environment.NewLine} 2. Login with NLIS{Environment.NewLine} 3. Login with My Mla");
                Console.Write("Enter value: ");

                int.TryParse(Console.ReadLine(), out authScope);
                if (authScope <= 0 || authScope > 3)
                    continue;

                Console.Write("Enter User Name: ");
                username = Console.ReadLine();
                Console.Write("Enter Password: ");
                password = Console.ReadLine();

            } while (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password));

            var clientId =
                ConfigurationManager.AppSettings[
                    $"{(authScope == 1 ? "Lpa" : authScope == 2 ? "Nlis" : "MyMla")}.SSO.Client.Id"];

            var clientSecret =
                ConfigurationManager.AppSettings[
                    $"{(authScope == 1 ? "Lpa" : authScope == 2 ? "Nlis" : "MyMla")}.SSO.Client.Secret"];

            var grantType =
                ConfigurationManager.AppSettings[
                    $"{(authScope == 1 ? "Lpa" : authScope == 2 ? "Nlis" : "MyMla")}.SSO.Grant.Type"];

            var scope =
                ConfigurationManager.AppSettings[
                    $"{(authScope == 1 ? "Lpa" : authScope == 2 ? "Nlis" : "MyMla")}.SSO.Scope"];

            return
                $"client_id={clientId}&client_secret={clientSecret}&grant_type={grantType}&scope={scope}&username={username}&password={password}";
        }

    }
}
