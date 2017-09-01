using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp.Strategy
{
    public class GetAvailableProgramForSpeciesStrategy : MenuOptionStrategy
    {
        private readonly ApiHelper _apiHelper;

        public GetAvailableProgramForSpeciesStrategy(ApiHelper apiHelper)
        {
            _apiHelper = apiHelper;
        }

        public override string Execute(IDictionary<string, string> args)
        {
            string species;
            args.TryGetValue(nameof(species), out species);
            return _apiHelper.GetAvailablePrograms(species);
        }

        public override void Print(JToken data)
        {
            Console.WriteLine(Environment.NewLine);
            Console.WriteLine("Response:" + Environment.NewLine);
            if (data.SelectToken("Value") == null)
            {
                Console.WriteLine(data);
                return;
            }

            Console.WriteLine($"{string.Empty,-2}{"Program Code",-15}Display Name");
            Console.WriteLine($"{string.Empty.PadLeft(14, '-'),-17}{string.Empty.PadLeft(40, '-')}");
            data.SelectToken("Value").Select(s => s).ToList().ForEach(program =>
            {
                Console.WriteLine(
                    $"{string.Empty,-2}{program.SelectToken("Program"),-15}{program.SelectToken("DisplayName")}");
            });
        }
    }
}
