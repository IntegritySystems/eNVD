using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using Nlis.DotNet.ConsoleApp.Strategy;

namespace Nlis.DotNet.ConsoleApp
{
    public class MenuOptionContext
    {
        private readonly IDictionary<int, MenuOptionStrategy> _strategies;
        public int StrategyIndex { get; set; } = 0;

        public MenuOptionContext(string apiBaseUrl, string authToken)
        {
            var client = new HttpClient { BaseAddress = new Uri(apiBaseUrl) };
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", authToken);

            var apiHelper = new ApiHelper(client);

            var consignmentListStrategy = new GetConsignmentListStrategy(apiHelper);
            _strategies = new Dictionary<int, MenuOptionStrategy>
            {
                {1, new GetAvailableProgramForSpeciesStrategy(apiHelper) },
                {2, consignmentListStrategy },
                {3, consignmentListStrategy },
                {4, new GetConsignmentDetailsStrategy(apiHelper) },
                {5, new CreateNewConsignmentStrategy(apiHelper) },
                {6, new AddFormToExistingConsignmentStrategy(apiHelper) }
            };
        }

        public string Execute(IDictionary<string, string> args)
        {
            EnsureStrategyExists();

            return _strategies[StrategyIndex].Execute(args);
        }

        public void Print(JToken data)
        {
            EnsureStrategyExists();

            _strategies[StrategyIndex].Print(data);
        }

        private void EnsureStrategyExists()
        {
            if (!_strategies.ContainsKey(StrategyIndex))
                throw new ApplicationException("Unknown option.");
        }
    }
}
